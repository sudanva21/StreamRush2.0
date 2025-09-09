export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  channelName: string;
  bio?: string;
  location?: string;
  subscribers: number;
  subscriberCount?: number; // For backward compatibility
  subscribedTo: string[];
  likedVideos?: string[];
  dislikedVideos?: string[];
  watchHistory?: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  views: number;
  likes: number;
  dislikes: number;
  uploaderId: string;
  uploaderName: string;
  uploaderAvatar?: string;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  replies: Reply[];
  createdAt: Date;
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  createdAt: Date;
}

export interface History {
  id: string;
  userId: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channelName: string;
  watchedAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: Date;
  videos: {
    videoId: string;
    title: string;
    thumbnail: string;
    channelName: string;
    addedAt: Date;
  }[];
  // Legacy support for existing playlists
  videoIds?: string[];
  isPublic?: boolean;
  thumbnailUrl?: string;
  updatedAt?: Date;
}

export interface SearchFilters {
  sortBy: 'relevance' | 'upload_date' | 'view_count' | 'rating';
  uploadDate: 'any' | 'hour' | 'today' | 'week' | 'month' | 'year';
  duration: 'any' | 'short' | 'medium' | 'long';
  category: string;
}