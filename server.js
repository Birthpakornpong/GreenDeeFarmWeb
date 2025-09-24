const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT, 10) || 3000

// Initialize Next.js app
const app = next({ dev, hostname, port })
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

      // Handle special routes if needed
      if (pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ 
          status: 'OK', 
          service: 'Green Dee Farm',
          timestamp: new Date().toISOString()
        }))
        return
      }

      // Let Next.js handle all other routes
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('❌ Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal server error')
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