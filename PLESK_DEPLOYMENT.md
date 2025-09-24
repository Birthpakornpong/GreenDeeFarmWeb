# Green Dee Farm - Plesk Deployment Instructions

## 🚀 Plesk Node.js Configuration

### Application Settings:
```
Application Startup File: server.js
Document Root: /greendeefarm
Application Root: /greendeefarm  
Node.js Version: 24.8.0
Package Manager: npm
Application Mode: production
```

### Environment Variables:
```
NODE_ENV=production
PORT=3000
HOSTNAME=greendeefarm.com
NEXTAUTH_URL=https://www.greendeefarm.com/
```

### Deployment Steps:

1. **Upload Files**: Upload all project files to `/greendeefarm/`

2. **Install Dependencies**:
   - Click "NPM install" in Plesk Node.js section

3. **Build Project**:
   - Click "Run script" → Select "build"
   - Wait for build to complete

4. **Start Application**:
   - Click "Restart App"

5. **Verify**:
   - Check application logs
   - Visit: http://greendeefarm.com

### Troubleshooting:

**If app doesn't start:**
```bash
# Check logs in Plesk
# Verify server.js exists
# Ensure all dependencies installed
# Check Node.js version compatibility
```

**Health Check:**
Visit: http://greendeefarm.com/health

**Contact:**
- Phone: 064-542-0333
- Line: birhids
- Service Areas: Phuket, Phang Nga, Krabi