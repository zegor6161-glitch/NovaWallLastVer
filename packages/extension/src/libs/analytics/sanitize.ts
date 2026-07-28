const FORBIDDEN_KEY_FRAGMENTS = [
  'seed',
  'mnemonic',
  'private',
  'password',
  'pin',
  'signature',
  'rawtx',
  'raw_tx',
  'transaction',
  'wallet_address',
  'address',
  'tx_hash',
  'hash',
  'balance',
  'amount',
  'url',
  'origin',
  'domain',
  'favicon',
  'title',
  'ip',
] as const;

const ALLOWED_EXACT_KEYS = new Set([
  'amount_bucket',
  'amount_usd_bucket',
  'token_in_amount_bucket',
  'account_count_bucket',
  'fee_bucket',
  'signature_type',
  'screen',
  'platform',
  'app_version',
  'consent_version',
  'chain_id',
  'feature',
  'token_in_symbol',
  'token_out_symbol',
  'wallet_type',
  'import_type',
  'unlock_method',
  'network_family',
  'asset_symbol',
  'source',
  'route_type',
  'site_category',
  'connection_type',
]);

const looksLikeSensitiveValue = (value: unknown): boolean => {
  if (typeof value !== 'string') return false;
  if (/^0x[a-fA-F0-9]{16,}$/.test(value)) return true;
  if (value.includes('/') || value.includes('?') || value.includes('@')) return true;
  return false;
};

export const sanitizeProperties = (
  properties: Record<string, unknown>,
): Record<string, unknown> =>
  Object.entries(properties).reduce<Record<string, unknown>>((acc, [key, value]) => {
    const keyLower = key.toLowerCase();
    if (
      !ALLOWED_EXACT_KEYS.has(key) &&
      FORBIDDEN_KEY_FRAGMENTS.some(fragment => keyLower.includes(fragment))
    ) {
      return acc;
    }
    if (value === undefined || value === null || looksLikeSensitiveValue(value)) return acc;
    acc[key] = value;
    return acc;
  }, {});
