# StreamRush ngrok Setup Verification Script

Write-Host "🔍 Verifying StreamRush ngrok setup..." -ForegroundColor Green
Write-Host ""

$allChecks = $true

# Check 1: Vite configuration
Write-Host "1️⃣ Checking Vite configuration..." -ForegroundColor Cyan
if (Test-Path "vite.config.ts") {
    $viteConfig = Get-Content "vite.config.ts" -Raw
    if ($viteConfig -match "host:\s*true") {
        Write-Host "   ✅ vite.config.ts: host set to true" -ForegroundColor Green
    } else {
        Write-Host "   ❌ vite.config.ts: host not set to true" -ForegroundColor Red
        $allChecks = $false
    }
} else {
    Write-Host "   ❌ vite.config.ts not found" -ForegroundColor Red
    $allChecks = $false
}

# Check 2: Package.json scripts
Write-Host "2️⃣ Checking npm scripts..." -ForegroundColor Cyan
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw
    if ($packageJson -match "dev:ngrok") {
        Write-Host "   ✅ package.json: dev:ngrok script found" -ForegroundColor Green
    } else {
        Write-Host "   ❌ package.json: dev:ngrok script missing" -ForegroundColor Red
        $allChecks = $false
    }
} else {
    Write-Host "   ❌ package.json not found" -ForegroundColor Red
    $allChecks = $false
}

# Check 3: Server status
Write-Host "3️⃣ Checking server status..." -ForegroundColor Cyan
$serverRunning = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($serverRunning) {
    Write-Host "   ✅ Server running on port 3000" -ForegroundColor Green
    
    # Test server response
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ Server responding correctly" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ Server responding with status: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ❌ Server not responding" -ForegroundColor Red
        $allChecks = $false
    }
} else {
    Write-Host "   ⚠️ Server not running (this is OK if you have not started it yet)" -ForegroundColor Yellow
}

# Check 4: ngrok availability
Write-Host "4️⃣ Checking ngrok availability..." -ForegroundColor Cyan
try {
    $ngrokVersion = ngrok version 2>$null
    if ($ngrokVersion) {
        Write-Host "   ✅ ngrok installed: $ngrokVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️ ngrok not installed (install with: npm install -g ngrok)" -ForegroundColor Yellow
}

# Check 5: Documentation files
Write-Host "5️⃣ Checking documentation..." -ForegroundColor Cyan
if (Test-Path "NGROK_SETUP.md") {
    Write-Host "   ✅ NGROK_SETUP.md guide available" -ForegroundColor Green
} else {
    Write-Host "   ❌ NGROK_SETUP.md missing" -ForegroundColor Red
}

if (Test-Path "scripts/start-ngrok.ps1") {
    Write-Host "   ✅ Windows startup script available" -ForegroundColor Green
} else {
    Write-Host "   ❌ Windows startup script missing" -ForegroundColor Red
}

# Final summary
Write-Host ""
Write-Host "📋 Setup Summary:" -ForegroundColor Magenta
if ($allChecks) {
    Write-Host "   🎉 All checks passed! Your StreamRush is ready for ngrok." -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Quick Start Commands:" -ForegroundColor Cyan
    Write-Host "   Start server: npm run dev:ngrok" -ForegroundColor White
    Write-Host "   Start ngrok:  ngrok http 3000" -ForegroundColor White
    Write-Host "   Or use script: powershell ./scripts/start-ngrok.ps1" -ForegroundColor White
} else {
    Write-Host "   ⚠️ Some issues found. Please check the items marked with ❌ above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📖 For detailed setup instructions, see: NGROK_SETUP.md" -ForegroundColor Blue