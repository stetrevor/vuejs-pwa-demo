const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  publicPath: "",

  configureWebpack: {
    plugins: [new GenerateSW()]
  }
};
