import { RouteRecordRaw } from 'vue-router';
import Home from './home.vue';

import EthereumUI from '@/providers/ethereum/ui';
import BitcoinUI from '@/providers/bitcoin/ui';
import EnkryptUI from './enkrypt';

const uiProviders = [EthereumUI, BitcoinUI, EnkryptUI];
let uiRoutes: RouteRecordRaw[] = [];
uiProviders.forEach(provider => {
  uiRoutes = uiRoutes.concat(provider.routes);
});
const routes = [{ path: '/', component: Home, name: 'home' }, ...uiRoutes];
export default routes;
