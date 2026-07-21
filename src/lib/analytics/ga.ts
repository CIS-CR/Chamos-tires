type AnalyticsParameters = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackEvent = (eventName: string, parameters: AnalyticsParameters = {}): void => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  try {
    window.gtag('event', eventName, parameters);
  } catch {
    return;
  }
};
