/**
 * Mission progress is intentionally session-only: it lives in memory for as long as the tab is
 * open, and a refresh starts a fresh mission — like walking back into the lab for the first time.
 * The one thing that does persist across a reload is the `?seed=` URL preset below, which is a
 * deliberate demo feature, not saved state.
 */
const OLD_KEY = "biovision.mission.v1";

/**
 * Optional preset via URL, e.g. `#/report?seed=tiger,rainforest,flight,camouflage,night-vision`.
 * Handy for jumping straight to a prepared example during a presentation.
 */
export function readSeed() {
  try {
    const hash = window.location.hash || "";
    const q = hash.includes("?") ? hash.slice(hash.indexOf("?") + 1) : window.location.search.slice(1);
    const seed = new URLSearchParams(q).get("seed");
    if (!seed) return null;
    const [animalId, habitatId, ...traitIds] = seed.split(",").map((s) => s.trim());
    return { animalId: animalId || null, habitatId: habitatId || null, traitIds: traitIds.filter(Boolean), species: null };
  } catch {
    return null;
  }
}

/** Nothing is read back from storage on load — only a `?seed=` preset, if one is present. */
export function loadMission() {
  return readSeed();
}

/** No-op: progress is deliberately not written to storage, so a refresh always starts clean. */
export function saveMission() {}

/** Purges any mission state saved by an older version of the app, so a returning visitor never
 * wakes up mid-mission from a previous visit. */
export function clearMission() {
  try {
    window.localStorage.removeItem(OLD_KEY);
  } catch {
    /* storage unavailable — nothing to clear */
  }
}
