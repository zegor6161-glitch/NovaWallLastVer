const reviewFlag = String(import.meta.env.VITE_CWS_REVIEW_BUILD || '').toLowerCase();

export const IS_CWS_REVIEW_BUILD =
  reviewFlag === 'true' || reviewFlag === '1' || reviewFlag === 'yes';

// First-party analytics is available in the CWS release only after explicit,
// versioned user consent. The analytics service enforces the consent gate.
export const isTelemetryAllowed = (): boolean => true;

export const isBackupFeatureAllowed = (): boolean => !IS_CWS_REVIEW_BUILD;

// Non-core promo/reward/survey surfaces remain disabled to keep the wallet single-purpose.
export const isPromoSurfaceAllowed = (): boolean => false;
