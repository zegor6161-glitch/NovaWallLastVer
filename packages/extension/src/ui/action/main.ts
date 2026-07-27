import { createApp } from 'vue';
import App from './App.cws.vue';
import router from './router';
import * as filters from './utils/filters';
import { createPinia } from 'pinia';

global.WeakMap = WeakMap;

if (import.meta.env.DEV) {
  globalThis.__ENKRYPT_DEBUG_LOG_CONF__ = import.meta.env.VITE_DEBUG_LOG;
}

const app = createApp(App);
const pinia = createPinia();

app.use(router).use(pinia);
app.config.globalProperties.$filters = filters;
app.mount('#app');
