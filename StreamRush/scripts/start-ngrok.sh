#!/bin/bash

# StreamRush ngrok Startup Script
# Run this script to start both the development server and ngrok tunnel

echo "🚀 Starting StreamRush with ngrok support..."
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok not found. Please install ngrok first:"
    echo "   Visit: https://ngrok.com/download"
    echo "   Or run: npm install -g ngrok"
    exit 1
fi

echo "✅ ngrok found: $(ngrok version)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Run this script from the StreamRush root directory."
    exit 1
fi

echo ""
echo "Select option:"
echo "1) Development server (port 3000)"
echo "2) Production preview (port 4173)"
echo ""

read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        port=3000
        script="dev:ngrok"
        echo "🔧 Starting development server on port $port..."
        ;;
    2)
        echo "🔨 Building project first..."
        npm run build
        port=4173
        script="preview:ngrok"
        echo "🔧 Starting preview server on port $port..."
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

# Start the server in background
echo ""
echo "📝 Starting server..."
npm run $script &
server_pid=$!

# Wait a moment for server to start
sleep 3

# Trap to ensure cleanup on script exit
cleanup() {
    echo ""
    echo "🛑 Stopping server..."
    kill $server_pid 2>/dev/null
    echo "✅ Cleanup complete!"
    exit 0
}
trap cleanup SIGINT SIGTERM

# Start ngrok
echo "🌐 Starting ngrok tunnel..."
echo ""
echo "🔗 Your public URLs will be displayed below:"
echo "📊 ngrok dashboard: http://127.0.0.1:4040"
echo ""
echo "⚠️  Remember to add your ngrok domain to Firebase authorized domains!"
echo ""

ngrok http $port

# Cleanup when ngrok exits
cleanup