// pages/api/health-check.js - Simple health check without database
export default function handler(req, res) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    platform: process.platform,
    env_variables: {
      DB_HOST: process.env.DB_HOST ? 'SET' : 'NOT_SET',
      DB_PORT: process.env.DB_PORT ? 'SET' : 'NOT_SET',
      DB_NAME: process.env.DB_NAME ? 'SET' : 'NOT_SET',
      DB_USER: process.env.DB_USER ? 'SET' : 'NOT_SET',
      DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT_SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT_SET'
    },
    message: 'API is working correctly'
  };

  return res.status(200).json(health);
}