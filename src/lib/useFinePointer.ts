"use client";

import { useSyncExternalStore } from "react";

const query = "(hover: hover) and (pointer: fine)";

function subscribe(cb: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

/** True on devices with a precise pointer (mouse/trackpad). False during SSR and on touch. */
export function useFinePointer() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
