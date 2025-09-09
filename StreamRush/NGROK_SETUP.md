# 🌐 Ngrok Setup Guide for StreamRush

This guide will help you expose your StreamRush development server to the internet using ngrok, allowing external access and testing.

## 📋 Prerequisites

- **Node.js 18+** and npm installed
- **StreamRush project** set up locally
- **ngrok account** (free tier available at [ngrok.com](https://ngrok.com/))

## 🚀 Quick Setup

### 1. Install ngrok

#### Option A: Download from ngrok.com
1. Go to [ngrok.com/download](https://ngrok.com/download)
2. Download for your operating system
3. Extract and add to your PATH

#### Option B: Using npm (Global)
```bash
npm install -g ngrok
```

#### Option C: Using Chocolatey (Windows)
```bash
choco install ngrok
```

### 2. Setup ngrok Authentication

1. Sign up at [ngrok.com](https://ngrok.com/) (free)
2. Get your authentication token from the [dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Configure ngrok:
```bash
ngrok authtoken YOUR_AUTH_TOKEN_HERE
```

### 3. Configure Firebase for External Access

If you're using Firebase Authentication, you need to add your ngrok domain to authorized domains:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Add your ngrok domain (you'll get this after starting ngrok)

## 🔧 Running StreamRush with ngrok

### Method 1: Development Server (Recommended)

#### Terminal 1: Start the development server
```bash
cd StreamRush
npm run dev:ngrok
```

#### Terminal 2: Start ngrok tunnel
```bash
ngrok http 3000
```

### Method 2: Production Preview

#### Build and start preview
```bash
npm run build
npm run preview:ngrok
```

#### Start ngrok tunnel (in another terminal)
```bash
ngrok http 4173
```

## 📱 Ngrok Output Explained

After running `ngrok http 3000`, you'll see output like:

```
ngrok                                                          

Session Status                online
Account                      your-email@example.com (Plan: Free)
Version                      3.1.0
Region                       United States (us)
Latency                      45ms
Web Interface                http://127.0.0.1:4040
Forwarding                   https://abc123.ngrok-free.app -> http://localhost:3000

Connections                  ttl     opn     rt1     rt5     p50     p90
                            0       0       0.00    0.00    0.00    0.00
```

**Key Information:**
- **Forwarding URL**: `https://abc123.ngrok-free.app` (your public URL)
- **Web Interface**: `http://127.0.0.1:4040` (ngrok dashboard)
- **Local Target**: `http://localhost:3000` (your local server)

## 🔐 Firebase Configuration Update

After starting ngrok, update your Firebase project:

### 1. Add Authorized Domain
1. Copy your ngrok URL (e.g., `abc123.ngrok-free.app`)
2. In Firebase Console → Authentication → Settings → Authorized domains
3. Click **Add domain** and paste your ngrok domain (without `https://`)

### 2. Update Environment Variables (Optional)
If you need to reference the external URL in your app:

```env
# Add to your .env file
VITE_APP_URL=https://your-ngrok-url.ngrok-free.app
```

## 🛠️ Advanced Configuration

### Custom Subdomain (Paid Plans)
```bash
ngrok http 3000 --subdomain=streamrush
```
This gives you: `https://streamrush.ngrok.io`

### HTTP Authentication
```bash
ngrok http 3000 --basic-auth="username:password"
```

### Custom Configuration File

Create `ngrok.yml`:
```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN
tunnels:
  streamrush-dev:
    addr: 3000
    proto: http
    subdomain: streamrush-dev
    bind_tls: true
  streamrush-prod:
    addr: 4173
    proto: http
    subdomain: streamrush-prod
    bind_tls: true
```

Run specific tunnel:
```bash
ngrok start streamrush-dev
```

### Regional Endpoints
```bash
ngrok http 3000 --region=eu  # Europe
ngrok http 3000 --region=ap  # Asia Pacific
ngrok http 3000 --region=au  # Australia
ngrok http 3000 --region=us  # United States (default)
```

## 🐛 Troubleshooting

### Issue: "Only localhost and 127.0.0.1 are allowed"
**Solution**: Make sure you're using the ngrok-specific npm scripts:
```bash
npm run dev:ngrok  # Instead of npm run dev
```

### Issue: Firebase Auth not working
**Solution**: 
1. Check that your ngrok domain is added to Firebase authorized domains
2. Make sure you're using HTTPS (ngrok provides this automatically)

### Issue: CORS Errors
**Solution**: The Vite config is already set up with `cors: true`. If still having issues:
```bash
# Try with specific CORS headers
ngrok http 3000 --header="Access-Control-Allow-Origin: *"
```

### Issue: Connection Refused
**Solution**: 
1. Ensure your local server is running first
2. Check the port number matches (3000 for dev, 4173 for preview)

### Issue: ngrok Free Plan Limitations
**Solutions**:
- Free plan includes 1 online tunnel
- URLs change on restart (use paid plan for static URLs)
- Rate limits apply

## 📊 Monitoring & Testing

### ngrok Web Interface
Visit `http://127.0.0.1:4040` while ngrok is running for:
- Request/response inspection
- Replay requests
- Performance metrics
- Connection details

### Testing Your Setup
1. Open your ngrok URL in multiple devices/browsers
2. Test authentication flow
3. Upload/download videos
4. Check real-time features (comments, likes)

## 💡 Best Practices

### Security
- Use HTTPS URLs (ngrok provides automatically)
- Don't expose sensitive development data
- Use authentication for production testing
- Monitor ngrok dashboard for suspicious activity

### Development
- Keep local development as primary
- Use ngrok for external testing only
- Test on multiple devices/networks
- Monitor performance over ngrok tunnel

### Firebase
- Always add ngrok domains to authorized domains
- Test authentication flow after adding domains
- Check Firebase security rules work with external access

## 🎯 Use Cases

### Mobile Testing
Test your app on real mobile devices using the ngrok URL

### Client Demos
Share live development progress with clients or team members

### Webhook Testing
Test webhooks from external services (payments, APIs, etc.)

### Cross-browser Testing
Test on different browsers/devices without deployment

### Performance Testing
Test real-world network conditions

## 📞 Support

### ngrok Issues
- [ngrok Documentation](https://ngrok.com/docs)
- [ngrok Community](https://discuss.ngrok.com/)

### StreamRush Issues
- Check this repository's issues
- Ensure all environment variables are set correctly
- Verify Firebase configuration is complete

---

**Happy streaming with ngrok! 🚀**