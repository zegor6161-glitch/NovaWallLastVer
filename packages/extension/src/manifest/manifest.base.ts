import packageJson from '../../package.json';

const { version } = packageJson;

export default {
  homepage_url: 'https://terenval.com/',
  version,
  name: 'Terenval Wallet: ETH, BTC and Solana Wallet',
  short_name: 'Terenval',
  description: 'Multi-chain browser wallet for dApp connection and transaction signing',
  permissions: ['storage', 'unlimitedStorage', 'tabs', 'clipboardWrite'],
  action: {
    default_icon: {
      '16': 'assets/img/icons/icon16.png',
      '32': 'assets/img/icons/icon32.png',
      '64': 'assets/img/icons/icon64.png',
      '192': 'assets/img/icons/icon192.png',
    },
    default_title: 'Terenval Wallet',
    default_popup: 'action.html',
  },
  content_scripts: [],
  icons: {
    16: 'assets/img/icons/icon16.png',
    32: 'assets/img/icons/icon32.png',
    64: 'assets/img/icons/icon64.png',
    192: 'assets/img/icons/icon192.png',
  },
};
