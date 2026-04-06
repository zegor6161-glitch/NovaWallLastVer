import { describe, it, expect, vi, beforeEach } from 'vitest';
import { bucketizeAccountCount, bucketizeAmount, sanitizeProperties } from './index';
import { track, setAnalyticsEnabled, initAnalytics } from './index';

vi.mock('@/libs/settings-state', () => {
  return {
    default: class {
      async getEnkryptSettings() {
        return {
          installedTimestamp: 0,
          randomUserID: 'rnd-analytics-id',
          isMetricsEnabled: false,
        };
      }
      async setEnkryptSettings() {
        return;
      }
    },
  };
});

describe('analytics buckets', () => {
  it('bucketizes amounts', () => {
    expect(bucketizeAmount(0)).toBe('0-0.01');
    expect(bucketizeAmount(0.5)).toBe('0.1-1');
    expect(bucketizeAmount(10001)).toBe('10000+');
  });

  it('bucketizes account count', () => {
    expect(bucketizeAccountCount(1)).toBe('1');
    expect(bucketizeAccountCount(3)).toBe('2-3');
    expect(bucketizeAccountCount(11)).toBe('10+');
  });
});

describe('analytics privacy', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
  });

  it('strips forbidden fields', () => {
    const sanitized = sanitizeProperties({
      password: 'secret',
      tx_hash: '0xabc',
      amount_bucket: '0.1-1',
      screen: 'send_page',
    });

    expect(sanitized).toEqual({
      amount_bucket: '0.1-1',
      screen: 'send_page',
    });
  });

  it('does not send when disabled', async () => {
    await initAnalytics();
    await setAnalyticsEnabled(false);
    await track('send_started', { screen: 'send_page' });

    expect(fetch).not.toHaveBeenCalled();
  });

  it('sends schema-correct payload when enabled', async () => {
    await initAnalytics();
    await setAnalyticsEnabled(true);
    await track('swap_started', { screen: 'swap_page' });

    expect(fetch).toHaveBeenCalledTimes(1);
    const [, options] = (fetch as any).mock.calls[0];
    const payload = JSON.parse(options.body);
    expect(payload).toMatchObject({
      event: 'swap_started',
      properties: expect.objectContaining({
        platform: 'extension',
        screen: 'swap_page',
      }),
    });
    expect(typeof payload.timestamp).toBe('string');
  });
});
