# StreamRush ngrok Startup Script
# Run this script to start both the development server and ngrok tunnel

Write-Host "🚀 Starting StreamRush with ngrok support..." -ForegroundColor Green
Write-Host ""

# Check if ngrok is installed
try {
    $ngrokVersion = ngrok version
    Write-Host "✅ ngrok found: $ngrokVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ngrok not found. Please install ngrok first:" -ForegroundColor Red
    Write-Host "   Visit: https://ngrok.com/download" -ForegroundColor Yellow
    Write-Host "   Or run: npm install -g ngrok" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ package.json not found. Run this script from the StreamRush root directory." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Select option:" -ForegroundColor Cyan
Write-Host "1) Development server (port 3000)" -ForegroundColor White
Write-Host "2) Production preview (port 4173)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1 or 2)"

switch ($choice) {
    "1" {
        $port = 3000
        $script = "dev:ngrok"
        Write-Host "🔧 Starting development server on port $port..." -ForegroundColor Blue
    }
    "2" {
        Write-Host "🔨 Building project first..." -ForegroundColor Blue
        npm run build
        $port = 4173
        $script = "preview:ngrok"
        Write-Host "🔧 Starting preview server on port $port..." -ForegroundColor Blue
    }
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

# Start the server in background
Write-Host ""
Write-Host "📝 Starting server..." -ForegroundColor Yellow
$serverJob = Start-Job -ScriptBlock { 
    param($script)
    Set-Location $using:PWD
    npm run $script
} -ArgumentList $script

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Start ngrok
Write-Host "🌐 Starting ngrok tunnel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🔗 Your public URLs will be displayed below:" -ForegroundColor Green
Write-Host "📊 ngrok dashboard: http://127.0.0.1:4040" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Remember to add your ngrok domain to Firebase authorized domains!" -ForegroundColor Magenta
Write-Host ""

try {
    ngrok http $port
} finally {
    # Clean up background job when ngrok exits
    Write-Host ""
    Write-Host "🛑 Stopping server..." -ForegroundColor Yellow
    Remove-Job $serverJob -Force
    Write-Host "✅ Cleanup complete!" -ForegroundColor Green
}