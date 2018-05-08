require('dotenv').config()

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { WebpackBundleSizeAnalyzerPlugin } = require('webpack-bundle-size-analyzer')

const { ANALYZE } = process.env

module.exports = {
  webpack(config, options) {
    const { isServer } = options;
    if (!isServer) {
      config.node = {
        fs: "empty"
      };
    }

		if (ANALYZE) {
			config.plugins.push(new WebpackBundleSizeAnalyzerPlugin('stats.txt'))
			config.plugins.push(
				new BundleAnalyzerPlugin({
					analyzerMode: 'server',
					analyzerPort: isServer ? 8888 : 8889,
					openAnalyzer: true
				})
			)
    }
        
    return config;
  }
};
