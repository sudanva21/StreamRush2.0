import React, { useState, useEffect } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { useVideo } from '../contexts/VideoContextWithCloudinary';
import { useAuth } from '../contexts/AuthContext';
import { Playlist } from '../types';
import toast from 'react-hot-toast';

interface AddToPlaylistModalProps {
  videoId: string;
  onClose: () => void;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ videoId, onClose }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [addingToPlaylists, setAddingToPlaylists] = useState<Set<string>>(new Set());

  const { getUserPlaylists, createPlaylist, addToPlaylist, removeFromPlaylist } = useVideo();
  const { currentUser } = useAuth();

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const userPlaylists = await getUserPlaylists();
      setPlaylists(userPlaylists);
    } catch (error) {
      console.error('Error loading playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    setCreatingPlaylist(true);
    try {
      await createPlaylist(newPlaylistName.trim(), newPlaylistDescription.trim());
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setShowCreateForm(false);
      await loadPlaylists(); // Reload to get the new playlist
      toast.success('Playlist created');
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setCreatingPlaylist(false);
    }
  };

  const handleTogglePlaylist = async (playlist: Playlist) => {
    if (addingToPlaylists.has(playlist.id)) return;

    const isVideoInPlaylist = playlist.videos.some(v => v.videoId === videoId);
    setAddingToPlaylists(prev => new Set([...prev, playlist.id]));

    try {
      if (isVideoInPlaylist) {
        await removeFromPlaylist(playlist.id, videoId);
        setPlaylists(prev => prev.map(p => 
          p.id === playlist.id 
            ? { ...p, videos: p.videos.filter(v => v.videoId !== videoId) }
            : p
        ));
      } else {
        await addToPlaylist(playlist.id, videoId);
        // Reload playlists to get updated data
        await loadPlaylists();
      }
    } catch (error) {
      console.error('Error toggling playlist:', error);
    } finally {
      setAddingToPlaylists(prev => {
        const next = new Set(prev);
        next.delete(playlist.id);
        return next;
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-youtube-gray rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Save video to playlist</h2>
            <p className="text-youtube-lightgray mb-6">
              Sign in to save this video to a playlist
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="btn-primary"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-youtube-gray rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-youtube-dark">
          <h2 className="text-xl font-bold">Save video to...</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-youtube-dark rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-youtube-dark rounded"></div>
                    <div className="h-4 bg-youtube-dark rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Create Playlist Button */}
              <div className="p-4 border-b border-youtube-dark">
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="flex items-center space-x-3 w-full p-2 hover:bg-youtube-dark rounded transition-colors"
                >
                  <Plus size={16} />
                  <span>Create new playlist</span>
                </button>
              </div>

              {/* Create Playlist Form */}
              {showCreateForm && (
                <div className="p-4 border-b border-youtube-dark">
                  <form onSubmit={handleCreatePlaylist} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="Playlist name"
                        className="input-field w-full"
                        required
                      />
                    </div>
                    <div>
                      <textarea
                        value={newPlaylistDescription}
                        onChange={(e) => setNewPlaylistDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="input-field w-full h-20 resize-none"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateForm(false);
                          setNewPlaylistName('');
                          setNewPlaylistDescription('');
                        }}
                        className="btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={creatingPlaylist || !newPlaylistName.trim()}
                        className="btn-primary text-sm"
                      >
                        {creatingPlaylist ? 'Creating...' : 'Create'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Playlists List */}
              <div className="p-4 space-y-2">
                {playlists.length === 0 ? (
                  <div className="text-center py-6 text-youtube-lightgray">
                    <p>No playlists yet</p>
                    <p className="text-sm">Create your first playlist above</p>
                  </div>
                ) : (
                  playlists.map((playlist) => {
                    const isVideoInPlaylist = playlist.videos.some(v => v.videoId === videoId);
                    const isProcessing = addingToPlaylists.has(playlist.id);

                    return (
                      <div
                        key={playlist.id}
                        className="flex items-center space-x-3 p-2 hover:bg-youtube-dark rounded cursor-pointer transition-colors"
                        onClick={() => !isProcessing && handleTogglePlaylist(playlist)}
                      >
                        <div className="w-4 h-4 flex-shrink-0">
                          {isProcessing ? (
                            <div className="w-4 h-4 border-2 border-youtube-red border-t-transparent rounded-full animate-spin"></div>
                          ) : isVideoInPlaylist ? (
                            <Check size={16} className="text-youtube-red" />
                          ) : (
                            <div className="w-4 h-4 border border-youtube-lightgray rounded"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{playlist.name}</div>
                          <div className="text-sm text-youtube-lightgray">
                            {playlist.videos.length} videos
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-youtube-dark">
          <button
            onClick={onClose}
            className="btn-secondary w-full"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;