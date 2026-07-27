import {
  setWindowNamespace,
  windowOnMessage,
  providerSendMessage,
} from '@/libs/messenger/bridge-window';
import { ProviderName, ProviderType } from '@/types/provider';
import EthereumProvider from '@/providers/ethereum/inject';
import BitcoinProvider from '@/providers/bitcoin/inject';
import { InternalMethods } from '@/types/messenger';

setWindowNamespace();
(window as Window).enkrypt = {
  providers: {},
  settings: {},
};

const loadInjectedProviders = () => {
  EthereumProvider(window, {
    name: ProviderName.ethereum,
    type: ProviderType.evm,
    sendMessageHandler: providerSendMessage,
  });
  BitcoinProvider(window, {
    name: ProviderName.bitcoin,
    type: ProviderType.bitcoin,
    sendMessageHandler: providerSendMessage,
  });
};

loadInjectedProviders();

windowOnMessage(async (msg): Promise<void> => {
  window['enkrypt']['providers'][msg.provider].handleMessage(msg.message);
});
window.addEventListener('load', () => {
  providerSendMessage(
    ProviderName.enkrypt,
    JSON.stringify({ method: InternalMethods.newWindowInit }),
  );
});
window.addEventListener('beforeunload', () => {
  providerSendMessage(
    ProviderName.enkrypt,
    JSON.stringify({ method: InternalMethods.newWindowUnload }),
  );
});
