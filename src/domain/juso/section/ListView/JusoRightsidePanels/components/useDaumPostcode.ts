'use client';

export type DaumPostcodeConstructor = new (config: {
  oncomplete: (data: DaumPostcodeResult) => void;
}) => {
  open: () => void;
};

export type DaumPostcodeResult = {
  address: string;
  buildingName: string;
  apartment: 'Y' | 'N';
  bname: string;
};

declare global {
  interface Window {
    daum?: { Postcode?: DaumPostcodeConstructor };
  }
}

export function useDaumPostcode() {
  const openPostcode = (onComplete: (result: DaumPostcodeResult) => void) => {
    const existing = document.getElementById('daum_postcode_script');
    const ensureScript = () => {
      if (typeof window === 'undefined') return;
      if (window.daum?.Postcode) {
        const Postcode = window.daum.Postcode as DaumPostcodeConstructor;
        const postcode = new Postcode({ oncomplete: onComplete });
        postcode.open();
        return;
      }
    };

    if (existing) {
      ensureScript();
      return;
    }

    const script = document.createElement('script');
    script.id = 'daum_postcode_script';
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => ensureScript();
    document.body.appendChild(script);
  };

  return { openPostcode };
}
