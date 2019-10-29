1. `vue create vuejs-pwa`
2. `vue add pwa`
3. `yarn remove register-service-worker @vue/cli-plugin-pwa`
4. Add manifest.json to index.html
5. `yarn add -D workbox-webpack-plugin`
6. Config vue.config.js
    - publicPath
    - workbox GenerateSW plugin
7. Register and export workbox in _registerServiceWorker_
8. Add upgrade dialog in App.vue