const path = require('path')
const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const withTM = require('next-transpile-modules')(['react-syntax-highlighter/dist'])
const sitemap = require('nextjs-sitemap-generator')

sitemap({
  baseUrl: 'https://banmanagement.com',
  pagesDirectory: path.resolve(__dirname, 'pages'),
  targetDirectory: 'public/',
  ignoredPaths: ['api'],
  ignoreIndexFiles: true
})

const nextConfig = {
  webpack (config) {
    config.module.rules.push({
      test: /\.(png|svg)$/i,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192,
          publicPath: './',
          outputPath: 'static/css/',
          name: '[name].[ext]',
          esModule: false
        }
      }]
    })

    return config
  },
  poweredByHeader: false
}

module.exports = withPlugins([
  [withBundleAnalyzer,
    {
      analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
      analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
      bundleAnalyzerConfig: {
        server: {
          analyzerMode: 'static',
          reportFilename: '../bundles/server.html'
        },
        browser: {
          analyzerMode: 'static',
          reportFilename: '../bundles/client.html'
        }
      }
    }
  ],
  [withTM]
], nextConfig)
