<template>
  <div>
    <div
      v-if="isAddressRestricted.isRestricted || geoRestricted"
      :class="['app', 'restricted-container', 'expanded']"
    >
      <restricted
        :is-initialized="isWalletInitialized"
        :is-address-restricted="isAddressRestricted.isRestricted"
        :restricted-address="isAddressRestricted.address"
        @restricted:switch-account="switchToUnrestrictedAddress"
      />
    </div>

    <div v-else :class="[{ locked: isLocked }, 'app']">
      <div
        v-if="isLoading"
        :class="['app__loading', isExpanded ? 'expanded' : 'collapsed']"
        aria-label="Loading Terenval Wallet"
      >
        <div class="app__spinner" />
      </div>

      <div v-show="!isLoading">
        <app-menu
          :active-network="currentNetwork"
          @update:network="setNetwork"
          @show:settings-dialog="settingsShow = true"
          @show:other-networks-dialog="addNetworkShow = true"
          @action:lock-enkrypt="lockAction"
        />
      </div>

      <div
        v-show="!isLoading"
        :class="[
          isExpanded ? 'app__content-expand' : 'app__content-collapse',
          'app__content',
        ]"
      >
        <accounts-header
          v-show="showNetworkMenu"
          :account-info="accountHeaderData"
          :network="currentNetwork"
          :show-deposit="showDepositWindow"
          @update:init="init"
          @address-changed="onSelectedAddressChanged"
          @select:subnetwork="onSelectedSubnetworkChange"
          @toggle:deposit="toggleDepositWindow"
        />

        <router-view v-slot="{ Component }" name="view">
          <transition :name="transitionName" mode="out-in">
            <component
              :is="Component"
              :key="route.fullPath"
              :network="currentNetwork"
              :subnetwork="currentSubNetwork"
              :account-info="accountHeaderData"
              @update:init="init"
              @toggle:deposit="toggleDepositWindow"
            />
          </transition>
        </router-view>

        <network-menu
          v-show="showNetworkMenu"
          :selected="route.params.id as string"
          :network="currentNetwork"
        />
      </div>

      <add-network
        v-if="addNetworkShow"
        @close:popup="addNetworkShow = false"
      />

      <settings
        v-if="settingsShow"
        @close:popup="settingsShow = false"
        @action:lock="lockAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import type { EnkryptAccount } from '@enkryptcom/types';
import { fromBase } from '@enkryptcom/utils';

import DomainState from '@/libs/domain-state';
import PublicKeyRing from '@/libs/keyring/public-keyring';
import { sendToBackgroundFromAction } from '@/libs/messenger/extension';
import {
  getAccountsByNetworkName,
  getOtherSigners,
} from '@/libs/utils/accounts';
import { DEFAULT_EVM_NETWORK, getNetworkByName } from '@/libs/utils/networks';
import openOnboard from '@/libs/utils/open-onboard';
import { isGeoRestricted, isWalletRestricted } from '@/libs/utils/screening';
import BTCAccountState from '@/providers/bitcoin/libs/accounts-state';
import EVMAccountState from '@/providers/ethereum/libs/accounts-state';
import { MessageMethod } from '@/providers/ethereum/types';
import { EvmNetwork } from '@/providers/ethereum/types/evm-network';
import type { BaseNetwork } from '@/types/base-network';
import { InternalMethods } from '@/types/messenger';
import {
  EnkryptProviderEventMethods,
  ProviderName,
} from '@/types/provider';

import AccountsHeader from './components/accounts-header/index.vue';
import AppMenu from './components/app-menu/index.vue';
import NetworkMenu from './components/network-menu/index.vue';
import type { AccountsHeaderData } from './types/account';
import AddNetwork from './views/add-network/index.vue';
import Restricted from './views/restricted/index.vue';
import Settings from './views/settings/index.vue';
import { useMenuStore } from './store/menu-store';
import { useNetworksStore } from './store/networks-store';

const domainState = new DomainState();
const keyring = new PublicKeyRing();
const router = useRouter();
const route = useRoute();

const transitionName = 'fade';
const defaultNetwork = DEFAULT_EVM_NETWORK;
const currentNetwork = ref<BaseNetwork>(defaultNetwork);
const currentSubNetwork = ref('');
const showDepositWindow = ref(false);
const addNetworkShow = ref(false);
const settingsShow = ref(false);
const isLoading = ref(true);
const geoRestricted = ref(false);
const isWalletInitialized = ref(false);
const isAddressRestricted = ref({
  isRestricted: false,
  address: '',
});

const accountHeaderData = ref<AccountsHeaderData>({
  activeAccounts: [],
  inactiveAccounts: [],
  selectedAccount: null,
  activeBalances: [],
});

const menuStore = useMenuStore();
const { isExpanded } = storeToRefs(menuStore);
const networksStore = useNetworksStore();

const toggleDepositWindow = () => {
  showDepositWindow.value = !showDepositWindow.value;
};

const isKeyRingLocked = async (): Promise<boolean> => {
  const response = await sendToBackgroundFromAction({
    message: JSON.stringify({ method: InternalMethods.isLocked, params: [] }),
    provider: currentNetwork.value.provider,
    tabId: await domainState.getCurrentTabId(),
  });
  return JSON.parse(response.result || 'true');
};

const init = async () => {
  const savedNetworkName = await domainState.getSelectedNetWork();
  const savedNetwork = savedNetworkName
    ? await getNetworkByName(savedNetworkName)
    : undefined;

  await setNetwork(savedNetwork ?? defaultNetwork);
  await networksStore.setActiveNetworks();
  isLoading.value = false;
};

onMounted(async () => {
  geoRestricted.value = await isGeoRestricted();
  isWalletInitialized.value = await keyring.isInitialized();

  if (geoRestricted.value) {
    isLoading.value = false;
    return;
  }

  if (!isWalletInitialized.value) {
    await openOnboard();
    window.close();
    return;
  }

  if (await isKeyRingLocked()) {
    await router.push({ name: 'lock-screen' });
    isLoading.value = false;
  } else {
    await init();
  }

  menuStore.init();
});

const setNetwork = async (network: BaseNetwork) => {
  currentSubNetwork.value = network.subNetworks
    ? await domainState.getSelectedSubNetwork()
    : '';

  const activeAccounts = await getAccountsByNetworkName(network.name);
  const inactiveAccounts = await keyring.getAccounts(
    getOtherSigners(network.signer),
  );

  const selectedAddress = await domainState.getSelectedAddress();
  const selectedAccount =
    activeAccounts.find(account => account.address === selectedAddress) ??
    activeAccounts[0] ??
    null;

  accountHeaderData.value = {
    activeAccounts,
    inactiveAccounts,
    selectedAccount,
    activeBalances: activeAccounts.map(() => '~'),
  };

  currentNetwork.value = network;

  if (selectedAccount) {
    await checkAddress(selectedAccount);
  } else {
    isAddressRestricted.value = { isRestricted: false, address: '' };
  }

  await router.push({ name: 'assets', params: { id: network.name } });

  const tabId = await domainState.getCurrentTabId();
  const previousNetworkName = await domainState.getSelectedNetWork();

  if (
    previousNetworkName !== network.name &&
    network.provider === ProviderName.ethereum &&
    (network as EvmNetwork).chainID
  ) {
    await sendToBackgroundFromAction({
      message: JSON.stringify({
        method: InternalMethods.changeNetwork,
        params: [network.name],
      }),
      provider: network.provider,
      tabId,
    });

    await sendToBackgroundFromAction({
      message: JSON.stringify({
        method: InternalMethods.sendToTab,
        params: [
          {
            method: MessageMethod.changeChainId,
            params: [(network as EvmNetwork).chainID],
          },
        ],
      }),
      provider: network.provider,
      tabId,
    });
  }

  await sendToBackgroundFromAction({
    message: JSON.stringify({
      method: InternalMethods.sendToTab,
      params: [
        {
          method: EnkryptProviderEventMethods.chainChanged,
          params: [network.name],
        },
      ],
    }),
    provider: network.provider,
    tabId,
  });

  await domainState.setSelectedNetwork(network.name);

  try {
    const networkAtRequestTime = network.name;
    const api = await network.api();
    const balances = await Promise.all(
      activeAccounts.map(account => api.getBalance(account.address)),
    );

    if (currentNetwork.value.name === networkAtRequestTime) {
      accountHeaderData.value.activeBalances = balances.map(balance =>
        fromBase(balance, network.decimals),
      );
    }
  } catch (error) {
    console.error('Unable to load account balances', error);
  }
};

const checkAddress = async (activeAccount: EnkryptAccount) => {
  const displayAddress = currentNetwork.value.displayAddress(
    activeAccount.address,
  );
  const restricted = await isWalletRestricted(displayAddress);
  isAddressRestricted.value = {
    isRestricted: restricted,
    address: restricted ? displayAddress : '',
  };
};

const onSelectedSubnetworkChange = async (id: string) => {
  await domainState.setSelectedSubNetwork(id);
  currentSubNetwork.value = id;
  await setNetwork(currentNetwork.value);
};

const onSelectedAddressChanged = async (newAccount: EnkryptAccount) => {
  accountHeaderData.value.selectedAccount = newAccount;
  await checkAddress(newAccount);

  if (isAddressRestricted.value.isRestricted) return;

  const accountState =
    currentNetwork.value.provider === ProviderName.ethereum
      ? new EVMAccountState()
      : currentNetwork.value.provider === ProviderName.bitcoin
        ? new BTCAccountState()
        : null;

  if (accountState) {
    const domain = await domainState.getCurrentDomain();
    await accountState.addApprovedAddress(newAccount.address, domain);
  }

  await domainState.setSelectedAddress(newAccount.address);
  await sendToBackgroundFromAction({
    message: JSON.stringify({
      method: InternalMethods.sendToTab,
      params: [
        {
          method: MessageMethod.changeAddress,
          params: [currentNetwork.value.displayAddress(newAccount.address)],
        },
      ],
    }),
    provider: currentNetwork.value.provider,
    tabId: await domainState.getCurrentTabId(),
  });
};

const showNetworkMenu = computed(() => {
  const selected = route.params.id as string;
  return (
    Boolean(selected) &&
    ['activity', 'assets', 'nfts', 'dapps'].includes(String(route.name))
  );
});

const switchToUnrestrictedAddress = () => {
  const account = accountHeaderData.value.activeAccounts.find(
    candidate =>
      currentNetwork.value.displayAddress(candidate.address) !==
      isAddressRestricted.value.address,
  );
  if (account) void onSelectedAddressChanged(account);
};

const isLocked = computed(() => route.name === 'lock-screen');

const lockAction = async () => {
  await sendToBackgroundFromAction({
    message: JSON.stringify({ method: InternalMethods.lock, params: [] }),
    provider: currentNetwork.value.provider,
    tabId: await domainState.getCurrentTabId(),
  });
  await router.push({ name: 'lock-screen' });
};
</script>

<style lang="less">
@import './styles/theme.less';

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family:
    system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.collapsed {
  width: 516px;
}

.expanded {
  width: 800px;
}

.app {
  height: 600px;
  overflow: hidden;
  position: relative;
  transition: width 0.3s ease-in, height 0.3s ease-in;

  &__loading {
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: radial-gradient(
        100% 50% at 100% 50%,
        rgba(250, 250, 250, 0.92) 0%,
        rgba(250, 250, 250, 0.98) 100%
      )
      @primary;
  }

  &__spinner {
    width: 42px;
    height: 42px;
    border: 4px solid rgba(0, 0, 0, 0.12);
    border-top-color: @primaryLabel;
    border-radius: 50%;
    animation: terenval-spin 0.8s linear infinite;
  }

  &__content {
    width: 460px;
    height: 600px;
    position: relative;

    &-expand {
      padding-left: 340px;
    }

    &-collapse {
      padding-left: 56px;
    }
  }
}

@keyframes terenval-spin {
  to {
    transform: rotate(360deg);
  }
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.3s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}

.restricted-container {
  width: 800px;
  height: 600px;
}
</style>
