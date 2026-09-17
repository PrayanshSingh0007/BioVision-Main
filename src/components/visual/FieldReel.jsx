import forest from "../../assets/environments/jungle.webp";
import desert from "../../assets/environments/desert.webp";
import arctic from "../../assets/environments/arctic.webp";
import mountains from "../../assets/environments/mountains.webp";
import wetlands from "../../assets/environments/wetlands.webp";
import "./FieldReel.css";

/** Real field-photography plates (see CREDITS.md), cycled while the app boots. */
const FRAMES = [
  { src: forest, name: "Rainforest" },
  { src: desert, name: "Desert" },
  { src: arctic, name: "Arctic tundra" },
  { src: mountains, name: "Mountains" },
  { src: wetlands, name: "Wetlands" },
];

/**
 * FieldReel — a porthole view that cross-fades and slowly zooms through real habitat photography.
 * Used on the Boot screen so "loading" looks like a camera focusing through field footage rather
 * than an abstract spinner.
 */
export default function FieldReel({ index = 0, size = 380 }) {
  const active = Math.min(Math.max(index, 0), FRAMES.length - 1);
  return (
    <div className="reel" style={{ width: size, height: size }}>
      {FRAMES.map((f, i) => (
        <div key={f.src} className={`reel__frame ${i === active ? "reel__frame--active" : i < active ? "reel__frame--past" : ""}`}>
          <img src={f.src} alt="" draggable="false" decoding="async" />
        </div>
      ))}
      <div className="reel__vignette" />
      <div className="reel__caption">
        <span key={FRAMES[active].name}>{FRAMES[active].name}</span>
      </div>
    </div>
  );
}
