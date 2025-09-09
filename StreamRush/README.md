# 🎬 StreamRush - Advanced YouTube Clone

A full-featured, modern YouTube clone built with React, TypeScript, Firebase, and Cloudinary. This application replicates and enhances the core functionality of YouTube including video upload, streaming, user authentication, comments, subscriptions, and more with professional-grade video hosting.

![StreamRush Banner](https://img.shields.io/badge/StreamRush-YouTube%20Clone-red?style=for-the-badge&logo=youtube)
![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-9.0-orange?style=flat&logo=firebase)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Video%20Hosting-blue?style=flat&logo=cloudinary)

## 🚀 Key Features

### 🎥 Video Management
- **Professional Video Upload**: Cloudinary-powered video hosting with automatic optimization
- **Real-time Upload Progress**: Live progress tracking with detailed upload statistics
- **Multiple Video Formats**: Support for MP4, MOV, AVI, WebM, and more
- **Automatic Video Processing**: Server-side video compression and format optimization
- **Thumbnail Management**: Custom thumbnail upload with automatic WebP optimization
- **Video Metadata**: Title, description, tags, categories, and visibility settings
- **Video Analytics**: View counts, engagement metrics, and performance tracking

### 🎮 Advanced Video Player
- **Custom Video Player**: Built with React Player for optimal performance
- **Quality Selection**: Automatic quality adjustment based on connection
- **Playback Controls**: Play, pause, seek, volume, fullscreen, and speed controls
- **Keyboard Shortcuts**: Space, arrow keys, and other YouTube-like shortcuts
- **Mobile Optimized**: Touch-friendly controls for mobile devices

### 🔐 Authentication & User Management
- **Multi-Auth Support**: Email/password and Google OAuth integration
- **Protected Routes**: Secure access to user-specific features
- **User Profiles**: Comprehensive channel management and customization
- **Avatar & Banner**: Profile picture and channel banner upload
- **Account Settings**: Privacy, notification, and security settings

### 💬 Social Features
- **Real-time Comments**: Add, reply, and interact with comments
- **Like/Dislike System**: Video engagement with real-time updates
- **Subscription Management**: Subscribe/unsubscribe with notification system
- **Channel Pages**: Dedicated pages for each content creator
- **Community Tab**: Posts, polls, and community engagement (coming soon)

### 📋 Content Organization
- **Smart Playlists**: Create, manage, and share video collections
- **Watch Later**: Save videos for later viewing
- **Watch History**: Track and manage viewing history
- **Liked Videos**: Collection of liked content
- **Custom Categories**: Gaming, Music, Sports, News, Education, Technology

### 🔍 Discovery & Search
- **Advanced Search**: Multi-parameter search with filters
- **Trending Page**: Discover popular and trending content
- **Category Filtering**: Browse by specific content types
- **Search Filters**: Sort by date, duration, views, and relevance
- **Related Videos**: AI-powered recommendations
- **Subscription Feed**: Personalized content from subscribed channels

### 📱 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark Theme**: YouTube-inspired dark interface
- **Progressive Web App**: Installable PWA with offline capabilities
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: Graceful error recovery and user feedback
- **Accessibility**: Screen reader support and keyboard navigation

### 📊 Analytics & Administration
- **Admin Dashboard**: Content moderation and platform analytics
- **User Analytics**: Channel performance and engagement metrics
- **Content Moderation**: Report system and content review tools
- **System Monitoring**: Real-time performance and error tracking

## 🛠️ Technology Stack

### Frontend
- **React 18**: Latest React features with hooks and concurrent mode
- **TypeScript 5.0**: Full type safety and enhanced developer experience
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Router DOM**: Client-side routing and navigation
- **React Context API**: Global state management
- **React Hot Toast**: Beautiful notification system

### Backend & Services
- **Firebase 9**: Modern Firebase SDK with modular architecture
  - **Firestore**: NoSQL database for scalable data storage
  - **Authentication**: Secure user authentication and authorization
  - **Storage**: File storage with security rules
  - **Hosting**: Fast, secure web hosting
- **Cloudinary**: Professional video and image hosting
  - **Video Optimization**: Automatic compression and format conversion
  - **Global CDN**: Worldwide content delivery network
  - **Real-time Uploads**: Direct browser-to-cloud uploads
  - **Responsive Images**: Automatic image optimization

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **PostCSS**: CSS processing and optimization

### Additional Libraries
- **React Player**: Advanced video player component
- **Lucide React**: Beautiful icon library
- **date-fns**: Modern date utility library
- **UUID**: Unique identifier generation
- **React Hook Form**: Form validation and handling

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Firebase account (free tier available)
- Cloudinary account (free tier: 25GB storage + bandwidth)

### 1. Clone Repository
```bash
git clone <repository-url>
cd StreamRush
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password + Google)
4. Create Firestore database in production mode
5. Set up Firebase Storage
6. Copy your Firebase configuration

#### Deploy Firebase Configuration
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Deploy security rules and indexes
firebase deploy --only firestore:rules,storage:rules,firestore:indexes
```

### 3. Cloudinary Setup (Free Alternative)

#### Create Cloudinary Account
1. Register at [Cloudinary](https://cloudinary.com/users/register/free)
2. Go to your [Dashboard](https://cloudinary.com/console)
3. Copy your **Cloud Name** and **API Key**

#### Create Upload Preset
1. Go to **Settings** → **Upload** → **Upload presets**
2. Click **"Add upload preset"**
3. Configure:
   - **Preset name**: `streamrush_uploads`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `streamrush`
   - **Resource type**: `Auto`
4. Save the preset

### 4. Environment Configuration

Create `.env` file from `.env.example`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Cloudinary Configuration (Free)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=streamrush_uploads
```

### 5. Start Development Server

#### Local Development
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

#### External Access with ngrok
```bash
# Option 1: Use the automated script (Windows)
powershell ./scripts/start-ngrok.ps1

# Option 2: Use the automated script (Mac/Linux)
./scripts/start-ngrok.sh

# Option 3: Manual setup
npm run dev:ngrok  # Terminal 1
ngrok http 3000    # Terminal 2
```

**📝 Note for ngrok users:** 
- Your app will be accessible via a public ngrok URL (e.g., `https://abc123.ngrok-free.app`)
- Add your ngrok domain to Firebase authorized domains for authentication to work
- See [NGROK_SETUP.md](./NGROK_SETUP.md) for complete setup guide

## 🏗️ Project Architecture

```
StreamRush/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Header.tsx         # Navigation header with search
│   │   ├── Sidebar.tsx        # Navigation sidebar with categories
│   │   ├── VideoCard.tsx      # Video display card component
│   │   ├── VideoPlayer.tsx    # Custom video player
│   │   ├── CommentSection.tsx # Comment system
│   │   └── ...
│   ├── contexts/              # React Context providers
│   │   ├── AuthContext.tsx    # User authentication state
│   │   ├── VideoContext.tsx   # Video data management
│   │   ├── VideoContextWithCloudinary.tsx # Cloudinary integration
│   │   └── NotificationContext.tsx        # Notification system
│   ├── pages/                 # Page components
│   │   ├── Home.tsx           # Home feed with video grid
│   │   ├── Watch.tsx          # Video player page
│   │   ├── Upload.tsx         # Video upload interface
│   │   ├── Channel.tsx        # Channel pages
│   │   ├── Search.tsx         # Search results
│   │   ├── Profile.tsx        # User profile management
│   │   ├── Trending.tsx       # Trending videos
│   │   ├── Admin.tsx          # Admin dashboard
│   │   └── ...
│   ├── services/              # External service integrations
│   │   ├── cloudinaryService.ts    # Cloudinary upload service
│   │   └── cloudinaryServiceSigned.ts # Advanced Cloudinary features
│   ├── types/                 # TypeScript definitions
│   │   ├── index.ts           # Core application types
│   │   └── notification.ts    # Notification types
│   ├── config/                # Configuration files
│   │   └── firebase.ts        # Firebase initialization
│   ├── hooks/                 # Custom React hooks
│   └── utils/                 # Utility functions
├── firebase/                  # Firebase configuration
│   ├── firestore.rules       # Database security rules
│   ├── storage.rules         # Storage security rules
│   └── firestore.indexes.json # Database indexes
├── docs/                      # Documentation
│   ├── CLOUDINARY_SETUP.md   # Cloudinary setup guide
│   └── ...
└── ...
```

## 🚀 Deployment

### External Testing with ngrok (Development)
```bash
# Quick start with automated script
powershell ./scripts/start-ngrok.ps1  # Windows
./scripts/start-ngrok.sh             # Mac/Linux

# Manual setup
npm run dev:ngrok     # Terminal 1
ngrok http 3000       # Terminal 2
```
Perfect for testing on external devices, client demos, and webhook testing.
See [NGROK_SETUP.md](./NGROK_SETUP.md) for complete guide.

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to Firebase Hosting
```bash
# Build project
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Deploy to Netlify
```bash
# Build project
npm run build

# Deploy dist/ folder to Netlify
```

## 🔧 Advanced Configuration

### Cloudinary Optimizations
The project automatically applies these optimizations:
- **Video**: Auto quality, MP4 format, adaptive streaming
- **Images**: WebP format, responsive sizing, auto compression
- **CDN**: Global delivery with edge caching

### Firebase Security Rules
Comprehensive security rules are included for:
- User data protection
- Video upload permissions
- Comment moderation
- Admin-only operations

### Environment Variables
All environment variables use the `VITE_` prefix for Vite compatibility:
- Firebase configuration variables
- Cloudinary service credentials
- Feature flags and API endpoints

## 📊 Performance Features

### Video Optimizations
- **Lazy Loading**: Videos load only when needed
- **Adaptive Quality**: Automatic quality adjustment
- **Progressive Loading**: Stream while downloading
- **CDN Delivery**: Global content delivery network

### Application Performance
- **Code Splitting**: Dynamic imports for optimal loading
- **Image Optimization**: WebP format with fallbacks
- **Caching Strategy**: Intelligent browser and CDN caching
- **Bundle Optimization**: Tree shaking and minification

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# E2E tests (when configured)
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📈 Analytics & Monitoring

### Built-in Analytics
- Video view tracking
- User engagement metrics
- Upload success rates
- System performance monitoring

### Firebase Analytics
Integration with Firebase Analytics for:
- User behavior tracking
- Feature usage statistics
- Performance monitoring
- Crash reporting

## 🔐 Security Features

### Data Protection
- Firestore security rules
- Storage access controls
- User data encryption
- CORS configuration

### Content Moderation
- User reporting system
- Admin moderation tools
- Automated content scanning
- Community guidelines enforcement

## 🌐 Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile Browsers**: iOS Safari 13+, Chrome Mobile 80+
- **Progressive Web App**: Installable on mobile devices
- **Offline Support**: Basic offline functionality

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain component modularity
- Write comprehensive tests
- Update documentation
- Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

#### "Upload preset not found"
- Verify Cloudinary credentials in `.env`
- Ensure upload preset is set to "Unsigned"
- Check preset name matches environment variable

#### "Firebase permission denied"
- Deploy Firebase security rules
- Check user authentication status
- Verify database structure

#### "Video not loading"
- Check Cloudinary CDN status
- Verify video URL format
- Test with different video files

### Getting Help
- Check the [Documentation](./docs/)
- Review [Cloudinary Setup Guide](./CLOUDINARY_SETUP.md)
- Open an issue with detailed error information

## 🙏 Acknowledgments

- **YouTube**: Design and UX inspiration
- **Firebase**: Robust backend infrastructure
- **Cloudinary**: Professional media hosting
- **React Team**: Amazing frontend framework
- **Open Source Community**: All the incredible libraries used

## 📞 Support

For questions, issues, or feature requests:
- Open a GitHub issue
- Check existing documentation
- Review troubleshooting guide

---

**StreamRush** - Built with ❤️ for the developer community

*This is an educational project and is not affiliated with YouTube or Google.*

## ✨ What's Next?

### Upcoming Features
- [ ] Live streaming capabilities
- [ ] Community posts and polls
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Premium subscription features
- [ ] Content creator monetization

### Recent Updates
- ✅ Cloudinary integration for professional video hosting
- ✅ Advanced video player with quality selection
- ✅ Real-time notifications system
- ✅ Mobile-responsive design
- ✅ Admin dashboard for content management

**Ready to build the next generation of video platforms? Let's get started! 🚀**# StreamRush
# StreamRush
# StreamRush
# StreamRush
# StreamRush
# StreamRush
