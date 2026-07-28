<template>
  <div class="accounts" :class="{ show: showAccounts }">
    <div class="accounts__overlay" @click="close()" />
    <div class="accounts__wrap" :class="{ show: showAccounts }">
      <BaseInputDebounced
        placeholder="Search Accounts"
        @update:value-debounced="updateSearchInput"
      />
      <custom-scrollbar
        class="accounts__scroll-area"
        :settings="scrollSettings({ suppressScrollX: true })"
      >
        <accounts-list-item
          v-for="(account, index) in displayActive"
          :key="index"
          :name="account.name"
          :address="network.displayAddress(account.address)"
          :amount="accountInfo.activeBalances[index]"
          :symbol="network.currencyName"
          :is-checked="accountInfo.selectedAccount?.address == account.address"
          :select="selectAccount"
          :active="true"
          :identicon-element="network.identicon"
          :show-edit="true"
          :deletable="account.walletType !== WalletType.mnemonic"
          @action:rename="renameAccount(index)"
          @action:delete="deleteAccount(index)"
        />

        <div v-if="displayInactive.length > 0" class="accounts__info">
          Incompatible accounts
        </div>

        <accounts-list-item
          v-for="(account, index) in displayInactive"
          :key="index"
          :name="account.name"
          :address="account.address"
          :is-checked="false"
          :active="false"
          :identicon-element="network.identicon"
        />
        <div
          v-if="displayInactive.length === 0 && displayActive.length === 0"
          class="accounts__info"
        >
          Accounts not found
        </div>
      </custom-scrollbar>

      <div class="accounts__action">
        <a class="accounts__action-button" @click="addAccountAction()">
          <add-account />
          Add account
        </a>

        <div class="accounts__action-divider" />

        <a class="accounts__action-button import" @click="importAction">
          <import-account-icon />
          Import account from another wallet
        </a>
      </div>
    </div>
  </div>

  <add-account-form v-model="isAddAccount" v-bind="$attrs" :network="network" />

  <rename-account-form
    v-if="isRenameAccount"
    v-model="isRenameAccount"
    v-bind="$attrs"
    :account="accountToRename"
    :network="network"
  />

  <delete-account-form
    v-if="isDeleteAccount"
    v-model="isDeleteAccount"
    v-bind="$attrs"
    :account="accountToDelete"
  />

  <import-account
    v-bind="$attrs"
    v-model="isImportAccount"
    :network="network"
  />
</template>

<script setup lang="ts">
import AccountsListItem from './components/accounts-list-item.vue';
import CustomScrollbar from '@action/components/custom-scrollbar/index.vue';
import AddAccount from '@action/icons/common/add-account.vue';
import AddAccountForm from './components/add-account-form.vue';
import RenameAccountForm from './components/rename-account-form.vue';
import DeleteAccountForm from './components/delete-account-form.vue';
import ImportAccountIcon from '@action/icons/actions/import-account-icon.vue';
import ImportAccount from '@action/views/import-account/index.vue';
import BaseInputDebounced from '@action/components/base-input-debounced/index.vue';
import { AccountsHeaderData } from '../../types/account';
import { PropType, ref, computed } from 'vue';
import scrollSettings from '@/libs/utils/scroll-settings';
import { EnkryptAccount, WalletType } from '@enkryptcom/types';
import { BaseNetwork } from '@/types/base-network';

const emit = defineEmits<{
  (e: 'addressChanged', account: EnkryptAccount): void;
}>();
const isAddAccount = ref(false);
const isRenameAccount = ref(false);
const isDeleteAccount = ref(false);
const isImportAccount = ref(false);
const props = defineProps({
  network: {
    type: Object as PropType<BaseNetwork>,
    default: () => ({}),
  },
  accountInfo: {
    type: Object as PropType<AccountsHeaderData>,
    default: () => ({}),
  },
  showAccounts: Boolean,
  toggle: {
    type: Function,
    default: () => ({}),
  },
});
const accountToRename = ref<EnkryptAccount>();
const accountToDelete = ref<EnkryptAccount>();

const close = () => {
  props.toggle();
};
const selectAccount = (address: string) => {
  for (const acc of props.accountInfo.activeAccounts) {
    if (props.network.displayAddress(acc.address) === address) {
      emit('addressChanged', acc);
      break;
    }
  }
  setTimeout(() => {
    props.toggle();
  }, 100);
};
const addAccountAction = () => {
  props.toggle();

  setTimeout(() => {
    isAddAccount.value = true;
  }, 100);
};

const renameAccount = (accountIdx: number) => {
  accountToRename.value = props.accountInfo.activeAccounts[accountIdx];
  props.toggle();
  setTimeout(() => {
    isRenameAccount.value = true;
  }, 100);
};

const deleteAccount = (accountIdx: number) => {
  accountToDelete.value = props.accountInfo.activeAccounts[accountIdx];
  props.toggle();

  setTimeout(() => {
    isDeleteAccount.value = true;
  }, 100);
};
const importAction = () => {
  props.toggle();

  setTimeout(() => {
    isImportAccount.value = true;
  }, 100);
};

const searchInput = ref('');

const updateSearchInput = (value: string) => {
  searchInput.value = value;
};

function filterAndSortAccounts(accounts: EnkryptAccount[]) {
  const filteredAccounts = accounts.filter(
    account =>
      account.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      account.address.toLowerCase().includes(searchInput.value.toLowerCase()),
  );

  return filteredAccounts.sort((a, b) => {
    const aNameStartsWith = a.name
      .toLowerCase()
      .startsWith(searchInput.value.toLowerCase());
    const bNameStartsWith = b.name
      .toLowerCase()
      .startsWith(searchInput.value.toLowerCase());
    const aAddressStartsWith = a.address
      .toLowerCase()
      .startsWith(searchInput.value.toLowerCase());
    const bAddressStartsWith = b.address
      .toLowerCase()
      .startsWith(searchInput.value.toLowerCase());

    if (aNameStartsWith || aAddressStartsWith) {
      if (!(bNameStartsWith || bAddressStartsWith)) return -1;
    } else if (bNameStartsWith || bAddressStartsWith) {
      return 1;
    }

    const aPrimary = (
      a.name.toLowerCase().startsWith(searchInput.value.toLowerCase())
        ? a.name
        : a.address
    ).toLowerCase();
    const bPrimary = (
      b.name.toLowerCase().startsWith(searchInput.value.toLowerCase())
        ? b.name
        : b.address
    ).toLowerCase();

    return aPrimary.localeCompare(bPrimary);
  });
}

const displayActive = computed(() =>
  filterAndSortAccounts(props.accountInfo.activeAccounts),
);
const displayInactive = computed(() =>
  filterAndSortAccounts(props.accountInfo.inactiveAccounts),
);
</script>
