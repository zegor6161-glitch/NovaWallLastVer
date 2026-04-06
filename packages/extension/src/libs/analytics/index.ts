import SettingsState from '@/libs/settings-state';
import { sanitizeProperties } from './sanitize';
import { AnalyticsTransport } from './transport';
import { ProductAnalyticsEvent, ProductEventType } from './types';

const DEFAULT_ENDPOINT = 'https://analytics-enkrypt.mewwallet.dev/product-events';

class AnalyticsService {
  private settings = new SettingsState();
  private enabled = false;
  private initialized = false;
  private analyticsId = '';
  private transport: AnalyticsTransport | null = null;

  private getEndpoint(): string {
    const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT || DEFAULT_ENDPOINT;
    return endpoint;
  }

  async initAnalytics() {
    if (this.initialized) return;
    const settings = await this.settings.getEnkryptSettings();
    this.enabled = Boolean(settings.isMetricsEnabled);
    this.analyticsId = settings.randomUserID || '';
    const endpoint = this.getEndpoint();
    if (endpoint.startsWith('https://')) {
      this.transport = new AnalyticsTransport(endpoint);
    }
    this.initialized = true;
  }

  async isAnalyticsEnabled(): Promise<boolean> {
    await this.initAnalytics();
    return this.enabled;
  }

  async setAnalyticsEnabled(value: boolean): Promise<void> {
    await this.initAnalytics();
    const settings = await this.settings.getEnkryptSettings();
    settings.isMetricsEnabled = value;
    await this.settings.setEnkryptSettings(settings);
    this.enabled = value;
  }

  async track(event: ProductEventType, properties: Record<string, unknown>) {
    try {
      await this.initAnalytics();
      if (!this.enabled || !this.transport) return;
      const payload: ProductAnalyticsEvent = {
        event,
        properties: {
          platform: 'extension',
          analytics_id: this.analyticsId,
          ...sanitizeProperties(properties),
        },
        timestamp: new Date().toISOString(),
      };
      this.transport.enqueue(payload);
    } catch {
      // analytics must never break UI
    }
  }
}

const analytics = new AnalyticsService();

export const initAnalytics = () => analytics.initAnalytics();
export const isAnalyticsEnabled = () => analytics.isAnalyticsEnabled();
export const setAnalyticsEnabled = (value: boolean) =>
  analytics.setAnalyticsEnabled(value);
export const track = (event: ProductEventType, properties: Record<string, unknown>) =>
  analytics.track(event, properties);

export * from './buckets';
export * from './types';
export { sanitizeProperties } from './sanitize';
