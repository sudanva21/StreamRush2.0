import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History as HistoryIcon, Trash2, X, Clock, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useVideo } from '../contexts/VideoContextWithCloudinary';
import { History as HistoryType } from '../types';

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [clearing, setClearing] = useState(false);

  const { currentUser } = useAuth();
  const { getWatchHistory, removeFromWatchHistory, clearWatchHistory } = useVideo();

  useEffect(() => {
    if (currentUser) {
      loadHistory();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadHistory = async () => {
    try {
      const watchHistory = await getWatchHistory();
      setHistory(watchHistory);
    } catch (error) {
      console.error('Error loading watch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromHistory = async (historyId: string) => {
    try {
      await removeFromWatchHistory(historyId);
      setHistory(prev => prev.filter(h => h.id !== historyId));
    } catch (error) {
      console.error('Error removing from history:', error);
    }
  };

  const handleClearHistory = async () => {
    setClearing(true);
    try {
      await clearWatchHistory();
      setHistory([]);
      setShowClearDialog(false);
    } catch (error) {
      console.error('Error clearing history:', error);
    } finally {
      setClearing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentUser) {
    return (
      <div className="pt-16 px-6 text-center">
        <div className="max-w-md mx-auto mt-20">
          <HistoryIcon size={64} className="mx-auto mb-4 text-youtube-lightgray" />
          <h1 className="text-2xl font-bold mb-4">Watch History</h1>
          <p className="text-youtube-lightgray mb-6">
            Please log in to view your watch history
          </p>
          <Link to="/login" className="btn-primary">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-16 px-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-youtube-gray rounded"></div>
              <div className="h-8 bg-youtube-gray rounded w-48"></div>
            </div>
            <div className="h-10 bg-youtube-gray rounded w-32"></div>
          </div>
          
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="w-40 aspect-video bg-youtube-gray rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-youtube-gray rounded"></div>
                  <div className="h-3 bg-youtube-gray rounded w-3/4"></div>
                  <div className="h-3 bg-youtube-gray rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 px-3 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <HistoryIcon size={32} className="text-youtube-red" />
          <h1 className="text-2xl sm:text-3xl font-bold">Watch History</h1>
        </div>
        
        {history.length > 0 && (
          <button 
            data-testid="clear-history"
            onClick={() => setShowClearDialog(true)}
            className="flex items-center space-x-2 bg-youtube-gray hover:bg-gray-600 px-3 sm:px-4 py-2 rounded-full transition-colors text-sm sm:text-base"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Clear all</span>
            <span className="sm:hidden">Clear</span>
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {history.map((item) => (
            <div key={item.id} data-testid="history-item" className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 p-3 sm:p-4 bg-youtube-gray/30 rounded-lg hover:bg-youtube-gray/50 transition-colors group">
              {/* Thumbnail */}
              <Link 
                to={`/watch/${item.videoId}`}
                className="w-full sm:w-40 aspect-video flex-shrink-0 rounded overflow-hidden relative"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Watch time indicator */}
                <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded flex items-center space-x-1">
                  <Clock size={10} />
                  <span>{formatDistanceToNow(item.watchedAt, { addSuffix: true })}</span>
                </div>
              </Link>

              {/* Video info */}
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/watch/${item.videoId}`}
                  className="block"
                >
                  <h3 className="font-semibold line-clamp-2 hover:text-red-400 transition-colors mb-2">
                    {item.title}
                  </h3>
                </Link>
                
                <div className="flex flex-col space-y-1 text-sm text-youtube-lightgray">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    {item.channelName}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>Watched {formatDistanceToNow(item.watchedAt, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>

              {/* Remove button */}
              <div className="flex-shrink-0 self-start">
                <button
                  data-testid="remove-from-history"
                  onClick={() => handleRemoveFromHistory(item.id)}
                  className="p-2 hover:bg-youtube-dark rounded-full transition-colors opacity-0 group-hover:opacity-100 text-youtube-lightgray hover:text-white"
                  title="Remove from watch history"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div data-testid="empty-history" className="text-center py-12">
          <HistoryIcon size={64} className="mx-auto mb-4 text-youtube-lightgray" />
          <h2 className="text-xl font-semibold mb-2">No videos in your watch history</h2>
          <p className="text-youtube-lightgray mb-6">
            Videos you watch will appear here
          </p>
          <Link to="/" className="btn-primary">
            Start watching
          </Link>
        </div>
      )}

      {/* Clear All Confirmation Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-youtube-gray rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Clear watch history?</h2>
            <p className="text-youtube-lightgray mb-6">
              This will remove all videos from your watch history. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowClearDialog(false)}
                disabled={clearing}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                data-testid="confirm-clear"
                onClick={handleClearHistory}
                disabled={clearing}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                {clearing ? 'Clearing...' : 'Clear all'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;