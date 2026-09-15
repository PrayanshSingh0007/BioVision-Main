import { useEffect, useMemo, useRef, useState } from "react";
import HabitatScene from "./HabitatScene";
import { OVERLAY_RENDERERS, LABEL_ANCHOR } from "./traitOverlays";
import { traitById } from "../../data/traits";
import { animalById } from "../../data/animals";
import "./SpeciesComposition.css";

/** Per-animal size tweak so small creatures don't dwarf the scene. */
const FIGURE_SCALE = { chameleon: 0.9, frog: 0.88, squirrel: 0.9, cat: 0.92, eagle: 0.95, koala: 0.92, toucan: 0.9, owl: 0.92, fennec: 0.95, tortoise: 0.95, sloth: 0.9, heron: 0.95 };

/**
 * Deterministic layered composition:
 *   habitat scene → behind overlays → fur halo → base animal → skin layers → front overlays → labels
 *
 * props:
 *  - animal, habitat: records
 *  - traitIds: array of trait ids (any length; report uses exactly 3)
 *  - reveal: stage the appearance (report), otherwise render instantly
 *  - labels: "full" | "compact" | "none"
 *  - animated: animate atmosphere/particles
 */
export default function SpeciesComposition({ animal, habitat, traitIds = [], reveal = false, labels = "full", animated = true, className = "" }) {
  const { w, h } = animal.imageSize;
  const W = 1000, H = Math.round((1000 * h) / w);
  const uid = `cmp-${animal.id}`;
  const headW = animal.headWidth * 10;
  const P = (a) => ({ x: (a.x * W) / 100, y: (a.y * H) / 100 });

  const layers = useMemo(() => {
    const ctx = { P, W, H, headW, facing: animal.facing, anchors: animal.anchors, animal, habitat, uid };
    return traitIds
      .map((id) => traitById[id])
      .filter(Boolean)
      .map((t, i) => {
        const render = OVERLAY_RENDERERS[t.visualType];
        const out = render ? render(ctx, t.visualOptions || {}) : {};
        return { trait: t, index: i, ...out };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal.id, habitat?.id, traitIds.join(",")]);

  const scale = FIGURE_SCALE[animal.id] ?? 1;
  const delay = (i) => (reveal ? `${0.9 + i * 0.55}s` : "0s");
  const halo = layers.some((l) => l.halo);

  // Measure the stage so the figure and callouts can be laid out in pixels (deterministic, no clipping).
  const stageRef = useRef(null);
  const [stage, setStage] = useState({ sw: 1600, sh: 900 });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStage({ sw: el.clientWidth || 1600, sh: el.clientHeight || 900 });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fig = useMemo(() => {
    const { sw, sh } = stage;
    const fh = Math.min(0.6 * sh * scale, 0.62 * sw * (h / w) * scale);
    const fw = (fh * w) / h;
    const left = 0.52 * sw - fw / 2;
    const top = 0.86 * sh - fh;
    return { fw, fh, left, top };
  }, [stage, w, h, scale]);

  const callouts = useMemo(() => buildCallouts(layers, animal, fig, stage, labels), [layers, animal, fig, stage, labels]);

  return (
    <div className={`comp ${reveal ? "comp--reveal" : ""} ${className}`} style={{ "--accent": habitat?.accent || "#22d3ee" }}>
      <HabitatScene habitat={habitat} animated={animated} className="comp__scene" />
      <div className="comp__light" />

      <div className="comp__stage" ref={stageRef}>
        <div className="comp__figure" style={{ left: fig.left, top: fig.top, width: fig.fw, height: fig.fh }}>
          <div className="comp__shadow" />

          {/* behind layer */}
          <svg className="comp__layer comp__layer--behind" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
            <defs>
              <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.45" />
              </filter>
            </defs>
            {layers.map((l) => l.behind && <g key={l.trait.id} className="comp__reveal" style={{ "--d": delay(l.index) }}>{l.behind}</g>)}
          </svg>

          {/* fur halo: the animal's own silhouette, thickened and softened */}
          {halo && (
            <img
              src={animal.image}
              alt=""
              className="comp__halo comp__reveal"
              style={{ "--d": delay(layers.findIndex((l) => l.halo)) }}
              draggable="false"
            />
          )}

          {/* base animal */}
          <img src={animal.image} alt={animal.name} className="comp__base" draggable="false" />

          {/* skin layers masked to the silhouette, blended with the photo */}
          {layers.flatMap((l) => (l.skinLayers || []).map((sl, k) => (
            <div
              key={`skin-${l.trait.id}-${k}`}
              className="comp__skin comp__reveal"
              style={{ "--d": delay(l.index), "--mask": `url(${animal.image})`, mixBlendMode: sl.blend, opacity: sl.opacity }}
            >
              {sl.content}
            </div>
          )))}

          {/* front layer */}
          <svg className="comp__layer comp__layer--front" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
            <defs>
              <filter id={`${uid}-shadow-f`} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000" floodOpacity="0.4" />
              </filter>
            </defs>
            {layers.map((l) => l.front && <g key={l.trait.id} className="comp__reveal" style={{ "--d": delay(l.index) }}>{l.front}</g>)}
          </svg>

        </div>

        {/* callout labels — laid out in stage pixels so they never clip */}
        {labels !== "none" && callouts.length > 0 && (
          <>
            <svg className="comp__leaders" width={stage.sw} height={stage.sh} viewBox={`0 0 ${stage.sw} ${stage.sh}`}>
              {callouts.map((c) => (
                <g key={c.id} className="comp__reveal" style={{ "--d": reveal ? `${2.2 + c.index * 0.35}s` : "0s" }}>
                  <line x1={c.lx} y1={c.ly} x2={c.ax} y2={c.ay} />
                </g>
              ))}
            </svg>
            {callouts.map((c) => (
              <div key={`dot-${c.id}`} className="comp__dot comp__reveal" style={{ left: c.ax, top: c.ay, "--d": reveal ? `${2.2 + c.index * 0.35}s` : "0s" }} />
            ))}
            {callouts.map((c) => (
              <div
                key={`lbl-${c.id}`}
                className={`comp__label comp__label--${c.side} comp__label--${labels} comp__reveal`}
                style={{ left: c.side === "left" ? c.lx : undefined, right: c.side === "right" ? stage.sw - c.lx : undefined, top: c.ly, "--d": reveal ? `${2.2 + c.index * 0.35}s` : "0s" }}
              >
                <strong>{c.name}</strong>
                {labels === "full" && <span>from {c.sourceName}</span>}
              </div>
            ))}
          </>
        )}
      </div>
      <div className="comp__atmo" />
    </div>
  );
}

/** Compute callout positions in stage pixels with simple overlap avoidance. */
function buildCallouts(layers, animal, fig, stage, labels) {
  const pad = labels === "compact" ? 14 : 22;
  const gap = labels === "compact" ? 40 : 58;
  const items = layers.map((l, i) => {
    const key = LABEL_ANCHOR[l.trait.visualType] || "back";
    let a = animal.anchors[key];
    if (Array.isArray(a)) a = a[0];
    const ax = fig.left + (a.x / 100) * fig.fw;
    const ay = fig.top + (a.y / 100) * fig.fh;
    const side = a.x < 50 ? "left" : "right";
    return { id: l.trait.id, index: i, name: l.trait.name, sourceName: animalById[l.trait.source]?.shortName ?? l.trait.source, ax, ay, side };
  });
  const bySide = { left: [], right: [] };
  items.forEach((it) => bySide[it.side].push(it));
  Object.values(bySide).forEach((arr) => {
    arr.sort((p, q) => p.ay - q.ay);
    let lastY = -1e9;
    arr.forEach((it) => {
      let ly = Math.max(pad + 40, Math.min(stage.sh - pad - 40, it.ay));
      if (ly - lastY < gap) ly = lastY + gap;
      it.ly = ly;
      it.lx = it.side === "left" ? pad : stage.sw - pad;
      lastY = ly;
    });
  });
  return items;
}
