export const PRODUCT_EVENT_TYPES = [
  'wallet_created',
  'wallet_imported',
  'wallet_unlocked',
  'account_added',
  'network_switched',
  'send_started',
  'send_submitted',
  'swap_started',
  'swap_submitted',
  'token_imported',
  'dapp_connection_approved',
  'signature_request_approved',
  'signature_request_rejected',
] as const;

export type ProductEventType = (typeof PRODUCT_EVENT_TYPES)[number];

export type ProductAnalyticsEvent = {
  event: ProductEventType;
  properties: Record<string, unknown>;
  timestamp: string;
};
