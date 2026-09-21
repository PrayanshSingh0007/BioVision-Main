import { useEffect } from "react";

/**
 * Presentation scaling. On very large displays (4K smartboards, 2560-wide monitors) the UI is
 * designed at 1920 px and scaled up proportionally with CSS zoom, so type and controls stay
 * readable from across a classroom. Below ~2200 px nothing changes.
 */
const DESIGN_WIDTH = 1920;
export function useDisplayScale() {
  useEffect(() => {
    const apply = () => {
      const w = window.innerWidth, h = window.innerHeight;
      let scale = 1;
      if (w >= 2200) scale = Math.min(w / DESIGN_WIDTH, h / 1000, 2.6);
      const root = document.documentElement;
      root.style.zoom = scale === 1 ? "" : String(scale);
      root.dataset.scale = scale.toFixed(2);
      // Logical viewport units (zoom-aware, and tracks the real visible height on tablets).
      root.style.setProperty("--vh", `${h / scale / 100}px`);
      root.style.setProperty("--vw", `${w / scale / 100}px`);
    };
    apply();
    // Smartboards and projectors sometimes settle their real size a moment after load, and
    // entering fullscreen changes it again — re-measure on all of those, not just resize.
    const late = setTimeout(apply, 600);
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
    document.addEventListener("fullscreenchange", apply);
    return () => { clearTimeout(late); window.removeEventListener("resize", apply); window.removeEventListener("orientationchange", apply); document.removeEventListener("fullscreenchange", apply); };
  }, []);
}
