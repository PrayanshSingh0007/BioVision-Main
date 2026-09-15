/**
 * Transparent, educational scoring model.
 * Everything is rounded to whole numbers or bands — no fake precision.
 */
import { STAT_META } from "../data/traits";

export const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

/** Label for a −2 … +2 habitat fit value. */
export function fitLabel(fit) {
  if (fit >= 2) return { label: "Strong fit", tone: "good" };
  if (fit === 1) return { label: "Helpful", tone: "ok" };
  if (fit === 0) return { label: "Neutral", tone: "neutral" };
  if (fit === -1) return { label: "Costly", tone: "warn" };
  return { label: "Poor fit", tone: "bad" };
}

/** Compute the five core stats from base animal + traits. */
export function computeCoreStats(animal, selectedTraits) {
  const stats = { ...animal.stats };
  selectedTraits.forEach((t) => {
    Object.entries(t.stats || {}).forEach(([k, d]) => {
      stats[k] = clamp((stats[k] ?? 50) + d);
    });
  });
  return stats;
}

/** Environmental adaptation score 10–98, from base fit + trait fits. */
export function computeAdaptation(animal, habitat, selectedTraits) {
  const baseFit = animal.habitatFit?.[habitat.id] ?? 0;
  const traitFit = selectedTraits.reduce((s, t) => s + (t.habitatFit?.[habitat.id] ?? 0), 0);
  return clamp(50 + baseFit * 10 + traitFit * 7, 10, 98);
}

/**
 * Full stat set (6 stats) plus survival estimate.
 * Survival = 55 % environmental adaptation + 45 % average of the five core stats,
 * rounded to the nearest 5 to avoid fake precision.
 */
export function scoreSpecies(animal, habitat, selectedTraits) {
  const core = computeCoreStats(animal, selectedTraits);
  const adaptation = computeAdaptation(animal, habitat, selectedTraits);
  const coreAvg = (core.strength + core.speed + core.intelligence + core.stamina + core.camouflage) / 5;
  const survivalRaw = 0.55 * adaptation + 0.45 * coreAvg;
  const survival = clamp(Math.round(survivalRaw / 5) * 5, 10, 95);

  const baseFit = animal.habitatFit?.[habitat.id] ?? 0;
  const traitFits = selectedTraits.map((t) => ({
    id: t.id,
    name: t.name,
    fit: t.habitatFit?.[habitat.id] ?? 0,
    ...fitLabel(t.habitatFit?.[habitat.id] ?? 0),
  }));
  const traitFitTotal = traitFits.reduce((s, t) => s + t.fit, 0);

  return {
    stats: { ...core, adaptation },
    survival,
    survivalBand: survivalBand(survival),
    breakdown: {
      baseFit,
      baseFitLabel: fitLabel(baseFit),
      traitFits,
      traitFitTotal,
      adaptation,
      coreAvg: Math.round(coreAvg),
    },
    energyCost: selectedTraits.reduce((s, t) => s + (t.energyCost || 1), 0),
  };
}

export function survivalBand(v) {
  if (v >= 80) return { label: "Very High", tone: "good" };
  if (v >= 65) return { label: "High", tone: "ok" };
  if (v >= 45) return { label: "Moderate", tone: "neutral" };
  return { label: "Low", tone: "warn" };
}

export function statList(stats) {
  return STAT_META.map((m) => ({ ...m, value: stats[m.key] ?? 0 }));
}
