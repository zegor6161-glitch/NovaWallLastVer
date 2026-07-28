<template>
  <div class="cws-assets">
    <h2>{{ network.name_long }}</h2>
    <p v-if="loading">Loading balance…</p>
    <p v-else-if="assets.length === 0">No assets found.</p>
    <div v-for="asset in assets" :key="`${asset.symbol}-${asset.contract}`" class="cws-assets__item">
      <img :src="asset.icon" width="36" height="36" alt="" />
      <div>
        <strong>{{ asset.symbol }}</strong>
        <small>{{ asset.balancef }}</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type PropType } from 'vue';
import type { BaseNetwork } from '@/types/base-network';
import type { AssetsType } from '@/types/provider';
import type { AccountsHeaderData } from '@/ui/action/types/account';

const props = defineProps({
  network: { type: Object as PropType<BaseNetwork>, required: true },
  accountInfo: { type: Object as PropType<AccountsHeaderData>, required: true },
});

const assets = ref<AssetsType[]>([]);
const loading = ref(false);

const load = async () => {
  const account = props.accountInfo.selectedAccount;
  if (!account) {
    assets.value = [];
    return;
  }
  loading.value = true;
  try {
    assets.value = await props.network.getAllTokenInfo(account.address);
  } catch {
    assets.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(load);
watch(() => [props.network.name, props.accountInfo.selectedAccount?.address], load);
</script>

<style scoped>
.cws-assets { padding: 84px 24px 80px; height: 600px; box-sizing: border-box; overflow: auto; }
h2 { margin: 0 0 20px; }
.cws-assets__item { display: flex; gap: 12px; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
.cws-assets__item div { display: flex; flex-direction: column; }
small { color: #64748b; }
</style>
