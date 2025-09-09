import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useVideo } from '../contexts/VideoContextWithCloudinary';
import { Video, SearchFilters } from '../types';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'relevance',
    uploadDate: 'any',
    duration: 'any',
    category: 'any'
  });

  const { searchVideos } = useVideo();
  const query = searchParams.get('q') || '';

  const performSearch = useCallback(async () => {
    setLoading(true);
    try {
      const searchResults = await searchVideos(query, filters);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [query, filters, searchVideos]);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, filters, performSearch]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const categories = [
    'any',
    'Gaming',
    'Music',
    'Sports',
    'News',
    'Entertainment',
    'Education',
    'Technology',
    'Travel',
    'Cooking'
  ];

  return (
    <div className="pt-16 px-3 sm:px-6 pb-safe-bottom">
      {/* Search Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold break-words">
            Search results for "{query}"
          </h1>
          <p className="text-youtube-lightgray mt-1 text-sm sm:text-base">
            {results.length} results
          </p>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center space-x-1 sm:space-x-2 bg-youtube-gray hover:bg-gray-600 px-3 sm:px-4 py-2 rounded-full transition-colors text-sm sm:text-base whitespace-nowrap"
        >
          <SlidersHorizontal size={16} />
          <span>Filters</span>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-youtube-gray rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 -mx-3 sm:mx-0">
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Search filters</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Sort by</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as SearchFilters['sortBy'])}
                className="input-field w-full text-sm sm:text-base"
              >
                <option value="relevance">Relevance</option>
                <option value="upload_date">Upload date</option>
                <option value="view_count">View count</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Upload date</label>
              <select
                value={filters.uploadDate}
                onChange={(e) => handleFilterChange('uploadDate', e.target.value as SearchFilters['uploadDate'])}
                className="input-field w-full text-sm sm:text-base"
              >
                <option value="any">Any time</option>
                <option value="hour">Last hour</option>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="year">This year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Duration</label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange('duration', e.target.value as SearchFilters['duration'])}
                className="input-field w-full text-sm sm:text-base"
              >
                <option value="any">Any duration</option>
                <option value="short">Under 4 minutes</option>
                <option value="medium">4-20 minutes</option>
                <option value="long">Over 20 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field w-full text-sm sm:text-base"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'any' ? 'Any category' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-youtube-red"></div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {results.length > 0 ? (
            results.map((video) => (
              <div key={video.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-youtube-gray rounded-lg p-3 sm:p-0 sm:bg-transparent -mx-3 sm:mx-0">
                <div className="w-full sm:w-64 md:w-80 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0 sm:py-1">
                  <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 break-words">
                    {video.title}
                  </h3>
                  
                  <div className="text-xs sm:text-sm text-youtube-lightgray mb-2">
                    {video.views.toLocaleString()} views • {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden flex-shrink-0">
                      {video.uploaderAvatar ? (
                        <img
                          src={video.uploaderAvatar}
                          alt={video.uploaderName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-youtube-red flex items-center justify-center text-white text-xs font-bold">
                          {video.uploaderName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm text-youtube-lightgray truncate">
                      {video.uploaderName}
                    </span>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-youtube-lightgray line-clamp-2 break-words">
                    {video.description}
                  </p>
                  
                  {video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
                      {video.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-youtube-dark px-2 py-0.5 sm:py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 sm:py-12 px-3 sm:px-0">
              <p className="text-youtube-lightgray text-base sm:text-lg">
                No results found for "{query}"
              </p>
              <p className="text-youtube-lightgray mt-2 text-sm sm:text-base">
                Try different keywords or remove search filters
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;