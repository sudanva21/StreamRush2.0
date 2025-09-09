import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlaySquare, Plus, Lock, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVideo } from '../contexts/VideoContextWithCloudinary';
import { Playlist } from '../types';

const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: '',
    isPublic: true
  });

  const { currentUser } = useAuth();
  const { getUserPlaylists, createPlaylist } = useVideo();

  const loadPlaylists = useCallback(async () => {
    try {
      const userPlaylists = await getUserPlaylists();
      setPlaylists(userPlaylists);
    } catch (error) {
      console.error('Error loading playlists:', error);
    } finally {
      setLoading(false);
    }
  }, [getUserPlaylists]);

  useEffect(() => {
    if (currentUser) {
      loadPlaylists();
    } else {
      setLoading(false);
    }
  }, [currentUser, loadPlaylists]);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPlaylist.name.trim()) return;

    try {
      await createPlaylist(
        newPlaylist.name.trim(),
        newPlaylist.description.trim()
      );
      
      setNewPlaylist({ name: '', description: '', isPublic: true });
      setShowCreateModal(false);
      loadPlaylists();
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="pt-16 px-3 sm:px-6 text-center pb-safe-bottom">
        <div className="max-w-md mx-auto mt-12 sm:mt-20">
          <PlaySquare size={48} className="sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-youtube-lightgray" />
          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Your Playlists</h1>
          <p className="text-youtube-lightgray mb-4 sm:mb-6 text-sm sm:text-base">
            Please log in to create playlists and organize your favorite videos
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="btn-primary"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-16 px-3 sm:px-6 pb-safe-bottom">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-youtube-gray rounded w-32 sm:w-48 mb-4 sm:mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
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
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <PlaySquare size={24} className="sm:w-8 sm:h-8 text-youtube-red" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Your Playlists</h1>
        </div>
        
        <button
          data-testid="create-playlist"
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base whitespace-nowrap"
        >
          <Plus size={16} />
          <span className="hidden xs:inline">New playlist</span>
          <span className="xs:hidden">New</span>
        </button>
      </div>

      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-6 -mx-3 sm:mx-0">
          {playlists.map((playlist) => (
            <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="video-card hover:scale-105 transition-transform">
              <div className="aspect-video bg-youtube-gray rounded-lg flex items-center justify-center mb-2 sm:mb-3 overflow-hidden relative">
                {playlist.thumbnailUrl || playlist.videos[0]?.thumbnail ? (
                  <img
                    src={playlist.thumbnailUrl || playlist.videos[0]?.thumbnail}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PlaySquare size={32} className="sm:w-12 sm:h-12 text-youtube-lightgray" />
                )}
                {/* Video count overlay */}
                {playlist.videos.length > 0 && (
                  <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-black/80 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    {playlist.videos.length} videos
                  </div>
                )}
              </div>
              
              <div className="p-2 sm:p-3">
                <h3 className="font-semibold mb-1 line-clamp-2 text-sm sm:text-base break-words">{playlist.name}</h3>
                
                <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-youtube-lightgray mb-1 sm:mb-2">
                  {playlist.isPublic ? (
                    <Globe size={12} className="sm:w-3.5 sm:h-3.5" />
                  ) : (
                    <Lock size={12} className="sm:w-3.5 sm:h-3.5" />
                  )}
                  <span>{playlist.isPublic ? 'Public' : 'Private'}</span>
                </div>
                
                <p className="text-xs sm:text-sm text-youtube-lightgray">
                  {playlist.videos?.length || playlist.videoIds?.length || 0} videos
                </p>
                
                {playlist.description && (
                  <p className="text-xs sm:text-sm text-youtube-lightgray mt-1 sm:mt-2 line-clamp-2 break-words">
                    {playlist.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 px-3 sm:px-0">
          <PlaySquare size={48} className="sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-youtube-lightgray" />
          <h2 className="text-lg sm:text-xl font-semibold mb-2">No playlists yet</h2>
          <p className="text-youtube-lightgray mb-4 sm:mb-6 text-sm sm:text-base">
            Create playlists to organize your favorite videos
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-1 sm:space-x-2 mx-auto text-sm sm:text-base"
          >
            <Plus size={16} />
            <span>Create playlist</span>
          </button>
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-youtube-gray rounded-lg p-4 sm:p-6 w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Create new playlist</h2>
            
            <form onSubmit={handleCreatePlaylist} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="playlistName" className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="playlistName"
                  value={newPlaylist.name}
                  onChange={(e) => setNewPlaylist(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field w-full text-sm sm:text-base"
                  placeholder="Enter playlist name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="playlistDescription" className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Description
                </label>
                <textarea
                  id="playlistDescription"
                  value={newPlaylist.description}
                  onChange={(e) => setNewPlaylist(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field w-full h-16 sm:h-20 resize-none text-sm sm:text-base"
                  placeholder="Enter playlist description"
                />
              </div>
              
              <div className="flex flex-col xs:flex-row xs:justify-end xs:space-x-3 space-y-2 xs:space-y-0 pt-3 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary w-full xs:w-auto text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary w-full xs:w-auto text-sm sm:text-base"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlists;