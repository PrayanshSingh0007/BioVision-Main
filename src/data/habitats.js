/**
 * Habitat library — local, deterministic data.
 * `palette` drives the procedural SVG scene and UI accent.
 * `pressure` (1–5) is an educational "adaptation pressure" indicator.
 */
const habitats = [
  {
    id: "rainforest",
    name: "Rainforest",
    tagline: "Dense canopy, constant rain, fierce competition",
    description:
      "Tropical rainforests are warm and wet all year. Layers of vegetation block light, so sight is limited and camouflage, climbing and hearing matter more than raw speed.",
    climate: "Hot & humid · 25–30 °C · heavy rainfall",
    conditions: ["Dense vegetation", "High rainfall", "Limited visibility", "Intense biodiversity"],
    challenges: ["Finding food among thousands of competing species", "Moving through layered vegetation", "Avoiding ambush predators"],
    pressure: 3,
    accent: "#34d399",
    palette: { skyTop: "#0b2b1e", skyBottom: "#1f5a3a", far: "#123b2a", mid: "#0f3324", near: "#0a2419", ground: "#0b2d1c", light: "#a7f3d0", fog: "#6ee7b7" },
    time: "Filtered daylight",
  },
  {
    id: "forest",
    name: "Forest",
    tagline: "Temperate woodland with changing seasons",
    description:
      "Temperate forests have four distinct seasons. Food is plentiful in summer and scarce in winter, so animals must store energy, hide well and cope with cold.",
    climate: "Mild · −5 to 25 °C · seasonal rainfall",
    conditions: ["Seasonal change", "Mixed tree cover", "Moderate rainfall", "Leaf-litter floor"],
    challenges: ["Surviving winter food shortages", "Hiding from predators in open winter woods", "Climbing or foraging efficiently"],
    pressure: 2,
    accent: "#4ade80",
    palette: { skyTop: "#112a3c", skyBottom: "#6b8f6a", far: "#2c4a3b", mid: "#213b2c", near: "#15291e", ground: "#1c2f1f", light: "#fde68a", fog: "#a3b18a" },
    time: "Golden afternoon",
  },
  {
    id: "grasslands",
    name: "Grasslands",
    tagline: "Open plains where speed and endurance rule",
    description:
      "Grasslands are wide, open and windy with few hiding places. Predators and prey can see each other from far away, so speed, stamina and group awareness decide who survives.",
    climate: "Warm · seasonal drought · strong winds",
    conditions: ["Open terrain", "Few trees", "Seasonal drought", "Wildfires"],
    challenges: ["Nowhere to hide from predators", "Long-distance travel to find water", "Heat and dry seasons"],
    pressure: 3,
    accent: "#fbbf24",
    palette: { skyTop: "#1a2340", skyBottom: "#f0a860", far: "#7a5a3a", mid: "#9a7a3c", near: "#5c4520", ground: "#7d6428", light: "#ffd28a", fog: "#f7c48a" },
    time: "Savanna sunset",
  },
  {
    id: "desert",
    name: "Desert",
    tagline: "Extreme heat, scarce water, wide temperature swings",
    description:
      "Deserts receive very little rain. Days are scorching and nights can be freezing. Animals must conserve water, avoid overheating and travel across open sand to find food.",
    climate: "Arid · 0–45 °C · under 250 mm rain per year",
    conditions: ["Extreme heat", "Scarce water", "Open terrain", "Large day–night temperature changes"],
    challenges: ["Avoiding water loss", "Surviving daytime heat", "Finding food across vast distances"],
    pressure: 5,
    accent: "#fb923c",
    palette: { skyTop: "#2a1a3e", skyBottom: "#f6b26b", far: "#b5713f", mid: "#d08a4d", near: "#a8602e", ground: "#c98a4e", light: "#ffe0b0", fog: "#f3c48f" },
    time: "Late dry-season sun",
  },
  {
    id: "arctic",
    name: "Arctic",
    tagline: "Ice, snow and months of darkness",
    description:
      "The Arctic is frozen for most of the year. Very few plants grow, so energy is precious. Animals need thick insulation, fat reserves and ways to hunt in low light.",
    climate: "Polar · −40 to 10 °C · snow and ice",
    conditions: ["Low temperatures", "Snow and ice", "Limited vegetation", "High energy demands"],
    challenges: ["Staying warm without using too much energy", "Finding food in a barren landscape", "Seeing during long, dark winters"],
    pressure: 5,
    accent: "#7dd3fc",
    palette: { skyTop: "#0a1a3a", skyBottom: "#8fc6ec", far: "#b9d8ef", mid: "#dbeafe", near: "#e8f3ff", ground: "#dce9f7", light: "#cffafe", fog: "#e0f2fe" },
    time: "Polar twilight",
  },
  {
    id: "mountains",
    name: "Mountains",
    tagline: "Thin air, steep cliffs and sudden storms",
    description:
      "High mountains have thin air with less oxygen, steep rocky ground and fast-changing weather. Grip, balance, strong lungs and warm coats are essential.",
    climate: "Cold & windy · thin air · rapid weather changes",
    conditions: ["Steep terrain", "Low oxygen", "Strong winds", "Rocky ground"],
    challenges: ["Climbing and balancing on cliffs", "Breathing in thin air", "Surviving sudden snowstorms"],
    pressure: 4,
    accent: "#a5b4fc",
    palette: { skyTop: "#0f1b3d", skyBottom: "#8aa4d6", far: "#4b5d8f", mid: "#34446e", near: "#243052", ground: "#2b3654", light: "#e0e7ff", fog: "#c7d2fe" },
    time: "Alpine morning",
  },
  {
    id: "wetlands",
    name: "Wetlands",
    tagline: "Water, reeds and mist — a world half-submerged",
    description:
      "Wetlands are shallow, water-covered lands full of reeds, insects and fish. Animals need to move through water, cope with damp conditions and hunt slippery prey.",
    climate: "Humid · 10–30 °C · flooded ground",
    conditions: ["Standing water", "Reeds and marsh plants", "Mist and humidity", "Rich insect life"],
    challenges: ["Moving through water and mud", "Catching fast, small prey", "Staying dry enough to keep warm"],
    pressure: 3,
    accent: "#2dd4bf",
    palette: { skyTop: "#0f2a3a", skyBottom: "#8fd3d0", far: "#2f6b62", mid: "#245a4a", near: "#183f36", ground: "#1c5a56", light: "#ccfbf1", fog: "#99f6e4" },
    time: "Misty dawn",
  },
];

export const habitatById = Object.fromEntries(habitats.map((h) => [h.id, h]));
export default habitats;
