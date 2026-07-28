<template>
  <div>
    <settings-inner-header v-bind="$attrs" :is-general="true" />
    <settings-select
      :select="selectCurrency"
      title="Currency"
      :value="currentSelectedCurrency"
      :list="currencyList"
    />
    <div class="settings__label">
      <p>Select your preferred display currency</p>
    </div>

    <settings-switch
      title="Turn off Ethereum for 1 hour"
      :is-checked="isEthereumDisabled"
      @update:check="toggleEthereumDisable"
    />
    <div class="settings__label">
      <p>Pause Ethereum dApp interactions when using another web3 extension.</p>
    </div>

    <settings-switch
      title="Turn on Unisat injection"
      :is-checked="isUnisatEnabled"
      @update:check="toggleUnisatEnable"
    />
    <div class="settings__label">
      <p>Allow Terenval Wallet to act like a Unisat-compatible wallet for Bitcoin dApps.</p>
    </div>

    <settings-switch
      title="Usage analytics"
      :is-checked="isMetricsEnabled"
      @update:check="toggleMetricsEnabled"
    />
    <div class="settings__label">
      <p>
        Sends operation type, network, feature, app version and approximate USD
        amount range to Terenval. Never sends seed phrases, private keys, wallet
        addresses, transaction hashes, exact amounts or browsing history.
        <a href="https://terenval.com/privacy/" target="_blank">Privacy Policy</a>
      </p>
    </div>

    <settings-button
      v-if="!isCwsReviewBuild"
      title="Settings backup"
      @click="$emit('open:backups')"
    />
    <div v-if="!isCwsReviewBuild" class="settings__label">
      <p>Save your current account list so it can be restored later.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SettingsInnerHeader from '@action/views/settings/components/settings-inner-header.vue';
import SettingsSelect from '@action/views/settings/components/settings-select.vue';
import SettingsButton from '@action/views/settings/components/settings-button.vue';
import SettingsSwitch from '@action/views/settings/components/settings-switch.vue';
import SettingsState from '@/libs/settings-state';
import { SettingsType } from '@/libs/settings-state/types';
import { setAnalyticsEnabled } from '@/libs/analytics';
import { useCurrencyStore } from '../../store';
import { storeToRefs } from 'pinia';
import { IS_CWS_REVIEW_BUILD } from '@/configs/review-build';

const settingsState = new SettingsState();
const isEthereumDisabled = ref(false);
const isUnisatEnabled = ref(true);
const isMetricsEnabled = ref(false);
const store = useCurrencyStore();
const isCwsReviewBuild = IS_CWS_REVIEW_BUILD;
const { setSelectedCurrency } = store;
const { currentSelectedCurrency, currencyList } = storeToRefs(store);
defineEmits<{ (e: 'open:backups'): void }>();

onMounted(async () => {
  const allSettings: SettingsType = await settingsState.getAllSettings();
  isEthereumDisabled.value = allSettings.evm.inject.disabled;
  isUnisatEnabled.value = allSettings.btc.injectUnisat;
  isMetricsEnabled.value = allSettings.enkrypt.isMetricsEnabled;
});

const toggleEthereumDisable = async (isChecked: boolean) => {
  const evmSettings = await settingsState.getEVMSettings();
  evmSettings.inject = { disabled: isChecked, timestamp: Date.now() };
  await settingsState.setEVMSettings(evmSettings);
  isEthereumDisabled.value = isChecked;
};
const selectCurrency = async (currency: string) => setSelectedCurrency(currency);
const toggleUnisatEnable = async (isChecked: boolean) => {
  const btcSettings = await settingsState.getBtcSettings();
  btcSettings.injectUnisat = isChecked;
  await settingsState.setBtcSettings(btcSettings);
  isUnisatEnabled.value = isChecked;
};
const toggleMetricsEnabled = async (isChecked: boolean) => {
  await setAnalyticsEnabled(isChecked);
  isMetricsEnabled.value = isChecked;
};
</script>

<style lang="less">
@import '@action/styles/theme.less';
.settings {
  &__label {
    padding: 0 48px;
    margin-bottom: 10px;
    p {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.5px;
      color: @tertiaryLabel;
      margin: 0;
    }
    a { color: @primary; }
  }
}
</style>
