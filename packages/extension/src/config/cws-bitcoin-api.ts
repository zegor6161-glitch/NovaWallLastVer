import type { BTCRawInfo } from '@/types/activity';
import type { HaskoinUnspentType } from '@/providers/bitcoin/types';
import { getAddress } from '@/providers/bitcoin/types/bitcoin-network';
import type { BitcoinNetworkInfo } from '@/providers/bitcoin/types';

const API_ROOT = 'https://mempool.space/api';

export default class CwsBitcoinAPI {
  constructor(
    _node: string,
    private readonly networkInfo: BitcoinNetworkInfo,
  ) {}

  async init(): Promise<void> {}

  private address(pubkey: string): string {
    return pubkey.length < 64 ? pubkey : getAddress(pubkey, this.networkInfo);
  }

  async getBalance(pubkey: string): Promise<string> {
    const response = await fetch(`${API_ROOT}/address/${this.address(pubkey)}`);
    if (!response.ok) return '0';
    const data = await response.json();
    const confirmed = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
    const pending = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;
    return String(confirmed + pending);
  }

  async getUTXOs(pubkey: string): Promise<HaskoinUnspentType[]> {
    const address = this.address(pubkey);
    const response = await fetch(`${API_ROOT}/address/${address}/utxo`);
    if (!response.ok) return [];
    const utxos = await response.json();
    return utxos
      .filter((utxo: any) => Number(utxo.value) > 1000)
      .map((utxo: any) => ({
        address,
        block: {
          height: utxo.status?.block_height ?? 0,
          position: 0,
        },
        txid: utxo.txid,
        index: utxo.vout,
        pkscript: '',
        value: Number(utxo.value),
      }));
  }

  async getRawTransaction(hash: string): Promise<string | null> {
    const response = await fetch(`${API_ROOT}/tx/${hash}/hex`);
    return response.ok ? `0x${await response.text()}` : null;
  }

  async broadcastTx(rawtx: string): Promise<boolean> {
    const response = await fetch(`${API_ROOT}/tx`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: rawtx.replace(/^0x/, ''),
    });
    if (!response.ok) throw new Error(await response.text());
    return true;
  }

  async getTransactionStatus(hash: string): Promise<BTCRawInfo | null> {
    const response = await fetch(`${API_ROOT}/tx/${hash}`);
    if (!response.ok) return null;
    const tx = await response.json();
    if (!tx.status?.confirmed) return null;
    return {
      blockNumber: tx.status.block_height ?? 0,
      transactionHash: tx.txid,
      timestamp: (tx.status.block_time ?? 0) * 1000,
      inputs: (tx.vin ?? []).map((input: any) => ({
        address: input.prevout?.scriptpubkey_address ?? '',
        value: input.prevout?.value ?? 0,
      })),
      outputs: (tx.vout ?? []).map((output: any) => ({
        address: output.scriptpubkey_address ?? '',
        value: output.value ?? 0,
        pkscript: output.scriptpubkey ?? '',
      })),
      fee: tx.fee ?? 0,
    };
  }
}
