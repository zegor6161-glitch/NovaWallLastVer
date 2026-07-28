<template>
  <div class="cws-activity">
    <h2>Activity</h2>
    <p v-if="loading">Loading activity…</p>
    <p v-else-if="activities.length === 0">No transactions yet.</p>
    <a
      v-for="activity in activities"
      :key="activity.transactionHash"
      class="cws-activity__item"
      :href="explorerUrl(activity.transactionHash)"
      target="_blank"
      rel="noreferrer"
    >
      <span>{{ activity.isIncoming ? 'Received' : 'Sent' }}</span>
      <small>{{ shortHash(activity.transactionHash) }}</small>
    </a>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type PropType } from 'vue';
import type { BaseNetwork } from '@/types/base-network';
import type { Activity } from '@/types/activity';
import type { AccountsHeaderData } from '@/ui/action/types/account';

const props = defineProps({
  network: { type: Object as PropType<BaseNetwork>, required: true },
  accountInfo: { type: Object as PropType<AccountsHeaderData>, required: true },
});

const activities = ref<Activity[]>([]);
const loading = ref(false);

const load = async () => {
  const account = props.accountInfo.selectedAccount;
  if (!account) {
    activities.value = [];
    return;
  }
  loading.value = true;
  try {
    activities.value = await props.network.getAllActivity(
      props.network.displayAddress(account.address),
    );
  } catch {
    activities.value = [];
  } finally {
    loading.value = false;
  }
};

const shortHash = (hash: string) => `${hash.slice(0, 10)}…${hash.slice(-6)}`;
const explorerUrl = (hash: string) =>
  props.network.blockExplorerTX.replace('[[txHash]]', hash);

onMounted(load);
watch(() => [props.network.name, props.accountInfo.selectedAccount?.address], load);
</script>

<style scoped>
.cws-activity { padding: 84px 24px 80px; height: 600px; box-sizing: border-box; overflow: auto; }
h2 { margin: 0 0 20px; }
.cws-activity__item { display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid #e5e7eb; color: inherit; text-decoration: none; }
small { color: #64748b; }
</style>
