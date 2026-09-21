/**
 * Deterministic species generator.
 * Same base animal + habitat + traits → same species, every time.
 */
import { scoreSpecies } from "./scoring";
import { traitById } from "../data/traits";
import { animalById } from "../data/animals";

const HABITAT_EPITHET = {
  rainforest: "silvestris",
  forest: "nemoralis",
  grasslands: "campestris",
  desert: "arenicola",
  arctic: "borealis",
  mountains: "montana",
  wetlands: "palustris",
};

const EPITHET_MEANING = {
  silvestris: "of the forest",
  nemoralis: "of the woodland",
  campestris: "of the plains",
  arenicola: "sand-dweller",
  borealis: "of the north",
  montana: "of the mountains",
  palustris: "of the marsh",
};

/** Tiny deterministic string hash (FNV-1a). */
export function hashString(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Stable trait ordering so click order never changes the outcome. */
export function orderTraits(traitIds) {
  const order = Object.keys(traitById);
  return [...traitIds].sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

function buildName(animal, habitat, traits) {
  const seed = hashString(`${animal.id}|${habitat.id}|${traits.map((t) => t.id).join(",")}`);
  // Pick which two traits supply the prefix / suffix. Deterministic from seed.
  const i = seed % traits.length;
  const j = (i + 1 + ((seed >>> 3) % (traits.length - 1))) % traits.length;
  const prefix = traits[i].nameParts.prefix;
  const suffix = traits[j].nameParts.suffix;
  const joined = prefix.toLowerCase().endsWith(suffix[0]) ? prefix + suffix.slice(1) : prefix + suffix;
  const compound = joined.charAt(0).toUpperCase() + joined.slice(1);
  return `${compound} ${animal.shortName}`;
}

function paragraphs(animal, habitat, traits, score) {
  const hab = habitat.name.toLowerCase();
  const strong = score.breakdown.traitFits.filter((t) => t.fit >= 1);
  const weak = score.breakdown.traitFits.filter((t) => t.fit <= -1);

  const intro = `Underneath, this is still a ${animal.name} (${animal.scientificName}) — same body, same instincts — with three abilities it never had. ` +
    `On its own, a ${animal.shortName.toLowerCase()} is ${describeFit(score.breakdown.baseFit)} for the ${hab}.`;

  const traitLines = traits.map((t) => {
    const note = t.habitatNotes?.[habitat.id];
    return `${t.name} (from the ${sourceName(t)}): ${t.why}${note ? " " + note : ""}`;
  });

  let synthesis;
  if (strong.length === 3) {
    synthesis = `All three abilities earn their keep in the ${hab}. Together they cover more than any one of them could alone.`;
  } else if (weak.length >= 2) {
    synthesis = `At least two of these abilities fight the ${hab}. Something that is a gift elsewhere becomes dead weight here — that is what is holding the score down.`;
  } else if (weak.length === 1) {
    synthesis = `Most of the set suits the ${hab}, but ${weak[0].name} is the odd one out and drags on the other two.`;
  } else {
    synthesis = `A sensible set for the ${hab}. Nothing clashes, though not every ability adds much here.`;
  }

  const tradeoffs = traits.map((t) => t.tradeoff);
  const energy = score.energyCost >= 6
    ? "All this costs energy. This animal would have to eat a good deal more than an ordinary one just to keep going."
    : score.energyCost >= 4
    ? "These abilities add a moderate energy bill, paid for with extra food."
    : "These abilities are cheap to run, which leaves more energy for growing and raising young.";

  return { intro, traitLines, synthesis, tradeoffs, energy };
}

function describeFit(fit) {
  if (fit >= 2) return "naturally well suited";
  if (fit === 1) return "reasonably suited";
  if (fit === 0) return "neither suited nor unsuited";
  if (fit === -1) return "not naturally suited";
  return "poorly suited";
}


function sourceName(t) { return animalById[t.source]?.name ?? t.source; }

/**
 * @param {object} animal   base animal record
 * @param {object} habitat  habitat record
 * @param {string[]} traitIds exactly three trait ids
 */
export function generateSpecies(animal, habitat, traitIds) {
  const ordered = orderTraits(traitIds);
  const traits = ordered.map((id) => traitById[id]).filter(Boolean);
  const score = scoreSpecies(animal, habitat, traits);
  const epithet = HABITAT_EPITHET[habitat.id] || "adaptiva";

  return {
    id: `${animal.id}-${habitat.id}-${ordered.join("-")}`,
    name: buildName(animal, habitat, traits),
    scientificName: `${animal.genus} ${animal.species} ${epithet}`,
    epithet,
    epithetMeaning: EPITHET_MEANING[epithet],
    baseAnimalId: animal.id,
    habitatId: habitat.id,
    traitIds: ordered,
    traits: traits.map((t) => ({ id: t.id, name: t.name, source: t.source, sourceName: sourceName(t), category: t.category, visualType: t.visualType })),
    stats: score.stats,
    survival: score.survival,
    survivalBand: score.survivalBand,
    breakdown: score.breakdown,
    energyCost: score.energyCost,
    analysis: paragraphs(animal, habitat, traits, score),
    composition: {
      base: animal.id,
      habitat: habitat.id,
      layers: traits.map((t) => ({ trait: t.id, visualType: t.visualType })),
    },
  };
}
