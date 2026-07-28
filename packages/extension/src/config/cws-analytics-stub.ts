export const initAnalytics = async (): Promise<void> => undefined;
export const isAnalyticsEnabled = async (): Promise<boolean> => false;
export const setAnalyticsEnabled = async (_value: boolean): Promise<void> => undefined;
export const track = async (
  _event: unknown,
  _properties: Record<string, unknown>,
): Promise<void> => undefined;

export const sanitizeProperties = (
  properties: Record<string, unknown>,
): Record<string, unknown> => ({ ...properties });
