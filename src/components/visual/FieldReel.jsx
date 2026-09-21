import forest from "../../assets/environments/jungle.webp";
import forest4k from "../../assets/environments/jungle-4k.webp";
import desert from "../../assets/environments/desert.webp";
import desert4k from "../../assets/environments/desert-4k.webp";
import arctic from "../../assets/environments/arctic.webp";
import arctic4k from "../../assets/environments/arctic-4k.webp";
import mountains from "../../assets/environments/mountains.webp";
import mountains4k from "../../assets/environments/mountains-4k.webp";
import wetlands from "../../assets/environments/wetlands.webp";
import wetlands4k from "../../assets/environments/wetlands-4k.webp";
import "./FieldReel.css";

/**
 * Real field-photography plates (see CREDITS.md), cycled while the app boots. The plates already
 * carry their habitat colour grade (baked into the files), and each gets a slightly different
 * drift direction so the camera move never repeats.
 */
const FRAMES = [
  { src: forest, src4k: forest4k, name: "Rainforest", dx: "-0.8%", dy: "0.5%" },
  { src: desert, src4k: desert4k, name: "Desert", dx: "0.7%", dy: "-0.4%" },
  { src: arctic, src4k: arctic4k, name: "Arctic tundra", dx: "-0.5%", dy: "-0.6%" },
  { src: mountains, src4k: mountains4k, name: "Mountains", dx: "0.6%", dy: "0.5%" },
  { src: wetlands, src4k: wetlands4k, name: "Wetlands", dx: "-0.6%", dy: "0.4%" },
];

/**
 * FieldReel — a porthole view that racks focus and drifts through real, colour-graded habitat
 * footage while the app boots, with film grain and a warm lens-flare catch instead of an abstract
 * spinner, so "loading" looks like a camera panning across real terrain.
 */
export default function FieldReel({ index = 0, size = 380 }) {
  const active = Math.min(Math.max(index, 0), FRAMES.length - 1);
  return (
    <div className="reel" style={{ width: size, height: size }}>
      {FRAMES.map((f, i) => (
        <div
          key={f.src}
          className={`reel__frame ${i === active ? "reel__frame--active" : i < active ? "reel__frame--past" : ""}`}
          style={{ "--dx": f.dx, "--dy": f.dy }}
        >
          <img src={f.src} srcSet={`${f.src} 2048w, ${f.src4k} 3840w`} sizes={`${size}px`} alt="" draggable="false" decoding="sync" loading="eager" fetchPriority="high" />
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
