<template>
  <div class="new-wallet">
    <logo-big class="new-wallet__logo" />
    <h3>Help improve Terenval Wallet</h3>
    <p>
      You can enable optional product analytics to help us understand which
      networks and wallet features are useful. No analytics is sent until you
      choose an option below.
    </p>
    <p>
      When enabled, we collect the operation type, network/chain, feature used,
      app version and an approximate USD amount range such as under $10 or
      $10–$50. Event time is rounded to the hour.
    </p>
    <p>
      We never collect seed phrases, private keys, passwords, wallet addresses,
      transaction hashes, signatures, exact amounts, website URLs or browsing
      history. You can disable analytics anytime in Settings → General.
    </p>
    <p>
      Read the <a href="https://terenval.com/privacy/" target="_blank">Privacy Policy</a>.
    </p>

    <div class="new-wallet__buttons">
      <base-button title="Enable usage analytics" :click="agree" />
      <base-button
        title="Continue without analytics"
        :no-background="true"
        :click="deny"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import LogoBig from '@action/icons/common/logo-big.vue';
import BaseButton from '@action/components/base-button/index.vue';
import { setAnalyticsEnabled } from '@/libs/analytics';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const finish = () => {
  if (route.name === 'user-privacy') window.close();
  else router.push({ name: 'new-wallet' });
};

const agree = async () => {
  await setAnalyticsEnabled(true);
  finish();
};

const deny = async () => {
  await setAnalyticsEnabled(false);
  finish();
};
</script>

<style lang="less">
@import '@action/styles/theme.less';

.new-wallet {
  &__logo { margin-bottom: 24px; }
  h3 {
    font-style: normal;
    font-weight: 700;
    font-size: 34px;
    line-height: 40px;
    letter-spacing: 0.25px;
    color: @primaryLabel;
    margin: 0 0 16px 0;
  }
  p {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.25px;
    margin: 0 0 14px 0;
    color: @primaryLabel;
  }
  a { color: @primary; }
  &__buttons {
    text-align: center;
    a { margin-top: 8px; }
  }
}
</style>
