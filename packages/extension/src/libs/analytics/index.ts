import SettingsState from '@/libs/settings-state';
import { sanitizeProperties } from './sanitize';
import { AnalyticsTransport } from './transport';
import { ProductAnalyticsEvent, ProductEventType } from './types';
import { isTelemetryAllowed } from '@/configs/review-build';

export const ANALYTICS_CONSENT_VERSION = 1;
const DEFAULT_ENDPOINT = 'https://analytics.terenval.com/product-events';
const ONE_HOUR_MS = 60 * 60 * 1000;

const getRoundedTimestamp = (): string =>
  new Date(Math.floor(Date.now() / ONE_HOUR_MS) * ONE_HOUR_MS).toISOString();

const isApprovedEndpoint = (endpoint: string): boolean => {
  try {
    const url = new URL(endpoint);
    const isLocalDevelopment =
      import.meta.env.DEV && ['localhost', '127.0.0.1'].includes(url.hostname);
    const isTerenvalEndpoint =
      url.hostname === 'terenval.com' || url.hostname.endsWith('.terenval.com');
    return (url.protocol === 'https:' && isTerenvalEndpoint) || isLocalDevelopment;
  } catch {
    return false;
  }
};

class AnalyticsService {
  private settings = new SettingsState();
  private enabled = false;
  private initialized = false;
  private transport: AnalyticsTransport | null = null;

  private getEndpoint(): string {
    if (!isTelemetryAllowed()) return '';
    const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT || DEFAULT_ENDPOINT;
    return isApprovedEndpoint(endpoint) ? endpoint : '';
  }

  async initAnalytics() {
    if (this.initialized) return;
    const settings = await this.settings.getEnkryptSettings();
    this.enabled =
      isTelemetryAllowed() &&
      settings.isMetricsEnabled === true &&
      settings.analyticsConsentVersion === ANALYTICS_CONSENT_VERSION;
    const endpoint = this.getEndpoint();
    if (endpoint) this.transport = new AnalyticsTransport(endpoint);
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
    settings.analyticsConsentVersion = ANALYTICS_CONSENT_VERSION;
    settings.analyticsConsentTimestamp = Date.now();
    await this.settings.setEnkryptSettings(settings);
    this.enabled = isTelemetryAllowed() && value;
  }

  async track(event: ProductEventType, properties: Record<string, unknown>) {
    try {
      await this.initAnalytics();
      if (!this.enabled || !this.transport) return;
      const payload: ProductAnalyticsEvent = {
        event,
        properties: {
          platform: 'extension',
          app_version: __PACKAGE_VERSION__,
          consent_version: ANALYTICS_CONSENT_VERSION,
          ...sanitizeProperties(properties),
        },
        timestamp: getRoundedTimestamp(),
      };
      this.transport.enqueue(payload);
    } catch {
      // Analytics must never break wallet functionality.
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
