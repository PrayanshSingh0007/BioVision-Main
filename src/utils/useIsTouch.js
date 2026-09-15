import { useEffect, useState } from "react";

/** True on coarse-pointer devices without hover (tablets, touch screens). */
export function useIsTouch() {
  const query = "(hover: none) and (pointer: coarse)";
  const [touch, setTouch] = useState(() => { try { return window.matchMedia(query).matches; } catch { return false; } });
  useEffect(() => {
    try {
      const mq = window.matchMedia(query);
      const on = (e) => setTouch(e.matches);
      mq.addEventListener("change", on);
      return () => mq.removeEventListener("change", on);
    } catch { return undefined; }
  }, []);
  return touch;
}

/** Whether the Fullscreen API is available (it is not on iPad Safari). */
export const canFullscreen = () => typeof document !== "undefined" && !!document.documentElement.requestFullscreen;
