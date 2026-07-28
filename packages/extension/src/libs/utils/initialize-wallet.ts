import KeyRing from '@/libs/keyring/keyring';
import EthereumNetworks from '@/providers/ethereum/networks';
import BitcoinNetworks from '@/providers/bitcoin/networks';
import { NetworkNames, WalletType } from '@enkryptcom/types';
import { getAccountsByNetworkName } from '@/libs/utils/accounts';
import BackupState from '../backup-state';

export const initAccounts = async (keyring: KeyRing) => {
  const bitcoinAccounts = (
    await getAccountsByNetworkName(NetworkNames.Bitcoin)
  ).filter(acc => !acc.isTestWallet);

  const ethereumAccounts = (
    await getAccountsByNetworkName(NetworkNames.Ethereum)
  ).filter(acc => !acc.isTestWallet);

  if (ethereumAccounts.length === 0) {
    await keyring.saveNewAccount({
      basePath: EthereumNetworks.ethereum.basePath,
      name: 'EVM Account 1',
      signerType: EthereumNetworks.ethereum.signer[0],
      walletType: WalletType.mnemonic,
    });
  }

  if (bitcoinAccounts.length === 0) {
    await keyring.saveNewAccount({
      basePath: BitcoinNetworks.bitcoin.basePath,
      name: 'Bitcoin Account 1',
      signerType: BitcoinNetworks.bitcoin.signer[0],
      walletType: WalletType.mnemonic,
    });
  }
};

export const onboardInitializeWallets = async (options: {
  mnemonic: string;
  password: string;
  extraWord?: string;
}): Promise<{ backupsFound: boolean }> => {
  const kr = new KeyRing();
  const backupsState = new BackupState();
  const { mnemonic, password, extraWord } = options;
  await kr.init({ mnemonic, password, extraWord });

  try {
    await kr.unlock(password);
    await initAccounts(kr);
    const ethereumAccounts = (
      await getAccountsByNetworkName(NetworkNames.Ethereum)
    ).filter(acc => !acc.isTestWallet);
    let mainAccount = ethereumAccounts.find(
      acc =>
        acc.basePath === EthereumNetworks.ethereum.basePath &&
        acc.signerType === EthereumNetworks.ethereum.signer[0],
    );
    if (!mainAccount) {
      mainAccount = await kr.saveNewAccount({
        basePath: EthereumNetworks.ethereum.basePath,
        name: 'EVM Account 1',
        signerType: EthereumNetworks.ethereum.signer[0],
        walletType: WalletType.mnemonic,
      });
    }

    const sigHash = backupsState.getListBackupMsgHash(mainAccount.publicKey);
    const signature = await kr.sign(sigHash as `0x${string}`, {
      basePath: EthereumNetworks.ethereum.basePath,
      signerType: EthereumNetworks.ethereum.signer[0],
      pathIndex: mainAccount.pathIndex,
      walletType: WalletType.mnemonic,
    });
    const backups = await backupsState.listBackups({
      pubkey: mainAccount.publicKey,
      signature,
    });
    kr.lock();
    return { backupsFound: Array.isArray(backups) && backups.length > 0 };
  } catch (e) {
    console.error(e);
    return { backupsFound: false };
  }
};
