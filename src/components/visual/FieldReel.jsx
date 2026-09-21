import { useEffect, useRef } from "react";
import forest from "../../assets/environments/jungle-reel.webp";
import desert from "../../assets/environments/desert-reel.webp";
import arctic from "../../assets/environments/arctic-reel.webp";
import mountains from "../../assets/environments/mountains-reel.webp";
import wetlands from "../../assets/environments/wetlands-reel.webp";
import "./FieldReel.css";

/**
 * Real field-photography plates (see CREDITS.md), cycled while the app boots. These are 1200px
 * square crops of the graded habitat plates — the porthole is only ~400px, and decoding the full
 * 2K/4K plates for it stalled the main thread for ~250ms on every frame change.
 * Each frame gets a slightly different drift direction so the camera move never repeats.
 */
const FRAMES = [
  { src: forest, name: "Rainforest", dx: "-0.8%", dy: "0.5%" },
  { src: desert, name: "Desert", dx: "0.7%", dy: "-0.4%" },
  { src: arctic, name: "Arctic tundra", dx: "-0.5%", dy: "-0.6%" },
  { src: mountains, name: "Mountains", dx: "0.6%", dy: "0.5%" },
  { src: wetlands, name: "Wetlands", dx: "-0.6%", dy: "0.4%" },
];

/**
 * FieldReel — a porthole view that racks focus and drifts through real, colour-graded habitat
 * footage while the app boots, with film grain and a warm lens-flare catch instead of an abstract
 * spinner, so "loading" looks like a camera panning across real terrain.
 */
export default function FieldReel({ index = 0, size = 380 }) {
  const active = Math.min(Math.max(index, 0), FRAMES.length - 1);
  const root = useRef(null);
  // Decode every frame up front, off the main thread, so each crossfade starts with a ready bitmap
  // (an undecoded frame under an in-progress opacity transition is what showed as a black flash).
  useEffect(() => {
    root.current?.querySelectorAll("img").forEach((img) => { img.decode?.().catch(() => {}); });
  }, []);
  return (
    <div className="reel" ref={root} style={{ width: size, height: size }}>
      {FRAMES.map((f, i) => (
        <div
          key={f.src}
          className={`reel__frame ${i === active ? "reel__frame--active" : i < active ? "reel__frame--past" : ""}`}
          style={{ "--dx": f.dx, "--dy": f.dy }}
        >
          <img src={f.src} alt="" draggable="false" decoding="async" loading="eager" fetchPriority="high" />
        </div>
      ))}
      <div className="reel__grain" />
      <div className="reel__flare" />
      <div className="reel__vignette" />
      <div className="reel__caption">
        <span key={FRAMES[active].name}>{FRAMES[active].name}</span>
      </div>
    </div>
  );
}
