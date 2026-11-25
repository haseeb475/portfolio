"use client";

import { useEffect, useState } from "react";

/** Live local time for a time zone. Renders a fixed-width placeholder on the server (no layout shift). */
export function LocalTime({ timeZone, className }: { timeZone: string; className?: string }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <time className={className} suppressHydrationWarning>
      <span className="tabular-nums">{now ?? "--:--"}</span>
    </time>
  );
}
