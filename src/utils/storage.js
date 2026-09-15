/** Safe localStorage helpers — never throw during a presentation. */
const KEY = "biovision.mission.v1";

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

export function loadMission() {
  const seeded = readSeed();
  if (seeded) return seeded;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function saveMission(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — keep going with in-memory state */
  }
}

export function clearMission() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
