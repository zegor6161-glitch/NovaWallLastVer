import { NetworkNames } from '@enkryptcom/types';
import { BaseTokenOptions } from './base-token';

interface BTCIns {
  address: string;
  value: number;
}

interface BTCOuts extends BTCIns {
  pkscript: string;
}

interface BTCRawInfo {
  blockNumber: number;
  transactionHash: string;
  timestamp: number | undefined;
  inputs: BTCIns[];
  outputs: BTCOuts[];
  fee: number;
}

interface EthereumRawInfo {
  blockHash: string;
  blockNumber: string;
  contractAddress: string | null;
  effectiveGasPrice: string;
  from: string;
  to: string | null;
  gas: string;
  gasUsed: string;
  status: boolean;
  transactionHash: string;
  data: string;
  nonce: string;
  value: string;
  timestamp: number | undefined;
}

enum ActivityStatus {
  pending = 'pending',
  success = 'success',
  failed = 'failed',
  dropped = 'dropped',
}

enum ActivityType {
  transaction = 'transaction',
}

interface Activity {
  network: NetworkNames;
  from: string;
  to: string;
  chainId?: string;
  value: string;
  timestamp: number;
  nonce?: string;
  isIncoming: boolean;
  transactionHash: string;
  token: BaseTokenOptions;
  status: ActivityStatus;
  type: ActivityType;
  rawInfo?: EthereumRawInfo | BTCRawInfo;
}

export {
  EthereumRawInfo,
  Activity,
  ActivityStatus,
  ActivityType,
  BTCRawInfo,
};
