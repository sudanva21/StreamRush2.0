import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Play, 
  Download, 
  Globe, 
  Moon, 
  Sun,
  Volume2,
  Wifi,
  HardDrive,
  Eye,
  Lock,
  Trash2,
  Save
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

interface UserSettings {
  autoplay: boolean;
  quality: 'auto' | '360p' | '480p' | '720p' | '1080p' | '1440p' | '2160p';
  volume: number;
  playbackSpeed: number;
  subtitles: boolean;
  darkTheme: boolean;
  language: string;
  theater: boolean;
  miniPlayer: boolean;
  annotations: boolean;
  notifications: {
    uploads: boolean;
    comments: boolean;
    mentions: boolean;
    newsletters: boolean;
  };
  privacy: {
    showHistory: boolean;
    showLikedVideos: boolean;
    showSubscriptions: boolean;
    showPlaylists: boolean;
  };
  dataUsage: {
    limitMobileData: boolean;
    downloadQuality: '360p' | '480p' | '720p' | '1080p';
    autoDownload: boolean;
  };
}

const defaultSettings: UserSettings = {
  autoplay: true,
  quality: 'auto',
  volume: 80,
  playbackSpeed: 1,
  subtitles: false,
  darkTheme: true,
  language: 'English',
  theater: false,
  miniPlayer: true,
  annotations: true,
  notifications: {
    uploads: true,
    comments: true,
    mentions: true,
    newsletters: false,
  },
  privacy: {
    showHistory: true,
    showLikedVideos: true,
    showSubscriptions: true,
    showPlaylists: true,
  },
  dataUsage: {
    limitMobileData: false,
    downloadQuality: '720p',
    autoDownload: false,
  },
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { currentUser } = useAuth();
  const { isDarkMode, setDarkMode } = useTheme();

  const loadSettings = () => {
    if (currentUser) {
      const savedSettings = localStorage.getItem(`settings_${currentUser.uid}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  };

  const saveSettings = async () => {
    if (!currentUser) {
      toast.error('Please log in to save settings');
      return;
    }
    
    setSaving(true);
    try {
      // Validate settings before saving
      const validatedSettings = {
        ...settings,
        volume: Math.max(0, Math.min(100, settings.volume)),
        playbackSpeed: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].includes(settings.playbackSpeed) 
          ? settings.playbackSpeed 
          : 1,
      };
      
      localStorage.setItem(`settings_${currentUser.uid}`, JSON.stringify(validatedSettings));
      setSettings(validatedSettings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => {
      const sectionData = prev[section];
      if (typeof sectionData === 'object' && sectionData !== null && !Array.isArray(sectionData)) {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [key]: value,
          },
        };
      }
      return prev;
    });
  };

  const updateDirectSetting = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your watch history? This action cannot be undone.')) {
      try {
        // Clear local storage history for now
        const historyKey = `watch_history_${currentUser?.uid}`;
        localStorage.removeItem(historyKey);
        
        // Also clear other related history data
        const searchHistoryKey = `search_history_${currentUser?.uid}`;
        localStorage.removeItem(searchHistoryKey);
        
        // Show success toast instead of alert
        toast.success('Watch history cleared successfully');
      } catch (error) {
        console.error('Error clearing history:', error);
        toast.error('Failed to clear watch history');
      }
    }
  };

  // Effects
  useEffect(() => {
    loadSettings();
  }, [currentUser]);

  // Add keyboard shortcut for saving (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveSettings();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'playback', label: 'Playback', icon: Play },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data Usage', icon: Wifi },
  ];

  if (!currentUser) {
    return (
      <div className="pt-16 px-6 text-center">
        <div className="max-w-md mx-auto mt-20">
          <SettingsIcon size={64} className="mx-auto mb-4 text-youtube-lightgray" />
          <h1 className="text-2xl font-bold mb-4">Settings</h1>
          <p className="text-youtube-lightgray mb-6">
            Please log in to access your settings
          </p>
          <Link to="/login" className="btn-primary">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 px-3 sm:px-6 max-w-6xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <SettingsIcon size={32} className="text-youtube-red" />
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-youtube-gray/30 rounded-lg p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    data-testid={`settings-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-youtube-red text-white'
                        : 'hover:bg-youtube-gray/50 text-youtube-lightgray'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-youtube-gray/30 rounded-lg p-4 sm:p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6" data-testid="general-settings">
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <Globe size={24} />
                    <span>General Settings</span>
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="font-medium">Language</label>
                      <p className="text-sm text-youtube-lightgray">Choose your preferred language</p>
                    </div>
                    <select
                      value={settings.language}
                      onChange={(e) => updateDirectSetting('language', e.target.value)}
                      className="bg-youtube-gray border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-youtube-red focus:border-transparent"
                      aria-label="Select language"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Español</option>
                      <option value="French">Français</option>
                      <option value="German">Deutsch</option>
                      <option value="Japanese">日本語</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="font-medium">Theme</label>
                      <p className="text-sm text-gray-500 dark:text-youtube-lightgray">
                        {isDarkMode ? 'Dark theme is currently active' : 'Light theme is currently active'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                      <span className="text-sm">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                      <button
                        onClick={() => {
                          const newDarkMode = !isDarkMode;
                          setDarkMode(newDarkMode);
                          updateDirectSetting('darkTheme', newDarkMode);
                          toast.success(`${newDarkMode ? 'Dark' : 'Light'} mode activated`);
                        }}
                        className={`w-12 h-6 rounded-full relative transition-all duration-200 focus:ring-2 focus:ring-youtube-red ${
                          isDarkMode ? 'bg-youtube-red' : 'bg-gray-300'
                        }`}
                        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${
                            isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Playback Settings */}
            {activeTab === 'playback' && (
              <div className="space-y-6" data-testid="playback-settings">
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <Play size={24} />
                    <span>Playback Settings</span>
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="font-medium">Autoplay</label>
                      <p className="text-sm text-youtube-lightgray">Automatically play next video</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoplay}
                      onChange={(e) => updateDirectSetting('autoplay', e.target.checked)}
                      className="w-5 h-5 text-youtube-red bg-youtube-gray border-gray-600 rounded focus:ring-youtube-red"
                      data-testid="autoplay-toggle"
                      aria-label="Enable autoplay"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="font-medium">Default Video Quality</label>
                      <p className="text-sm text-youtube-lightgray">Choose preferred video quality</p>
                    </div>
                    <select
                      value={settings.quality}
                      onChange={(e) => updateDirectSetting('quality', e.target.value)}
                      className="bg-youtube-gray border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-youtube-red focus:border-transparent"
                      data-testid="quality-select"
                      aria-label="Select video quality"
                    >
                      <option value="auto">Auto (recommended)</option>
                      <option value="2160p">2160p (4K)</option>
                      <option value="1440p">1440p (2K)</option>
                      <option value="1080p">1080p (Full HD)</option>
                      <option value="720p">720p (HD)</option>
                      <option value="480p">480p</option>
                      <option value="360p">360p</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="font-medium">Volume</label>
                      <p className="text-sm text-youtube-lightgray">Default volume level: {settings.volume}%</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Volume2 size={18} />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.volume}
                        onChange={(e) => {
                          const volume = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                          updateDirectSetting('volume', volume);
                        }}
                        className="w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="font-medium">Playback Speed</label>
                      <p className="text-sm text-youtube-lightgray">Default playback speed</p>
                    </div>
                    <select
                      value={settings.playbackSpeed}
                      onChange={(e) => updateDirectSetting('playbackSpeed', parseFloat(e.target.value))}
                      className="bg-youtube-gray border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-youtube-red focus:border-transparent"
                    >
                      <option value="0.25">0.25x</option>
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1x (Normal)</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="font-medium">Subtitles</label>
                      <p className="text-sm text-youtube-lightgray">Show subtitles by default</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.subtitles}
                      onChange={(e) => updateDirectSetting('subtitles', e.target.checked)}
                      className="w-5 h-5 text-youtube-red bg-youtube-gray border-gray-600 rounded focus:ring-youtube-red"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="font-medium">Theater Mode</label>
                      <p className="text-sm text-youtube-lightgray">Watch videos in theater mode by default</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.theater}
                      onChange={(e) => updateDirectSetting('theater', e.target.checked)}
                      className="w-5 h-5 text-youtube-red bg-youtube-gray border-gray-600 rounded focus:ring-youtube-red"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="font-medium">Mini Player</label>
                      <p className="text-sm text-youtube-lightgray">Enable mini player when browsing</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.miniPlayer}
                      onChange={(e) => updateDirectSetting('miniPlayer', e.target.checked)}
                      className="w-5 h-5 text-youtube-red bg-youtube-gray border-gray-600 rounded focus:ring-youtube-red"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="font-medium">Annotations</label>
                      <p className="text-sm text-youtube-lightgray">Show video annotations</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.annotations}
                      onChange={(e) => updateDirectSetting('annotations', e.target.checked)}
                      className="w-5 h-5 text-youtube-red bg-youtube-gray border-gray-600 rounded focus:ring-youtube-red"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6" data-testid="notification-settings">
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <Bell size={24} />
                    <span>Notification Settings</span>
                  </h2>
                </div>

                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <p className="text-sm text-youtube-lightgray">
                          {key === 'uploads' && 'New uploads from subscribed channels'}
                          {key === 'comments' && 'New comments on your videos'}
                          {key === 'mentions' && 'When someone mentions you'}
                          {key === 'newsletters' && 'StreamRush news and updates'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                        className="w-5 h-5 text-youtube-red bg-youtube-gray border-gray-600 rounded focus:ring-youtube-red"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6" data-testid="privacy-settings">
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <Shield size={24} />
                    <span>Privacy Settings</span>
                  </h2>
                </div>

                <div className="space-y-4">
                  {Object.entries(settings.privacy).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className="font-medium">
                          {key === 'showHistory' && 'Watch History'}
                          {key === 'showLikedVideos' && 'Liked Videos'}
                          {key === 'showSubscriptions' && 'Subscriptions'}
                          {key === 'showPlaylists' && 'Playlists'}
                        </label>
                        <p className="text-sm text-youtube-lightgray">
                          Make your {key.replace('show', '').toLowerCase().replace(/([A-Z])/g, ' $1').trim()} public
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye size={18} className={value ? 'text-green-400' : 'text-gray-500'} />
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateSetting('privacy', key, e.target.checked)}
                          className="w-5 h-5 text-youtube-red bg-youtube-gray border-gray-600 rounded focus:ring-youtube-red"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-600 pt-4 mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className="font-medium text-red-400">Clear Watch History</label>
                        <p className="text-sm text-youtube-lightgray">
                          Remove all videos from your watch history
                        </p>
                      </div>
                      <button
                        onClick={handleClearHistory}
                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                        <span>Clear History</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Usage Settings */}
            {activeTab === 'data' && (
              <div className="space-y-6" data-testid="data-settings">
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <HardDrive size={24} />
                    <span>Data Usage Settings</span>
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="font-medium">Limit Mobile Data Usage</label>
                      <p className="text-sm text-youtube-lightgray">Reduce video quality on mobile data</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.dataUsage.limitMobileData}
                      onChange={(e) => updateSetting('dataUsage', 'limitMobileData', e.target.checked)}
                      className="w-5 h-5 text-youtube-red bg-youtube-gray border-gray-600 rounded focus:ring-youtube-red"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="font-medium">Download Quality</label>
                      <p className="text-sm text-youtube-lightgray">Quality for offline downloads</p>
                    </div>
                    <select
                      value={settings.dataUsage.downloadQuality}
                      onChange={(e) => updateSetting('dataUsage', 'downloadQuality', e.target.value)}
                      className="bg-youtube-gray border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-youtube-red focus:border-transparent"
                    >
                      <option value="1080p">1080p</option>
                      <option value="720p">720p</option>
                      <option value="480p">480p</option>
                      <option value="360p">360p</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="font-medium">Auto Download</label>
                      <p className="text-sm text-youtube-lightgray">Automatically download videos for offline viewing</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.dataUsage.autoDownload}
                      onChange={(e) => updateSetting('dataUsage', 'autoDownload', e.target.checked)}
                      className="w-5 h-5 text-youtube-red bg-youtube-gray border-gray-600 rounded focus:ring-youtube-red"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end mt-8 pt-6 border-t border-gray-600">
              <button
                data-testid="save-settings"
                onClick={saveSettings}
                disabled={saving}
                className="flex items-center space-x-2 btn-primary disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : saved ? (
                  <>
                    <Save size={16} />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;