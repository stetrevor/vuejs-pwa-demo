# 3 Steps to Add PWA to Vue.js, the How and Why

## The How
### Step 1: Install packages.
We will start with creating a Vue.js project by `vue create vuejs-pwa` without selecting `PWA` option. Then use `vue add pwa` to add files related to PWA. Then add `workbox-webpack-plugin` as dev dependency using `yarn` or `npm`. Then remove `register-service-worker` and `@vue/cli-plugin-pwa`.

```sh
vue create vuejs-pwa
vue add pwa
yarn add -D workbox-webpack-plugin
yarn remove register-service-worker @vue/cli-plugin-pwa
```

### Step 2: Configure webpack.
We will create `vue.config.js` under root directory. Add the following:

```js
const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  publicPath: process.env.NODE_ENV === "development" ? "/vuejs-pwa/" : "",

  configureWebpack: {
    plugins: [new GenerateSW()]
  }
};
```

### Step 3: Use manifest.json and service worker.
Make sure the file `manifest.json` is linked in `public/index.html`.

```html
<link rel="manifest" href="<%= BASE_URL %>manifest.json">
```

In `src/registerServiceWorker.js`, delete all lines and add the following:
```js
import { Workbox } from "workbox-window";

let wb;

if ("serviceWorker" in navigator) {
  wb = new Workbox(`${process.env.BASE_URL}service-worker.js`);

  wb.addEventListener("controlling", () => {
    window.location.reload();
  });

  wb.register();
} else {
  wb = null;
}

export default wb;
```

Then in `src/main.js`, delete the line `import './registerServiceWorker'`, and add the following:
```js
import wb from "./registerServiceWorker";

Vue.prototype.$workbox = wb;
```

Last in `src/App.vue`:
```js
created() {
    if (this.$workbox) {
      this.$workbox.addEventListener("waiting", () => {
        this.showUpgradeUI = true;
      });
    }
  },
```

And include UI to upgrade to the new version, where the accept button listener of the UI does this:
```js
async accept() {
  this.showUpgradeUI = false
  await this.$workbox.messageSW({ type: "SKIP_WAITING" });
}
```

I have created a repo where all codes are available. https://github.com/stetrevor/vuejs-pwa-demo.git

## The Why

The go to solution for adding PWA functionalities is `@vue/cli-plugin-pwa`. Using `vue add pwa` takes care of bootstrapping the project for PWA.

### The problem with `@vue/cli-plugin-pwa`
At the time of this writing, `@vue/cli-plugin-pwa` uses `workbox` version `3.6.3`. However, `workbox` version `^4.0.0` is already out and production ready. And it has the package `workbox-window` which allows interacting with service worker from the main thread with ease.

Future `@vue/cli-plugin-pwa` will ship `workbox^4.0.0`. But for now, we will use `vue add pwa` to add the files needed, then move on to use `workbox-webpack-plugin`. Hence the removal of the `@vue/cli-plugin-pwa` and the `register-service-worker` packages.

### Debug service worker in `development` mode
Even though Vue Cli website doesn't suggest debugging service worker in `development` mode. There are two reasons why we would try.

First, for basic caching and routing requirements, the plugin `GenerateSW` from `workbox-webpack-plugin` does a very good job, and the service worker is generated totally by the plugin. 

Second, if you deploy the app in a subdirectory, like a _\<username>.github.io/\<project-name>_, it's easier if we can see with our eyes that the service worker is installed and working properly during development.

To make this happen, we set `publicPath` to be `""` in `vue.config.js` for production. According Vue.js Cli documentation, this allows the app to be deployed in a subdirectory. We set it to `"/<subdirectory-name>/"` during development to mimic a production environment. And with `yarn serve` or `npm serve`, the app will be available at `localhost:8080/<subdirectory-name>/`.

### Include manifest.json
Always make sure to include `manifest.json` in `index.html`. And remember to use `<%= BASE_URL %>` to make sure it has the correct path with `yarn build`.

### Register service worker
The service worker registration is done by `Workbox` class from `workbox-window`. It takes the path of the service worker file, again, with `process.env.BASE_URL` to ensure the service worker path is correct.

The technique showing here to allow user to upgrade to a new version is adapted from [Offer a page reload for users](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users). To make sure the workbox is available everywhere in the app, it's added as an instance variable on `Vue`. It is available in `this` Vue context as `this.$workbox`. The code in `src/App.vue` uses workbox to prompt the upgrade UI and reload the page.

Last, you can follow the instructions in the `README.md` file in [vuejs-pwa-demo](https://github.com/stetrevor/vuejs-pwa-demo.git) to see how the code works.