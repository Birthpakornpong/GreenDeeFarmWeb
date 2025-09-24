const withPlugins = require('next-compose-plugins')

const plugins = []

const nextConfig = {
  env: {
    VERSION: '1.0',
  },
  experimental: {
    outputStandalone: true,
  },
}

module.exports = withPlugins(plugins, nextConfig)
