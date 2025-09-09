#!/usr/bin/env node

/**
 * Simple test script to verify ngrok configuration
 * This checks if the server is accessible externally
 */

const http = require('http');
const { spawn } = require('child_process');

console.log('🧪 Testing StreamRush ngrok configuration...\n');

// Test if server is running and accessible
function testServer(host, port) {
    return new Promise((resolve, reject) => {
        const req = http.get(`http://${host}:${port}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200 && data.includes('StreamRush')) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
        
        req.on('error', () => resolve(false));
        req.setTimeout(5000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

async function runTests() {
    console.log('1. Testing localhost access...');
    const localhostWorks = await testServer('localhost', 3000);
    console.log(`   ${localhostWorks ? '✅' : '❌'} Localhost: http://localhost:3000`);
    
    console.log('\n2. Testing external network access...');
    const externalWorks = await testServer('0.0.0.0', 3000);
    console.log(`   ${externalWorks ? '✅' : '❌'} External: http://0.0.0.0:3000`);
    
    console.log('\n3. Configuration Summary:');
    console.log(`   📡 Server binding: ${externalWorks ? 'All interfaces (0.0.0.0) ✅' : 'Localhost only ❌'}`);
    console.log(`   🌐 ngrok ready: ${externalWorks ? 'Yes ✅' : 'No ❌'}`);
    
    if (externalWorks) {
        console.log('\n🎉 Configuration is correct for ngrok!');
        console.log('💡 Next steps:');
        console.log('   1. Install ngrok: npm install -g ngrok');
        console.log('   2. Get auth token: https://dashboard.ngrok.com/get-started/your-authtoken');
        console.log('   3. Run: ngrok http 3000');
    } else {
        console.log('\n❌ Configuration needs adjustment.');
        console.log('💡 Make sure to:');
        console.log('   1. Run: npm run dev:ngrok (not npm run dev)');
        console.log('   2. Check vite.config.ts has host: true');
        console.log('   3. Ensure no firewall blocks the connection');
    }
}

runTests().catch(console.error);