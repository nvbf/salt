module.exports = {
  webpack(config, options) {
    const { isServer } = options;
    if (!isServer) {
      config.node = {
        fs: "empty"
      };
    }
    return config;
  }
};
