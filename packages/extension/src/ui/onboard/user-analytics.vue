<template>
  <div class="new-wallet">
    <logo-big class="new-wallet__logo" />
    <h3>Usage analytics</h3>
    <p>
      Help us improve Nova Wallet by sharing anonymous product analytics.
      Analytics is optional and disabled by default.
    </p>
    <p>
      We only collect high-level product events (for example: wallet creation,
      network switch, send/swap start and submit) and never collect your seed
      phrase, private keys, passwords, signatures, or full transaction payloads.
    </p>
    <p>
      You can change this anytime in Settings → General → Usage analytics.
    </p>

    <div class="new-wallet__buttons">
      <base-button title="Enable usage analytics" :click="agree" />
      <base-button
        title="Keep usage analytics off"
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
import { optOutofMetrics } from '@/libs/metrics';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const agree = async () => {
  await setAnalyticsEnabled(true);
  optOutofMetrics(false);
  if (route.name === 'user-privacy') {
    window.close();
  } else {
    router.push({ name: 'new-wallet' });
  }
};

const deny = async () => {
  await setAnalyticsEnabled(false);
  optOutofMetrics(true);
  if (route.name === 'user-privacy') {
    window.close();
  } else {
    router.push({ name: 'new-wallet' });
  }
};
</script>

<style lang="less">
@import '@action/styles/theme.less';

.new-wallet {
  &__logo {
    margin-bottom: 24px;
  }

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
    margin: 0 0 16px 0;
    color: @primaryLabel;
  }

  &__buttons {
    text-align: center;

    a {
      margin-top: 8px;
    }
  }
}
</style>
