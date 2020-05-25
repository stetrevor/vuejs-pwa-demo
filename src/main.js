import Vue from "vue";
import App from "./App.vue";
import wb from "./registerServiceWorker";

Vue.config.productionTip = false;

Vue.prototype.$workbox = wb;

new Vue({
  render: h => h(App)
}).$mount("#app");
