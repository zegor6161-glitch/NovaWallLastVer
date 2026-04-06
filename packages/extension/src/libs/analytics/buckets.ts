const AMOUNT_BUCKETS = [0.01, 0.1, 1, 10, 100, 1000, 10000] as const;
const AMOUNT_BUCKET_LABELS = [
  '0-0.01',
  '0.01-0.1',
  '0.1-1',
  '1-10',
  '10-100',
  '100-1000',
  '1000-10000',
  '10000+',
] as const;

export const bucketizeAmount = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0) return AMOUNT_BUCKET_LABELS[0];
  for (let i = 0; i < AMOUNT_BUCKETS.length; i++) {
    if (value <= AMOUNT_BUCKETS[i]) {
      return AMOUNT_BUCKET_LABELS[i];
    }
  }
  return AMOUNT_BUCKET_LABELS[AMOUNT_BUCKET_LABELS.length - 1];
};

export const bucketizeAccountCount = (count: number): string => {
  if (!Number.isFinite(count) || count <= 1) return '1';
  if (count <= 3) return '2-3';
  if (count <= 10) return '4-10';
  return '10+';
};

export const bucketizeFee = (relativeFee: number): 'low' | 'medium' | 'high' => {
  if (!Number.isFinite(relativeFee) || relativeFee < 0.33) return 'low';
  if (relativeFee < 0.66) return 'medium';
  return 'high';
};
