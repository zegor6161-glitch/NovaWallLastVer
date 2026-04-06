<template>
  <div v-if="showPromo" class="reward-program-banner">
    <p class="reward-program-banner__headline">
      Reward Program for Active Nova Wallet Users
    </p>
    <p class="reward-program-banner__supporting">
      Explore the reward program on Mainnet Faucet.
    </p>
    <button class="reward-program-banner__cta" type="button" @click="openRewardProgram">
      Learn More
    </button>
  </div>
</template>

<script setup lang="ts">
import { openLink } from '@action/utils/browser';
import { isPromoSurfaceAllowed } from '@/configs/review-build';

const REWARD_PROGRAM_URL = 'https://mainnetfaucet.com/';
const showPromo = isPromoSurfaceAllowed();

const openRewardProgram = () => {
  openLink(REWARD_PROGRAM_URL);
};
</script>

<style lang="less" scoped>
@import '@action/styles/theme.less';

.reward-program-banner {
  margin: 0 16px 12px;
  padding: 14px 16px;
  border-radius: 12px;
  background: @primaryLight;
  border: 1px solid @primary007;

  &__headline {
    margin: 0;
    color: @primaryLabel;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  &__supporting {
    margin: 4px 0 0;
    color: @secondaryLabel;
    font-size: 12px;
    line-height: 16px;
  }

  &__cta {
    margin-top: 10px;
    height: 32px;
    padding: 0 12px;
    border: none;
    border-radius: 8px;
    background: @primary;
    color: @white;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
