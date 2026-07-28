import { NetworkNames } from '@enkryptcom/types';
import { BitcoinNetwork, PaymentType } from '@/providers/bitcoin/types/bitcoin-network';
import BTCFeeHandler from '@/providers/bitcoin/libs/btc-fee-handler';
import CwsBitcoinAPI from './cws-bitcoin-api';
import icon from '@/providers/bitcoin/networks/icons/btc.webp';

const bitcoin = new BitcoinNetwork({
  name: NetworkNames.Bitcoin,
  name_long: 'Bitcoin',
  homePage: 'https://bitcoin.org/',
  blockExplorerTX: 'https://mempool.space/tx/[[txHash]]',
  blockExplorerAddr: 'https://mempool.space/address/[[address]]',
  isTestNetwork: false,
  currencyName: 'BTC',
  currencyNameLong: 'Bitcoin',
  icon,
  decimals: 8,
  node: 'https://mempool.space/api/',
  coingeckoID: 'bitcoin',
  activityHandler: async () => [],
  basePath: "m/49'/0'/0'/0",
  feeHandler: BTCFeeHandler,
  apiType: CwsBitcoinAPI as any,
  dust: 0.00000546,
  networkInfo: {
    name: NetworkNames.Bitcoin,
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: { public: 0x0488b21e, private: 0x0488ade4 },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    dustThreshold: null,
    paymentType: PaymentType.P2WPKH,
    maxFeeRate: 5000,
  },
});

export default { bitcoin };
