const reviewFlag = String(import.meta.env.VITE_CWS_REVIEW_BUILD || '').toLowerCase();

export const IS_CWS_REVIEW_BUILD =
  reviewFlag === 'true' || reviewFlag === '1' || reviewFlag === 'yes';

export const isTelemetryAllowed = (): boolean => !IS_CWS_REVIEW_BUILD;

export const isBackupFeatureAllowed = (): boolean => !IS_CWS_REVIEW_BUILD;

export const isPromoSurfaceAllowed = (): boolean => !IS_CWS_REVIEW_BUILD;
