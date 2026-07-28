import { NetworkNames } from '@enkryptcom/types';
import { EvmNetwork, type EvmNetworkOptions } from '@/providers/ethereum/types/evm-network';
import ethIcon from '@/providers/ethereum/networks/icons/eth.webp';
import opIcon from '@/providers/ethereum/networks/icons/op.webp';
import arbIcon from '@/providers/ethereum/networks/icons/arbitrum.webp';
import baseIcon from '@/providers/ethereum/networks/icons/base.webp';
import maticIcon from '@/providers/ethereum/networks/icons/matic.webp';
import zkSyncIcon from '@/providers/ethereum/networks/icons/zksync.webp';
import lineaIcon from '@/providers/ethereum/networks/icons/linea.webp';
import scrollIcon from '@/providers/ethereum/networks/icons/scroll.webp';

const noActivity: EvmNetworkOptions['activityHandler'] = async () => [];

const createNetwork = (options: Omit<EvmNetworkOptions, 'activityHandler'>) =>
  new EvmNetwork({ ...options, activityHandler: noActivity });

const ethereum = createNetwork({
  name: NetworkNames.Ethereum,
  name_long: 'Ethereum',
  homePage: 'https://ethereum.org',
  blockExplorerTX: 'https://etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://etherscan.io/address/[[address]]',
  chainID: '0x1',
  isTestNetwork: false,
  currencyName: 'ETH',
  currencyNameLong: 'Ethereum',
  node: 'https://cloudflare-eth.com',
  icon: ethIcon,
  coingeckoID: 'ethereum',
});

const op = createNetwork({
  name: NetworkNames.Optimism,
  name_long: 'Optimism',
  homePage: 'https://www.optimism.io/',
  blockExplorerTX: 'https://optimistic.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://optimistic.etherscan.io/address/[[address]]',
  chainID: '0xa',
  isTestNetwork: false,
  currencyName: 'ETH',
  currencyNameLong: 'Ethereum',
  node: 'https://mainnet.optimism.io',
  icon: opIcon,
  coingeckoID: 'ethereum',
});

const arbitrum = createNetwork({
  name: NetworkNames.Arbitrum,
  name_long: 'Arbitrum',
  homePage: 'https://arbitrum.io/',
  blockExplorerTX: 'https://arbiscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://arbiscan.io/address/[[address]]',
  chainID: '0xa4b1',
  isTestNetwork: false,
  currencyName: 'ETH',
  currencyNameLong: 'Ethereum',
  node: 'https://arb1.arbitrum.io/rpc',
  icon: arbIcon,
  coingeckoID: 'ethereum',
});

const base = createNetwork({
  name: NetworkNames.Base,
  name_long: 'Base',
  homePage: 'https://base.org',
  blockExplorerTX: 'https://basescan.org/tx/[[txHash]]',
  blockExplorerAddr: 'https://basescan.org/address/[[address]]',
  chainID: '0x2105',
  isTestNetwork: false,
  currencyName: 'ETH',
  currencyNameLong: 'Ethereum',
  node: 'https://mainnet.base.org',
  icon: baseIcon,
  coingeckoID: 'ethereum',
});

const matic = createNetwork({
  name: NetworkNames.Matic,
  name_long: 'Polygon',
  homePage: 'https://polygon.technology/',
  blockExplorerTX: 'https://polygonscan.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://polygonscan.com/address/[[address]]',
  chainID: '0x89',
  isTestNetwork: false,
  currencyName: 'POL',
  currencyNameLong: 'Polygon POL',
  node: 'https://polygon-rpc.com',
  icon: maticIcon,
  coingeckoID: 'polygon-ecosystem-token',
});

const zkSync = createNetwork({
  name: NetworkNames.ZkSync,
  name_long: 'zkSync Era',
  homePage: 'https://zksync.io/',
  blockExplorerTX: 'https://explorer.zksync.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.zksync.io/address/[[address]]',
  chainID: '0x144',
  isTestNetwork: false,
  currencyName: 'ETH',
  currencyNameLong: 'zkSync ETH',
  node: 'https://mainnet.era.zksync.io',
  icon: zkSyncIcon,
  coingeckoID: 'ethereum',
});

const linea = createNetwork({
  name: NetworkNames.Linea,
  name_long: 'Linea',
  homePage: 'https://linea.build/',
  blockExplorerTX: 'https://lineascan.build/tx/[[txHash]]',
  blockExplorerAddr: 'https://lineascan.build/address/[[address]]',
  chainID: '0xe708',
  isTestNetwork: false,
  currencyName: 'ETH',
  currencyNameLong: 'Ethereum',
  node: 'https://rpc.linea.build',
  icon: lineaIcon,
  coingeckoID: 'ethereum',
});

const scroll = createNetwork({
  name: NetworkNames.Scroll,
  name_long: 'Scroll',
  homePage: 'https://scroll.io/',
  blockExplorerTX: 'https://scrollscan.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://scrollscan.com/address/[[address]]',
  chainID: '0x82750',
  isTestNetwork: false,
  currencyName: 'ETH',
  currencyNameLong: 'Scroll ETH',
  node: 'https://rpc.scroll.io',
  icon: scrollIcon,
  coingeckoID: 'ethereum',
});

export default { ethereum, op, arbitrum, base, matic, zkSync, linea, scroll };
