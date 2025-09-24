const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT, 10) || 3000

// Initialize Next.js app with proper configuration
const app = next({ 
  dev, 
  hostname, 
  port,
  conf: {
    // Ensure static file serving works
    assetPrefix: '',
    trailingSlash: true,
    poweredByHeader: false
  }
})
const handle = app.getRequestHandler()

console.log(`🌱 Green Dee Farm - Starting Next.js server...`)
console.log(`Environment: ${dev ? 'development' : 'production'}`)
console.log(`Hostname: ${hostname}`)
console.log(`Port: ${port}`)

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse the URL
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      console.log(`📋 Request: ${req.method} ${pathname}`)

      // Handle health check
      if (pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ 
          status: 'OK', 
          service: 'Green Dee Farm',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }))
        return
      }

      // Set proper headers for static assets
      if (pathname.startsWith('/_next/static/')) {
        // Set appropriate MIME types
        if (pathname.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css; charset=utf-8')
        } else if (pathname.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        } else if (pathname.endsWith('.json')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
        }
        
        // Set caching headers for static assets
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      }

      // Let Next.js handle all routes
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('❌ Error occurred handling', req.url, err)
      
      // Send proper error response
      if (!res.headersSent) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Green Dee Farm - Error</title>
              <meta charset="utf-8">
            </head>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h1>🌱 Green Dee Farm</h1>
              <h2>เกิดข้อผิดพลาดชั่วคราว</h2>
              <p>กรุณาลองใหม่อีกครั้ง หรือติดต่อ 064-542-0333</p>
              <button onclick="location.reload()">รีโหลดหน้า</button>
            </body>
          </html>
        `)
      }
    }
  })
  .listen(port, (err) => {
    if (err) {
      console.error('❌ Failed to start server:', err)
      throw err
    }
    console.log(`✅ Green Dee Farm ready on http://${hostname}:${port}`)
    console.log(`🌿 Organic vegetables delivery service is online!`)
  })
  .on('error', (err) => {
    console.error('❌ Server error:', err)
  })
})
.catch((err) => {
  console.error('❌ Failed to prepare Next.js app:', err)
  process.exit(1)
})