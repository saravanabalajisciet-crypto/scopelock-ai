"use client";

import { useSyncExternalStore } from "react";

// Server snapshot returns a static year — client snapshot returns the live year.
// Using useSyncExternalStore avoids Next.js 16's "unstable new Date()" prerender warning.
const SERVER_YEAR = 2025;

function subscribe() {
  return () => {};
}

export default function FooterYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => SERVER_YEAR,
  );
  return <>{year}</>;
}
