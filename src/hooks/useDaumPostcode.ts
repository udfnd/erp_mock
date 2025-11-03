'use client';

import { useCallback, useRef } from 'react';

type DaumPostcodeResult = {
  address: string;
  roadAddress: string;
  jibunAddress: string;
  zonecode: string;
  buildingName?: string;
};

type OpenDaumPostcodeOptions = {
  onComplete: (result: DaumPostcodeResult) => void;
  onClose?: () => void;
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (config: {
        oncomplete: (data: DaumPostcodeResult) => void;
        onclose?: () => void;
      }) => { open: () => void };
    };
  }
}

const SCRIPT_URL = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export const useDaumPostcode = () => {
  const loaderRef = useRef<Promise<void> | null>(null);

  const ensureScript = useCallback(() => {
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('Daum postcode is not available on the server.'));
    }
    if (window.daum?.Postcode) {
      return Promise.resolve();
    }
    if (!loaderRef.current) {
      loaderRef.current = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = SCRIPT_URL;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Daum postcode script'));
        document.body.appendChild(script);
      });
    }
    return loaderRef.current;
  }, []);

  return useCallback(
    async ({ onComplete, onClose }: OpenDaumPostcodeOptions) => {
      await ensureScript();

      const Postcode = window.daum?.Postcode;
      if (!Postcode) {
        throw new Error('Daum postcode script is unavailable.');
      }

      const postcode = new Postcode({
        oncomplete: onComplete,
        onclose: onClose,
      });

      postcode.open();
    },
    [ensureScript],
  );
};

