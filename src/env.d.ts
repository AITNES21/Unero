/// <reference path="../.astro/types.d.ts" />

declare global {
  interface Window {
    /** Google Analytics 4 / Consent Mode v2, definido en <head>. */
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export {};
