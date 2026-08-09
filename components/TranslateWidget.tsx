"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: {
          new (
            options: { pageLanguage: string; autoDisplay: boolean; layout: unknown },
            containerId: string
          ): unknown;
          InlineLayout: { SIMPLE: unknown };
        };
      };
    };
  }
}

const CONTAINER_ID = "google_translate_element";
let scriptRequested = false;

// Google's free website-translator widget -- no API key, no billing account,
// works entirely client-side. It translates the whole rendered page when a
// language is picked (there's no supported way to scope it to one section),
// which is fine here since it's only mounted on pages that have an Outline.
export default function TranslateWidget() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    window.googleTranslateElementInit = () => {
      if (!window.google) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        CONTAINER_ID
      );
    };

    if (window.google?.translate) {
      window.googleTranslateElementInit();
    } else if (!scriptRequested) {
      scriptRequested = true;
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
        Translate
      </span>
      <div id={CONTAINER_ID} />
    </div>
  );
}
