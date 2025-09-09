import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, Share, Download, MoreHorizontal, Bell, Bookmark } from 'lucide-react';
import { useVideo } from '../contexts/VideoContextWithCloudinary';
import { useAuth } from '../contexts/AuthContext';
import { Video, Comment } from '../types';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import AddToPlaylistModal from '../components/AddToPlaylistModal';

import toast from 'react-hot-toast';

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [userLikedVideo, setUserLikedVideo] = useState(false);
  const [userDislikedVideo, setUserDislikedVideo] = useState(false);
  const [channelData, setChannelData] = useState<any>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  
  const { 
    getVideo, 
    likeVideo, 
    dislikeVideo, 
    addComment, 
    getComments, 
    subscribeToChannel, 
    unsubscribeFromChannel,
    incrementViews,
    addToWatchHistory,
    videos
  } = useVideo();
  
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const loadVideo = useCallback(async () => {
    if (id) {
      const videoData = await getVideo(id);
      setVideo(videoData);
      
      // Load channel data for subscriber count
      if (videoData?.uploaderId) {
        try {
          const channelDoc = await getDoc(doc(db, 'users', videoData.uploaderId));
          if (channelDoc.exists()) {
            setChannelData(channelDoc.data());
          }
        } catch (error) {
          console.error('Error loading channel data:', error);
        }
      }
    }
  }, [id, getVideo]);

  const loadComments = useCallback(async () => {
    if (id) {
      const commentsData = await getComments(id);
      setComments(commentsData);
    }
  }, [id, getComments]);

  const checkUserLikeStatus = useCallback(async () => {
    if (currentUser && userProfile && video) {
      const likedVideos = userProfile.likedVideos || [];
      const dislikedVideos = userProfile.dislikedVideos || [];
      
      setUserLikedVideo(likedVideos.includes(video.id));
      setUserDislikedVideo(dislikedVideos.includes(video.id));
    } else {
      setUserLikedVideo(false);
      setUserDislikedVideo(false);
    }
  }, [currentUser, userProfile, video]);

  useEffect(() => {
    if (id) {
      loadVideo();
      loadComments();
      incrementViews(id);
      
      // Add to watch history if user is logged in
      if (currentUser) {
        addToWatchHistory(id);
      }
    }
  }, [id, loadVideo, loadComments, incrementViews, currentUser, addToWatchHistory]);

  useEffect(() => {
    if (video && videos.length > 0) {
      // YouTube-like recommendation algorithm
      const currentVideoTags = video.tags || [];
      const currentCategory = video.category;
      const currentUploaderId = video.uploaderId;
      
      // Score videos based on relevance
      const scoredVideos = videos
        .filter(v => v.id !== video.id)
        .map(v => {
          let score = 0;
          
          // Same category gets high score
          if (v.category === currentCategory) score += 50;
          
          // Same uploader gets medium score
          if (v.uploaderId === currentUploaderId) score += 30;
          
          // Tag similarity
          const commonTags = v.tags?.filter(tag => 
            currentVideoTags.some(currentTag => 
              currentTag.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(currentTag.toLowerCase())
            )
          ) || [];
          score += commonTags.length * 20;
          
          // Popular videos get bonus (views and likes)
          score += Math.log10(v.views + 1) * 5;
          score += Math.log10(v.likes + 1) * 3;
          
          // Recent videos get slight bonus
          const daysSinceUpload = (Date.now() - v.createdAt.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceUpload < 7) score += 10;
          else if (daysSinceUpload < 30) score += 5;
          
          // User's subscribed channels get bonus
          if (userProfile?.subscribedTo?.includes(v.uploaderId)) {
            score += 25;
          }
          
          return { ...v, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 15); // Get top 15 recommendations
      
      setRelatedVideos(scoredVideos);
      
      // Check if user is subscribed
      if (userProfile && userProfile.subscribedTo && video) {
        setIsSubscribed(userProfile.subscribedTo.includes(video.uploaderId));
      } else {
        setIsSubscribed(false);
      }
      
      // Check user's like/dislike status
      checkUserLikeStatus();
    }
  }, [video, videos, userProfile, checkUserLikeStatus]);

  const handleLike = async () => {
    if (video) {
      await likeVideo(video.id);
      // Update local state immediately for better UX
      setUserLikedVideo(!userLikedVideo);
      if (userDislikedVideo) {
        setUserDislikedVideo(false);
      }
      // Refresh video data
      const updatedVideo = await getVideo(video.id);
      if (updatedVideo) {
        setVideo(updatedVideo);
      }
    }
  };

  const handleDislike = async () => {
    if (video) {
      await dislikeVideo(video.id);
      // Update local state immediately for better UX
      setUserDislikedVideo(!userDislikedVideo);
      if (userLikedVideo) {
        setUserLikedVideo(false);
      }
      // Refresh video data
      const updatedVideo = await getVideo(video.id);
      if (updatedVideo) {
        setVideo(updatedVideo);
      }
    }
  };

  const handleSubscribe = async () => {
    if (!currentUser) {
      toast.error('Please login to subscribe');
      return;
    }
    if (video) {
      try {
        if (isSubscribed) {
          await unsubscribeFromChannel(video.uploaderId);
          setIsSubscribed(false);
          // Update channel data to reflect new subscriber count
          if (channelData) {
            setChannelData({
              ...channelData,
              subscribers: Math.max(0, channelData.subscribers - 1)
            });
          }
        } else {
          await subscribeToChannel(video.uploaderId);
          setIsSubscribed(true);
          // Update channel data to reflect new subscriber count
          if (channelData) {
            setChannelData({
              ...channelData,
              subscribers: channelData.subscribers + 1
            });
          }
        }
      } catch (error) {
        console.error('Error handling subscription:', error);
        // Revert the UI state if the operation failed
        setIsSubscribed(!isSubscribed);
      }
    }
  };

  const handleShare = async () => {
    if (video) {
      const shareUrl = `${window.location.origin}/watch/${video.id}`;
      
      if (navigator.share) {
        // Use native share API if available
        try {
          await navigator.share({
            title: video.title,
            text: `Check out this video: ${video.title}`,
            url: shareUrl,
          });
          toast.success('Shared successfully!');
        } catch (error) {
          // User cancelled sharing
        }
      } else {
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard!');
        } catch (error) {
          toast.error('Failed to copy link');
        }
      }
    }
  };

  const handleDownload = () => {
    if (video) {
      // For now, just show a message. In a real app, you'd implement actual download
      toast('Download feature coming soon! For now, you can right-click the video to save.');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please login to comment');
      return;
    }
    if (!newComment.trim() || !video) return;

    await addComment(video.id, newComment.trim());
    setNewComment('');
    loadComments();
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatSubscribers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M subscribers`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K subscribers`;
    }
    return `${count} subscribers`;
  };

  if (!video) {
    return (
      <div className="pt-16 px-6">
        <div className="animate-pulse">
          <div className="aspect-video bg-youtube-gray rounded-lg mb-4"></div>
          <div className="h-6 bg-youtube-gray rounded mb-2"></div>
          <div className="h-4 bg-youtube-gray rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-safe-bottom">
      <div className="flex flex-col lg:flex-row gap-0 lg:gap-6">
        {/* Main Video Section */}
        <div className="flex-1">
          {/* Video Player - Responsive container */}
          <div className="aspect-video bg-black rounded-none md:rounded-lg overflow-hidden mb-3 md:mb-4 mx-0 md:mx-3 lg:mx-6 max-w-full">
            <ReactPlayer
              url={video.videoUrl}
              width="100%"
              height="100%"
              controls
              playing={false}
              config={{
                file: {
                  attributes: {
                    crossOrigin: 'anonymous',
                    controlsList: 'nodownload'
                  }
                }
              }}
              onError={(error) => {
                console.error('Video player error:', error);
                toast.error('Error loading video. Please try refreshing the page.');
              }}
              fallback={
                <div className="flex items-center justify-center h-full bg-youtube-gray">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📹</div>
                    <p className="text-white">Video not available</p>
                    <p className="text-youtube-lightgray text-sm">Please try again later</p>
                  </div>
                </div>
              }
            />
          </div>

          {/* Video Info */}
          <div className="px-3 lg:px-6 mb-4 md:mb-6">
            <h1 className="text-base md:text-xl font-bold mb-2 leading-tight">{video.title}</h1>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-3 md:space-y-0">
              <div className="text-youtube-lightgray text-sm md:text-base">
                <span>{formatViews(video.views)}</span>
                <span className="mx-2">•</span>
                <span>{formatDistanceToNow(video.createdAt, { addSuffix: true })}</span>
              </div>
              
              <div className="flex items-center space-x-1 md:space-x-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-full transition-colors text-sm md:text-base whitespace-nowrap flex-shrink-0 ${
                    userLikedVideo 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-youtube-gray hover:bg-gray-600'
                  }`}
                >
                  <ThumbsUp size={16} className={`md:w-5 md:h-5 ${userLikedVideo ? 'fill-current' : ''}`} />
                  <span>{formatNumber(video.likes)}</span>
                </button>
                
                <button
                  onClick={handleDislike}
                  className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-full transition-colors text-sm md:text-base whitespace-nowrap flex-shrink-0 ${
                    userDislikedVideo 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-youtube-gray hover:bg-gray-600'
                  }`}
                >
                  <ThumbsDown size={16} className={`md:w-5 md:h-5 ${userDislikedVideo ? 'fill-current' : ''}`} />
                  <span>{formatNumber(video.dislikes)}</span>
                </button>
                
                <button 
                  onClick={handleShare}
                  className="flex items-center space-x-1 md:space-x-2 bg-youtube-gray hover:bg-gray-600 px-3 md:px-4 py-2 rounded-full transition-colors text-sm md:text-base whitespace-nowrap flex-shrink-0"
                >
                  <Share size={16} className="md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                
                <button 
                  onClick={() => setShowPlaylistModal(true)}
                  className="flex items-center space-x-1 md:space-x-2 bg-youtube-gray hover:bg-gray-600 px-3 md:px-4 py-2 rounded-full transition-colors text-sm md:text-base whitespace-nowrap flex-shrink-0"
                >
                  <Bookmark size={16} className="md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Save</span>
                </button>
                
                <button 
                  onClick={handleDownload}
                  className="flex items-center space-x-1 md:space-x-2 bg-youtube-gray hover:bg-gray-600 px-3 md:px-4 py-2 rounded-full transition-colors text-sm md:text-base whitespace-nowrap flex-shrink-0"
                >
                  <Download size={16} className="md:w-5 md:h-5" />
                  <span className="hidden md:inline">Download</span>
                </button>
                
                <button className="p-2 bg-youtube-gray hover:bg-gray-600 rounded-full transition-colors flex-shrink-0">
                  <MoreHorizontal size={16} className="md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            {/* Channel Info */}
            <div className="flex items-center justify-between bg-youtube-gray/50 md:rounded-lg p-4">
              <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0">
                  {video.uploaderAvatar ? (
                    <img
                      src={video.uploaderAvatar}
                      alt={video.uploaderName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-youtube-red flex items-center justify-center text-white font-bold text-sm">
                      {video.uploaderName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm md:text-base truncate">{video.uploaderName}</h3>
                  <p className="text-xs md:text-sm text-youtube-lightgray">
                    {channelData ? formatSubscribers(channelData.subscribers || 0) : 'Loading...'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleSubscribe}
                className={`flex items-center space-x-2 px-4 md:px-6 py-2 rounded-full font-semibold transition-colors text-sm md:text-base whitespace-nowrap ml-3 ${
                  isSubscribed
                    ? 'bg-youtube-gray text-white hover:bg-gray-600'
                    : 'bg-youtube-red text-white hover:bg-red-600'
                }`}
              >
                <Bell size={14} className="md:w-4 md:h-4" />
                <span className="hidden md:inline">{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                <span className="md:hidden">{isSubscribed ? 'Subbed' : 'Subscribe'}</span>
              </button>
            </div>

            {/* Description */}
            <div className="mt-4">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-left w-full"
              >
                <div className={`bg-youtube-gray/30 md:rounded-lg p-4 ${showDescription ? '' : 'line-clamp-3'}`}>
                  <p className="whitespace-pre-wrap text-sm md:text-base">{video.description}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="px-3 lg:px-6">
            <h2 className="text-base md:text-lg font-semibold mb-4 border-b border-youtube-gray/50 pb-2">
              {comments.length} Comments
            </h2>
            
            {/* Add Comment */}
            {currentUser && (
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    {userProfile?.photoURL ? (
                      <img
                        src={userProfile.photoURL}
                        alt="Your avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-youtube-red flex items-center justify-center text-white font-bold">
                        {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full bg-transparent border-b border-youtube-gray focus:border-white outline-none resize-none"
                      rows={1}
                    />
                    
                    {newComment.trim() && (
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setNewComment('')}
                          className="px-4 py-2 text-youtube-lightgray hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-youtube-red text-white rounded hover:bg-red-600 transition-colors"
                        >
                          Comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    {comment.userAvatar ? (
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-youtube-red flex items-center justify-center text-white font-bold text-sm">
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm">{comment.userName}</span>
                      <span className="text-xs text-youtube-lightgray">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-2">{comment.content}</p>
                    
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-youtube-lightgray hover:text-white transition-colors">
                        <ThumbsUp size={14} />
                        <span className="text-xs">{comment.likes}</span>
                      </button>
                      
                      <button className="flex items-center space-x-1 text-youtube-lightgray hover:text-white transition-colors">
                        <ThumbsDown size={14} />
                      </button>
                      
                      <button className="text-xs text-youtube-lightgray hover:text-white transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Videos Sidebar - Horizontal on mobile, vertical on desktop */}
        <div className="w-full lg:w-96">
          <h2 className="text-base md:text-lg font-semibold mb-4 px-3 lg:px-0">Related Videos</h2>
          
          {/* Mobile: Horizontal scroll */}
          <div className="lg:hidden">
            <div className="flex space-x-3 overflow-x-auto pb-4 px-3 scrollbar-hide">
              {relatedVideos.slice(0, 10).map((relatedVideo) => (
                <div 
                  key={relatedVideo.id} 
                  className="flex-shrink-0 w-48 cursor-pointer"
                  onClick={() => navigate(`/watch/${relatedVideo.id}`)}
                  data-testid="related-video"
                >
                  <div className="w-full aspect-video rounded-lg overflow-hidden mb-2">
                    <img
                      src={relatedVideo.thumbnailUrl}
                      alt={relatedVideo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">
                    {relatedVideo.title}
                  </h3>
                  <p className="text-xs text-youtube-lightgray mb-1">
                    {relatedVideo.uploaderName}
                  </p>
                  <div className="text-xs text-youtube-lightgray">
                    <span>{formatViews(relatedVideo.views)}</span>
                    <span className="mx-1">•</span>
                    <span>{formatDistanceToNow(relatedVideo.createdAt, { addSuffix: true })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop: Vertical list */}
          <div className="hidden lg:block space-y-4">
            {relatedVideos.map((relatedVideo) => (
              <div 
                key={relatedVideo.id} 
                className="flex space-x-3 cursor-pointer hover:bg-youtube-gray rounded-lg p-2 transition-colors"
                onClick={() => navigate(`/watch/${relatedVideo.id}`)}
                data-testid="related-video"
              >
                <div className="w-40 aspect-video rounded overflow-hidden flex-shrink-0">
                  <img
                    src={relatedVideo.thumbnailUrl}
                    alt={relatedVideo.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1 hover:text-youtube-red transition-colors">
                    {relatedVideo.title}
                  </h3>
                  <p 
                    className="text-xs text-youtube-lightgray mb-1 hover:text-white transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/channel/${relatedVideo.uploaderId}`);
                    }}
                  >
                    {relatedVideo.uploaderName}
                  </p>
                  <div className="text-xs text-youtube-lightgray">
                    <span>{formatViews(relatedVideo.views)}</span>
                    <span className="mx-1">•</span>
                    <span>{formatDistanceToNow(relatedVideo.createdAt, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Add to Playlist Modal */}
      {showPlaylistModal && id && (
        <AddToPlaylistModal 
          videoId={id}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </div>
  );
};

export default Watch;