import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Flame } from 'lucide-react';
import { useVideo } from '../contexts/VideoContextWithCloudinary';
import { Video } from '../types';
import VideoCard from '../components/VideoCard';

const Trending: React.FC = () => {
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { getTrendingVideos } = useVideo();

  const categories = [
    'All',
    'Gaming',
    'Music',
    'Sports',
    'News',
    'Entertainment'
  ];

  const loadTrendingVideos = useCallback(async () => {
    try {
      setLoading(true);
      const videos = await getTrendingVideos();
      setTrendingVideos(videos);
    } catch (error) {
      console.error('Error loading trending videos:', error);
    } finally {
      setLoading(false);
    }
  }, [getTrendingVideos]);

  useEffect(() => {
    loadTrendingVideos();
  }, [loadTrendingVideos]);

  const filteredVideos = selectedCategory === 'All' 
    ? trendingVideos 
    : trendingVideos.filter(video => video.category === selectedCategory);

  if (loading) {
    return (
      <div className="pt-16 px-3 sm:px-6 pb-safe-bottom">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-youtube-gray rounded w-32 sm:w-48 mb-4 sm:mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2 sm:space-y-3">
                <div className="aspect-video bg-youtube-gray rounded-lg"></div>
                <div className="h-3 sm:h-4 bg-youtube-gray rounded"></div>
                <div className="h-3 bg-youtube-gray rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 px-3 sm:px-6 pb-safe-bottom">
      {/* Header */}
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-youtube-red rounded-full flex items-center justify-center">
          <Flame size={16} className="sm:w-5 sm:h-5 text-white" />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Trending</h1>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 sm:space-x-3 mb-6 sm:mb-8 overflow-x-auto scrollbar-hide -mx-3 sm:mx-0 px-3 sm:px-0">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-colors text-sm sm:text-base flex-shrink-0 ${
              selectedCategory === category
                ? 'bg-white text-black'
                : 'bg-youtube-gray text-white hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Trending Videos */}
      {filteredVideos.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Top 3 Featured */}
          {filteredVideos.slice(0, 3).map((video, index) => (
            <div key={video.id} className="flex flex-col sm:flex-row gap-3 sm:gap-6 bg-youtube-gray rounded-lg p-3 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4 sm:flex-col sm:space-x-0 sm:space-y-2 flex-shrink-0">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-youtube-red">
                  #{index + 1}
                </div>
                <TrendingUp className="text-youtube-red" size={20} />
              </div>
              
              <div className="w-full sm:w-48 md:w-64 lg:w-80 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 line-clamp-2 break-words">
                  {video.title}
                </h3>
                
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0">
                    {video.uploaderAvatar ? (
                      <img
                        src={video.uploaderAvatar}
                        alt={video.uploaderName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-youtube-red flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                        {video.uploaderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold text-sm sm:text-base truncate">{video.uploaderName}</span>
                </div>
                
                <div className="text-youtube-lightgray mb-2 sm:mb-3 text-sm sm:text-base">
                  {video.views.toLocaleString()} views • {new Date(video.createdAt).toLocaleDateString()}
                </div>
                
                <p className="text-youtube-lightgray line-clamp-2 sm:line-clamp-3 text-sm sm:text-base break-words">
                  {video.description}
                </p>
                
                <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-4 space-y-1 xs:space-y-0 mt-3 sm:mt-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs sm:text-sm">{video.likes.toLocaleString()} likes</span>
                  </div>
                  <div className="text-xs sm:text-sm text-youtube-lightgray">
                    {video.category}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Rest of the videos in grid */}
          {filteredVideos.length > 3 && (
            <>
              <div className="border-t border-youtube-gray pt-6 sm:pt-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">More trending videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                  {filteredVideos.slice(3).map((video, index) => (
                    <div key={video.id} className="relative">
                      <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded z-10">
                        #{index + 4}
                      </div>
                      <VideoCard video={video} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 px-3 sm:px-0">
          <TrendingUp size={48} className="sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-youtube-lightgray" />
          <p className="text-youtube-lightgray text-base sm:text-lg">
            {selectedCategory === 'All' 
              ? 'No trending videos available right now'
              : `No trending videos in ${selectedCategory} category`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Trending;