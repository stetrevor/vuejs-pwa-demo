import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import wb from "./registerServiceWorker";

Vue.config.productionTip = false;

Vue.prototype.$workbox = wb;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
