import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Bell, Video as VideoIcon, PlaySquare } from 'lucide-react';
import { useVideo } from '../contexts/VideoContextWithCloudinary';
import { useAuth } from '../contexts/AuthContext';
import { Video, User } from '../types';
import VideoCard from '../components/VideoCard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Channel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [channelData, setChannelData] = useState<User | null>(null);
  const [channelVideos, setChannelVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'videos' | 'playlists' | 'about'>('videos');
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const { getChannelVideos, subscribeToChannel, unsubscribeFromChannel } = useVideo();
  const { currentUser, userProfile } = useAuth();

  const loadChannelData = useCallback(async () => {
    if (!id) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', id));
      if (userDoc.exists()) {
        setChannelData(userDoc.data() as User);
      }
    } catch (error) {
      console.error('Error loading channel data:', error);
    }
  }, [id]);

  const loadChannelVideos = useCallback(async () => {
    if (!id) return;
    
    try {
      const videos = await getChannelVideos(id);
      setChannelVideos(videos);
    } catch (error) {
      console.error('Error loading channel videos:', error);
    } finally {
      setLoading(false);
    }
  }, [id, getChannelVideos]);

  useEffect(() => {
    if (id) {
      loadChannelData();
      loadChannelVideos();
    }
  }, [id, loadChannelData, loadChannelVideos]);

  useEffect(() => {
    if (userProfile && channelData) {
      setIsSubscribed(userProfile.subscribedTo.includes(channelData.uid));
    }
  }, [userProfile, channelData]);

  const handleSubscribe = async () => {
    if (!currentUser || !channelData) return;
    
    try {
      if (isSubscribed) {
        await unsubscribeFromChannel(channelData.uid);
        setIsSubscribed(false);
        setChannelData(prev => prev ? { ...prev, subscribers: prev.subscribers - 1 } : null);
      } else {
        await subscribeToChannel(channelData.uid);
        setIsSubscribed(true);
        setChannelData(prev => prev ? { ...prev, subscribers: prev.subscribers + 1 } : null);
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  const formatSubscribers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M subscribers`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K subscribers`;
    }
    return `${count} subscribers`;
  };

  if (loading || !channelData) {
    return (
      <div className="pt-16 px-3 sm:px-6">
        <div className="animate-pulse">
          <div className="h-32 sm:h-48 bg-youtube-gray rounded-lg mb-4 sm:mb-6"></div>
          <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-youtube-gray rounded-full"></div>
            <div className="space-y-2">
              <div className="h-5 sm:h-6 bg-youtube-gray rounded w-32 sm:w-48"></div>
              <div className="h-3 sm:h-4 bg-youtube-gray rounded w-24 sm:w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-safe-bottom">
      {/* Channel Banner */}
      <div className="h-32 sm:h-48 bg-gradient-to-r from-youtube-red to-red-600 relative">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Channel Info */}
      <div className="px-3 sm:px-6 -mt-8 sm:-mt-12 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-3 sm:border-4 border-youtube-dark">
            {channelData.photoURL ? (
              <img
                src={channelData.photoURL}
                alt={channelData.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-youtube-red flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold">
                {channelData.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 break-words">{channelData.channelName}</h1>
            <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-3 space-y-1 xs:space-y-0 text-sm sm:text-base text-youtube-lightgray mb-3 sm:mb-4">
              <span>{formatSubscribers(channelData.subscribers)}</span>
              <span className="hidden xs:inline">•</span>
              <span>{channelVideos.length} videos</span>
            </div>
          </div>
          
          {currentUser && currentUser.uid !== channelData.uid && (
            <button
              onClick={handleSubscribe}
              className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 rounded-full font-semibold transition-colors text-sm sm:text-base ${
                isSubscribed
                  ? 'bg-youtube-gray text-white hover:bg-gray-600'
                  : 'bg-youtube-red text-white hover:bg-red-600'
              }`}
            >
              <Bell size={16} className="flex-shrink-0" />
              <span className="whitespace-nowrap">{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-youtube-gray mb-4 sm:mb-6 -mx-3 sm:mx-0 px-3 sm:px-0">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-2 sm:py-3 px-1 border-b-2 font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === 'videos'
                  ? 'border-youtube-red text-white'
                  : 'border-transparent text-youtube-lightgray hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-1 sm:space-x-2">
                <VideoIcon size={16} />
                <span className="text-sm sm:text-base">Videos</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('playlists')}
              className={`py-2 sm:py-3 px-1 border-b-2 font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === 'playlists'
                  ? 'border-youtube-red text-white'
                  : 'border-transparent text-youtube-lightgray hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-1 sm:space-x-2">
                <PlaySquare size={16} />
                <span className="text-sm sm:text-base">Playlists</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('about')}
              className={`py-2 sm:py-3 px-1 border-b-2 font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === 'about'
                  ? 'border-youtube-red text-white'
                  : 'border-transparent text-youtube-lightgray hover:text-white'
              }`}
            >
              <span className="text-sm sm:text-base">About</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="pb-4 sm:pb-8">
          {activeTab === 'videos' && (
            <div className="-mx-3 sm:mx-0">
              {channelVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-6">
                  {channelVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 px-3 sm:px-0">
                  <VideoIcon size={48} className="sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-youtube-lightgray" />
                  <p className="text-youtube-lightgray text-base sm:text-lg">
                    This channel hasn't uploaded any videos yet
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="text-center py-8 sm:py-12 px-3 sm:px-0">
              <PlaySquare size={48} className="sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-youtube-lightgray" />
              <p className="text-youtube-lightgray text-base sm:text-lg">
                No playlists available
              </p>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-4xl">
              <div className="bg-youtube-gray rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">About this channel</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">Channel name</h4>
                    <p className="text-youtube-lightgray text-sm sm:text-base break-words">{channelData.channelName}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">Joined</h4>
                    <p className="text-youtube-lightgray text-sm sm:text-base">
                      {new Date(channelData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 sm:mb-2 text-sm sm:text-base">Stats</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="bg-youtube-dark rounded p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-bold text-youtube-red">
                          {channelData.subscribers.toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm text-youtube-lightgray">Subscribers</div>
                      </div>
                      
                      <div className="bg-youtube-dark rounded p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-bold text-youtube-red">
                          {channelVideos.length}
                        </div>
                        <div className="text-xs sm:text-sm text-youtube-lightgray">Videos</div>
                      </div>
                      
                      <div className="bg-youtube-dark rounded p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-bold text-youtube-red">
                          {channelVideos.reduce((total, video) => total + video.views, 0).toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm text-youtube-lightgray">Total views</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Channel;