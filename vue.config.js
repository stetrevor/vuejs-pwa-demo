module.exports = {
  publicPath: process.env.VUE_APP_DEPLOY || "",

  pwa: {
    themeColor: "#42b983",
    msTileColor: "#42b983",
    appleMobileWebAppCache: "yes",
    manifestOptions: {
      background_color: "#42b983"
    }
  }
};
