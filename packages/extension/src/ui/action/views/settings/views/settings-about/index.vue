<template>
  <div>
    <settings-inner-header v-bind="$attrs" :is-about="true" />

    <settings-button
      title="Visit our website"
      :is-link="true"
      @click="siteAction"
    />
  </div>
</template>

<script setup lang="ts">
import SettingsInnerHeader from '@action/views/settings/components/settings-inner-header.vue';
import SettingsButton from '@action/views/settings/components/settings-button.vue';

const siteAction = () => {
  window.open('https://terenval.com/', '_blank', 'noopener');
};

</script>

<style lang="less">
@import '@action/styles/theme.less';
</style>
