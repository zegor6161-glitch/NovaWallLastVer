<template>
  <app-dialog v-model="model" width="360px" is-centered @close:dialog="close">
    <div class="rate__wrap">
      <div class="rate__header">
        <h2>Enjoying Terenval Wallet so far?</h2>
      </div>
      <p>Let us know how you feel, your feedback is important to us.</p>
      <base-button
        title="I have feedback"
        :no-background="true"
        :click="goToFeedback"
      />
    </div>
  </app-dialog>
</template>

<script setup lang="ts">
import AppDialog from '@action/components/app-dialog/index.vue';
import BaseButton from '@action/components/base-button/index.vue';
import RateState from '@/libs/rate-state';
import { openLink } from '@action/utils/browser';

const model = defineModel<boolean>();
const rateState = new RateState();

const close = async () => {
  await rateState.resetPopupTimer();
  model.value = false;
};

const goToFeedback = async () => {
  await rateState.resetPopupTimer();
  openLink('https://terenval.com/support/');
  model.value = false;
};

</script>

<style lang="less">
@import '@action/styles/theme.less';

.rate {
  &__wrap {
    width: 360px;
    height: auto;
    overflow-x: hidden;

    p {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: @secondaryLabel;
      margin: 0 0 12px 0;
    }
  }

  &__header {
    width: 100%;
    background: @white;
    box-sizing: border-box;
    padding: 0 40px 12px 0;

    h2 {
      font-style: normal;
      font-weight: bold;
      font-size: 24px;
      line-height: 32px;
      margin: 0;
      color: @primaryLabel;
    }
  }

  &__button-indent {
    margin-bottom: 8px;
  }
}
</style>
