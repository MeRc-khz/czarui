const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Start a quick HTTP server for the landing page
const server = http.createServer((req, res) => {
    let filePath = path.join('/root/czarui/landing', req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
    
    fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end(); return; }
        res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
        res.end(data);
    });
});

server.listen(9876, () => {
    console.log('Server running on :9876');
    console.log('Taking screenshots...');

    // Use gnome-screenshot or import (ImageMagick) if available
    try {
        execSync('which import', { encoding: 'true' });
        console.log('ImageMagick import available');
    } catch(e) {
        console.log('ImageMagick not available');
    }
    
    try {
        execSync('which scrot', { encoding: 'true' });
        console.log('scrot available');
    } catch(e) {
        console.log('scrot not available');
    }
    
    try {
        execSync('which gnome-screenshot', { encoding: 'true' });
        console.log('gnome-screenshot available');
    } catch(e) {
        console.log('gnome-screenshot not available');
    }
    
    // Take a full-page screenshot using puppeteer-core if chrome exists
    try {
        execSync('which google-chrome chromium chromium-browser 2>/dev/null', { encoding: 'true' });
        console.log('Chrome available!');
    } catch(e) {
        console.log('No Chrome binary found');
    }

    server.close();
});
