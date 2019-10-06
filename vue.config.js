const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  pubicPath: "",

  configureWebpack: {
    plugins: [new GenerateSW()]
  }
};
