/**
 * Animal library — 37 animals across seven habitats.
 *
 * `thumb` is a 240px copy of `image` for chips and lists — decoding the 2200px cut-outs for 40px
 * thumbnails was most of the Lab and Species pages' jank.
 * `anchors` are anatomical reference points (% of the image box) used by the trait
 * composition system; `facing` is "left" (side view) or "front". `habitatFit` (−2…+2) is an
 * educational estimate of how well the animal's own biology suits each habitat.
 * Images: real photographs cut out from their backgrounds (see CREDITS.md).
 */
import img_tiger from "../assets/animals/tiger.webp";
import img_cat from "../assets/animals/cat.webp";
import img_chameleon from "../assets/animals/chameleon.webp";
import img_deer from "../assets/animals/deer.webp";
import img_eagle from "../assets/animals/eagle.webp";
import img_frog from "../assets/animals/frog.webp";
import img_kangaroo from "../assets/animals/kangaroo.webp";
import img_koala from "../assets/animals/koala.webp";
import img_panda from "../assets/animals/panda.webp";
import img_polar_bear from "../assets/animals/polar-bear.webp";
import img_squirrel from "../assets/animals/squirrel.webp";
import img_wolf from "../assets/animals/wolf.webp";
import img_jaguar from "../assets/animals/jaguar.webp";
import img_sloth from "../assets/animals/sloth.webp";
import img_toucan from "../assets/animals/toucan.webp";
import img_red_fox from "../assets/animals/red-fox.webp";
import img_brown_bear from "../assets/animals/brown-bear.webp";
import img_owl from "../assets/animals/owl.webp";
import img_lion from "../assets/animals/lion.webp";
import img_cheetah from "../assets/animals/cheetah.webp";
import img_elephant from "../assets/animals/elephant.webp";
import img_giraffe from "../assets/animals/giraffe.webp";
import img_fennec_fox from "../assets/animals/fennec-fox.webp";
import img_camel from "../assets/animals/camel.webp";
import img_tortoise from "../assets/animals/tortoise.webp";
import img_arctic_fox from "../assets/animals/arctic-fox.webp";
import img_penguin from "../assets/animals/penguin.webp";
import img_reindeer from "../assets/animals/reindeer.webp";
import img_snow_leopard from "../assets/animals/snow-leopard.webp";
import img_mountain_goat from "../assets/animals/mountain-goat.webp";
import img_yak from "../assets/animals/yak.webp";
import img_ibex from "../assets/animals/ibex.webp";
import img_crocodile from "../assets/animals/crocodile.webp";
import img_flamingo from "../assets/animals/flamingo.webp";
import img_hippo from "../assets/animals/hippo.webp";
import img_heron from "../assets/animals/heron.webp";
import img_capybara from "../assets/animals/capybara.webp";
import th_tiger from "../assets/animals/thumbs/tiger.webp";
import th_cat from "../assets/animals/thumbs/cat.webp";
import th_chameleon from "../assets/animals/thumbs/chameleon.webp";
import th_deer from "../assets/animals/thumbs/deer.webp";
import th_eagle from "../assets/animals/thumbs/eagle.webp";
import th_frog from "../assets/animals/thumbs/frog.webp";
import th_kangaroo from "../assets/animals/thumbs/kangaroo.webp";
import th_koala from "../assets/animals/thumbs/koala.webp";
import th_panda from "../assets/animals/thumbs/panda.webp";
import th_polar_bear from "../assets/animals/thumbs/polar-bear.webp";
import th_squirrel from "../assets/animals/thumbs/squirrel.webp";
import th_wolf from "../assets/animals/thumbs/wolf.webp";
import th_jaguar from "../assets/animals/thumbs/jaguar.webp";
import th_sloth from "../assets/animals/thumbs/sloth.webp";
import th_toucan from "../assets/animals/thumbs/toucan.webp";
import th_red_fox from "../assets/animals/thumbs/red-fox.webp";
import th_brown_bear from "../assets/animals/thumbs/brown-bear.webp";
import th_owl from "../assets/animals/thumbs/owl.webp";
import th_lion from "../assets/animals/thumbs/lion.webp";
import th_cheetah from "../assets/animals/thumbs/cheetah.webp";
import th_elephant from "../assets/animals/thumbs/elephant.webp";
import th_giraffe from "../assets/animals/thumbs/giraffe.webp";
import th_fennec_fox from "../assets/animals/thumbs/fennec-fox.webp";
import th_camel from "../assets/animals/thumbs/camel.webp";
import th_tortoise from "../assets/animals/thumbs/tortoise.webp";
import th_arctic_fox from "../assets/animals/thumbs/arctic-fox.webp";
import th_penguin from "../assets/animals/thumbs/penguin.webp";
import th_reindeer from "../assets/animals/thumbs/reindeer.webp";
import th_snow_leopard from "../assets/animals/thumbs/snow-leopard.webp";
import th_mountain_goat from "../assets/animals/thumbs/mountain-goat.webp";
import th_yak from "../assets/animals/thumbs/yak.webp";
import th_ibex from "../assets/animals/thumbs/ibex.webp";
import th_crocodile from "../assets/animals/thumbs/crocodile.webp";
import th_flamingo from "../assets/animals/thumbs/flamingo.webp";
import th_hippo from "../assets/animals/thumbs/hippo.webp";
import th_heron from "../assets/animals/thumbs/heron.webp";
import th_capybara from "../assets/animals/thumbs/capybara.webp";

const animals = [
  {
    id: "tiger", name: "Bengal Tiger", shortName: "Tiger", scientificName: "Panthera tigris", genus: "Panthera", species: "tigris",
    image: img_tiger, thumb: th_tiger, imageSize: { w: 2200, h: 1092 }, naturalHabitat: "rainforest",
    description: "A solitary apex predator whose striped coat breaks up its outline in tall grass and dappled forest light.",
    traits: ["Striped camouflage", "Powerful jaws", "Retractable claws", "Night hunting"],
    stats: { strength: 95, speed: 80, intelligence: 70, stamina: 72, camouflage: 82 },
    habitatFit: { rainforest: 2, forest: 1, grasslands: 1, desert: -1, arctic: -2, mountains: 0, wetlands: 1 },
    facing: "left", headWidth: 17,
    anchors: {
      headTop: { x: 9, y: 12 }, eyeL: { x: 2.5, y: 32 }, eyeR: { x: 8, y: 32 }, nose: { x: 4, y: 46 }, mouth: { x: 5, y: 52 },
      back: { x: 44, y: 10 }, hips: { x: 69, y: 22 }, rear: { x: 93, y: 45 }, chest: { x: 18, y: 60 },
      frontFeet: [{ x: 18, y: 95 }, { x: 28, y: 92 }], hindFeet: [{ x: 60, y: 88 }, { x: 69, y: 92 }],
    },
  },
  {
    id: "cat", name: "Domestic Cat", shortName: "Cat", scientificName: "Felis catus", genus: "Felis", species: "catus",
    image: img_cat, thumb: th_cat, imageSize: { w: 2200, h: 1310 }, naturalHabitat: "forest",
    description: "A small, agile hunter with sensitive whiskers, sharp reflexes and excellent low-light vision.",
    traits: ["Whiskers", "Fast reflexes", "Flexible spine", "Low-light vision"],
    stats: { strength: 35, speed: 70, intelligence: 68, stamina: 55, camouflage: 55 },
    habitatFit: { rainforest: 0, forest: 1, grasslands: 1, desert: 0, arctic: -2, mountains: 0, wetlands: -1 },
    facing: "left", headWidth: 22,
    anchors: {
      headTop: { x: 9, y: 20 }, eyeL: { x: 6.5, y: 40 }, eyeR: { x: 14, y: 40 }, nose: { x: 9, y: 50 }, mouth: { x: 10, y: 54 },
      back: { x: 40, y: 12 }, hips: { x: 65, y: 25 }, rear: { x: 78, y: 26 }, chest: { x: 25, y: 50 },
      frontFeet: [{ x: 22, y: 97 }, { x: 28, y: 96 }], hindFeet: [{ x: 48, y: 72 }, { x: 58, y: 74 }],
    },
  },
  {
    id: "chameleon", name: "Chameleon", shortName: "Chameleon", scientificName: "Chamaeleo calyptratus", genus: "Chamaeleo", species: "calyptratus",
    image: img_chameleon, thumb: th_chameleon, imageSize: { w: 2200, h: 1001 }, naturalHabitat: "rainforest",
    description: "A slow, patient reptile that changes colour to communicate and blend in, and catches insects with a lightning-fast tongue.",
    traits: ["Colour-changing skin", "Independent eyes", "Projectile tongue", "Gripping feet"],
    stats: { strength: 20, speed: 25, intelligence: 40, stamina: 35, camouflage: 98 },
    habitatFit: { rainforest: 2, forest: 1, grasslands: 0, desert: 0, arctic: -2, mountains: -1, wetlands: 1 },
    facing: "right", headWidth: 22,
    anchors: {
      headTop: { x: 86, y: 16 }, eyeL: { x: 93, y: 52 }, eyeR: { x: 89, y: 50 }, nose: { x: 99, y: 62 }, mouth: { x: 96, y: 68 },
      back: { x: 55, y: 9 }, hips: { x: 30, y: 42 }, rear: { x: 12, y: 40 }, chest: { x: 72, y: 70 },
      frontFeet: [{ x: 72, y: 95 }, { x: 78, y: 92 }], hindFeet: [{ x: 50, y: 95 }],
    },
  },
  {
    id: "deer", name: "Deer", shortName: "Deer", scientificName: "Cervus elaphus", genus: "Cervus", species: "elaphus",
    image: img_deer, thumb: th_deer, imageSize: { w: 2185, h: 1676 }, naturalHabitat: "forest",
    description: "A fast, alert herbivore with large ears, long legs for bounding escape and antlers used in display and defence.",
    traits: ["Antlers", "Acute hearing", "Bounding gait", "Herbivore digestion"],
    stats: { strength: 55, speed: 85, intelligence: 50, stamina: 78, camouflage: 60 },
    habitatFit: { rainforest: 0, forest: 2, grasslands: 1, desert: -1, arctic: -1, mountains: 1, wetlands: 0 },
    facing: "left", headWidth: 20,
    anchors: {
      headTop: { x: 12, y: 12 }, eyeL: { x: 12, y: 22 }, eyeR: { x: 16, y: 20 }, nose: { x: 2, y: 30 }, mouth: { x: 4, y: 34 },
      back: { x: 45, y: 30 }, hips: { x: 78, y: 36 }, rear: { x: 88, y: 42 }, chest: { x: 22, y: 45 },
      frontFeet: [{ x: 38, y: 97 }, { x: 30, y: 92 }], hindFeet: [{ x: 73, y: 96 }, { x: 94, y: 98 }],
    },
  },
  {
    id: "eagle", name: "Eagle", shortName: "Eagle", scientificName: "Haliaeetus leucocephalus", genus: "Haliaeetus", species: "leucocephalus",
    image: img_eagle, thumb: th_eagle, imageSize: { w: 1892, h: 1688 }, naturalHabitat: "mountains",
    description: "A powerful bird of prey with broad wings for soaring, eyesight several times sharper than a human's, and crushing talons.",
    traits: ["Flight", "Keen eyesight", "Sharp talons", "Hooked beak"],
    stats: { strength: 60, speed: 92, intelligence: 62, stamina: 70, camouflage: 40 },
    habitatFit: { rainforest: 0, forest: 1, grasslands: 1, desert: 0, arctic: 0, mountains: 2, wetlands: 1 },
    facing: "left", headWidth: 16,
    anchors: {
      headTop: { x: 30, y: 76 }, eyeL: { x: 27, y: 79 }, eyeR: { x: 31, y: 78 }, nose: { x: 22, y: 84 }, mouth: { x: 24, y: 83 },
      back: { x: 48, y: 72 }, hips: { x: 60, y: 86 }, rear: { x: 70, y: 90 }, chest: { x: 40, y: 86 },
      frontFeet: [{ x: 54, y: 95 }], hindFeet: [{ x: 56, y: 96 }],
    },
  },
  {
    id: "frog", name: "Frog", shortName: "Frog", scientificName: "Hyla cinerea", genus: "Hyla", species: "cinerea",
    image: img_frog, thumb: th_frog, imageSize: { w: 1777, h: 1568 }, naturalHabitat: "wetlands",
    description: "An amphibian that breathes partly through its moist skin, leaps with powerful legs and snatches insects with a sticky tongue.",
    traits: ["Sticky tongue", "Webbed feet", "Skin breathing", "Explosive jump"],
    stats: { strength: 20, speed: 45, intelligence: 30, stamina: 40, camouflage: 75 },
    habitatFit: { rainforest: 2, forest: 1, grasslands: -1, desert: -2, arctic: -2, mountains: -1, wetlands: 2 },
    facing: "front", headWidth: 62,
    anchors: {
      headTop: { x: 52, y: 2 }, eyeL: { x: 38, y: 12 }, eyeR: { x: 80, y: 20 }, nose: { x: 52, y: 32 }, mouth: { x: 52, y: 42 },
      back: { x: 52, y: 8 }, hips: { x: 75, y: 55 }, rear: { x: 90, y: 70 }, chest: { x: 52, y: 60 },
      frontFeet: [{ x: 15, y: 92 }, { x: 80, y: 92 }], hindFeet: [{ x: 5, y: 88 }, { x: 95, y: 88 }],
    },
  },
  {
    id: "kangaroo", name: "Kangaroo", shortName: "Kangaroo", scientificName: "Macropus rufus", genus: "Macropus", species: "rufus",
    image: img_kangaroo, thumb: th_kangaroo, imageSize: { w: 2091, h: 2200 }, naturalHabitat: "grasslands",
    description: "A marsupial built for efficient hopping across open country, with a heavy tail for balance and a pouch for raising young.",
    traits: ["Powerful hind legs", "Balancing tail", "Pouch", "Water-efficient body"],
    stats: { strength: 70, speed: 82, intelligence: 45, stamina: 88, camouflage: 50 },
    habitatFit: { rainforest: -1, forest: 0, grasslands: 2, desert: 1, arctic: -2, mountains: -1, wetlands: -1 },
    facing: "left", headWidth: 16,
    anchors: {
      headTop: { x: 6, y: 2 }, eyeL: { x: 3, y: 12 }, eyeR: { x: 10, y: 12 }, nose: { x: 6, y: 20 }, mouth: { x: 6, y: 24 },
      back: { x: 35, y: 25 }, hips: { x: 75, y: 45 }, rear: { x: 88, y: 50 }, chest: { x: 20, y: 40 },
      frontFeet: [{ x: 22, y: 66 }, { x: 25, y: 68 }], hindFeet: [{ x: 45, y: 95 }, { x: 60, y: 95 }],
    },
  },
  {
    id: "koala", name: "Koala", shortName: "Koala", scientificName: "Phascolarctos cinereus", genus: "Phascolarctos", species: "cinereus",
    image: img_koala, thumb: th_koala, imageSize: { w: 1749, h: 1873 }, naturalHabitat: "forest",
    description: "A tree-dwelling marsupial with strong gripping claws, dense fur and a slow metabolism suited to a diet of eucalyptus leaves.",
    traits: ["Climbing claws", "Dense fur", "Slow metabolism", "Leaf digestion"],
    stats: { strength: 40, speed: 20, intelligence: 35, stamina: 45, camouflage: 55 },
    habitatFit: { rainforest: 1, forest: 2, grasslands: -1, desert: -1, arctic: -2, mountains: 0, wetlands: -1 },
    facing: "front", headWidth: 58,
    anchors: {
      headTop: { x: 55, y: 4 }, eyeL: { x: 50, y: 30 }, eyeR: { x: 72, y: 31 }, nose: { x: 62, y: 38 }, mouth: { x: 62, y: 47 },
      back: { x: 52, y: 10 }, hips: { x: 50, y: 60 }, rear: { x: 15, y: 75 }, chest: { x: 50, y: 58 },
      frontFeet: [{ x: 35, y: 90 }, { x: 60, y: 95 }], hindFeet: [{ x: 5, y: 92 }],
    },
  },
  {
    id: "panda", name: "Giant Panda", shortName: "Panda", scientificName: "Ailuropoda melanoleuca", genus: "Ailuropoda", species: "melanoleuca",
    image: img_panda, thumb: th_panda, imageSize: { w: 2200, h: 1421 }, naturalHabitat: "mountains",
    description: "A mountain bear with powerful crushing jaws and an extra wrist bone that works like a thumb for gripping bamboo.",
    traits: ["Pseudo-thumb", "Crushing molars", "Thick coat", "Bamboo diet"],
    stats: { strength: 78, speed: 30, intelligence: 50, stamina: 50, camouflage: 45 },
    habitatFit: { rainforest: 0, forest: 2, grasslands: -1, desert: -2, arctic: -1, mountains: 2, wetlands: -1 },
    facing: "left", headWidth: 22,
    anchors: {
      headTop: { x: 12, y: 5 }, eyeL: { x: 5, y: 22 }, eyeR: { x: 11, y: 20 }, nose: { x: 2, y: 32 }, mouth: { x: 3, y: 36 },
      back: { x: 50, y: 5 }, hips: { x: 80, y: 30 }, rear: { x: 96, y: 55 }, chest: { x: 25, y: 60 },
      frontFeet: [{ x: 20, y: 88 }, { x: 30, y: 95 }], hindFeet: [{ x: 70, y: 92 }, { x: 80, y: 95 }],
    },
  },
  {
    id: "polar-bear", name: "Polar Bear", shortName: "Polar Bear", scientificName: "Ursus maritimus", genus: "Ursus", species: "maritimus",
    image: img_polar_bear, thumb: th_polar_bear, imageSize: { w: 1847, h: 1340 }, naturalHabitat: "arctic",
    description: "The largest land carnivore, insulated by thick fur and fat, with wide paws for walking on snow and swimming between ice floes.",
    traits: ["Thick fur", "Fat insulation", "Wide paws", "Strong swimmer"],
    stats: { strength: 98, speed: 55, intelligence: 60, stamina: 80, camouflage: 70 },
    habitatFit: { rainforest: -2, forest: -1, grasslands: -2, desert: -2, arctic: 2, mountains: 1, wetlands: 0 },
    facing: "left", headWidth: 26,
    anchors: {
      headTop: { x: 15, y: 10 }, eyeL: { x: 10, y: 22 }, eyeR: { x: 16, y: 20 }, nose: { x: 3, y: 30 }, mouth: { x: 5, y: 36 },
      back: { x: 55, y: 3 }, hips: { x: 85, y: 15 }, rear: { x: 97, y: 40 }, chest: { x: 35, y: 55 },
      frontFeet: [{ x: 33, y: 88 }, { x: 43, y: 97 }], hindFeet: [{ x: 65, y: 88 }, { x: 78, y: 86 }],
    },
  },
  {
    id: "squirrel", name: "Squirrel", shortName: "Squirrel", scientificName: "Sciurus vulgaris", genus: "Sciurus", species: "vulgaris",
    image: img_squirrel, thumb: th_squirrel, imageSize: { w: 1209, h: 1100 }, naturalHabitat: "forest",
    description: "A quick, agile rodent that climbs, leaps and balances with its bushy tail, and stores food to survive the winter.",
    traits: ["Bushy tail", "Climbing agility", "Food caching", "Gnawing teeth"],
    stats: { strength: 15, speed: 75, intelligence: 60, stamina: 50, camouflage: 60 },
    habitatFit: { rainforest: 1, forest: 2, grasslands: 0, desert: -1, arctic: -1, mountains: 1, wetlands: 0 },
    facing: "left", headWidth: 26,
    anchors: {
      headTop: { x: 22, y: 8 }, eyeL: { x: 17, y: 35 }, eyeR: { x: 22, y: 32 }, nose: { x: 8, y: 40 }, mouth: { x: 10, y: 44 },
      back: { x: 55, y: 45 }, hips: { x: 55, y: 60 }, rear: { x: 85, y: 40 }, chest: { x: 25, y: 55 },
      frontFeet: [{ x: 15, y: 50 }, { x: 30, y: 80 }], hindFeet: [{ x: 25, y: 85 }, { x: 35, y: 88 }],
    },
  },
  {
    id: "wolf", name: "Gray Wolf", shortName: "Wolf", scientificName: "Canis lupus", genus: "Canis", species: "lupus",
    image: img_wolf, thumb: th_wolf, imageSize: { w: 2005, h: 2200 }, naturalHabitat: "forest",
    description: "A social pack hunter with tremendous stamina, keen night vision and a sense of smell thousands of times sharper than ours.",
    traits: ["Night vision", "Pack cooperation", "Endurance running", "Powerful bite"],
    stats: { strength: 72, speed: 78, intelligence: 82, stamina: 92, camouflage: 62 },
    habitatFit: { rainforest: -1, forest: 2, grasslands: 1, desert: -1, arctic: 1, mountains: 1, wetlands: 0 },
    facing: "front", headWidth: 30,
    anchors: {
      headTop: { x: 72, y: 3 }, eyeL: { x: 65, y: 20 }, eyeR: { x: 80, y: 19 }, nose: { x: 75, y: 33 }, mouth: { x: 75, y: 38 },
      back: { x: 40, y: 10 }, hips: { x: 30, y: 40 }, rear: { x: 8, y: 60 }, chest: { x: 70, y: 55 },
      frontFeet: [{ x: 58, y: 97 }, { x: 78, y: 97 }], hindFeet: [{ x: 10, y: 95 }, { x: 30, y: 95 }],
    },
  },
  {
    id: "jaguar", name: "Jaguar", shortName: "Jaguar", scientificName: "Panthera onca", genus: "Panthera", species: "onca",
    image: img_jaguar, thumb: th_jaguar, imageSize: { w: 1456, h: 1982 }, naturalHabitat: "rainforest",
    description: "The Americas' largest cat: a stocky, powerful swimmer and climber whose rosette-spotted coat vanishes in dappled forest light.",
    traits: ["Spotted coat", "Strong swimmer", "Skull-crushing bite", "Stealth"],
    stats: { strength: 92, speed: 75, intelligence: 70, stamina: 70, camouflage: 88 },
    habitatFit: { rainforest: 2, forest: 1, grasslands: 0, desert: -1, arctic: -2, mountains: 0, wetlands: 2 },
    facing: "front", headWidth: 45,
    anchors: {
      headTop: { x: 50, y: 8 }, eyeL: { x: 39, y: 33 }, eyeR: { x: 60, y: 33 }, nose: { x: 49, y: 45 }, mouth: { x: 49, y: 53 },
      back: { x: 53, y: 24 }, hips: { x: 53, y: 60 }, rear: { x: 87, y: 69 }, chest: { x: 48, y: 69 },
      frontFeet: [{ x: 19, y: 89 }, { x: 60, y: 89 }], hindFeet: [{ x: 82, y: 85 }],
    },
  },
  {
    id: "sloth", name: "Three-toed Sloth", shortName: "Sloth", scientificName: "Bradypus variegatus", genus: "Bradypus", species: "variegatus",
    image: img_sloth, thumb: th_sloth, imageSize: { w: 750, h: 1052 }, naturalHabitat: "rainforest",
    description: "An upside-down canopy specialist that moves so slowly algae grows on its fur, saving energy on a low-nutrient leaf diet.",
    traits: ["Slow metabolism", "Hooked claws", "Algae camouflage", "Upside-down life"],
    stats: { strength: 30, speed: 8, intelligence: 30, stamina: 60, camouflage: 80 },
    habitatFit: { rainforest: 2, forest: 1, grasslands: -2, desert: -2, arctic: -2, mountains: -1, wetlands: 0 },
    facing: "front", headWidth: 22,
    anchors: {
      headTop: { x: 78, y: 20 }, eyeL: { x: 74, y: 32 }, eyeR: { x: 86, y: 31 }, nose: { x: 80, y: 38 }, mouth: { x: 80, y: 42 },
      back: { x: 45, y: 50 }, hips: { x: 35, y: 70 }, rear: { x: 25, y: 90 }, chest: { x: 65, y: 55 },
      frontFeet: [{ x: 40, y: 5 }, { x: 88, y: 12 }], hindFeet: [{ x: 20, y: 95 }, { x: 60, y: 98 }],
    },
  },
  {
    id: "toucan", name: "Toco Toucan", shortName: "Toucan", scientificName: "Ramphastos toco", genus: "Ramphastos", species: "toco",
    image: img_toucan, thumb: th_toucan, imageSize: { w: 2200, h: 1388 }, naturalHabitat: "rainforest",
    description: "A canopy fruit-eater whose enormous, lightweight beak reaches distant fruit and sheds heat like a radiator.",
    traits: ["Oversized beak", "Heat regulation", "Fruit diet", "Strong feet"],
    stats: { strength: 25, speed: 60, intelligence: 55, stamina: 45, camouflage: 35 },
    habitatFit: { rainforest: 2, forest: 1, grasslands: 0, desert: -1, arctic: -2, mountains: -1, wetlands: 1 },
    facing: "left", headWidth: 28,
    anchors: {
      headTop: { x: 49, y: 1 }, eyeL: { x: 43, y: 9 }, eyeR: { x: 48, y: 8 }, nose: { x: 3, y: 26 }, mouth: { x: 6, y: 30 },
      back: { x: 72, y: 24 }, hips: { x: 84, y: 58 }, rear: { x: 96, y: 82 }, chest: { x: 50, y: 48 },
      frontFeet: [{ x: 56, y: 88 }, { x: 72, y: 86 }], hindFeet: [{ x: 64, y: 88 }],
    },
  },
  {
    id: "red-fox", name: "Red Fox", shortName: "Fox", scientificName: "Vulpes vulpes", genus: "Vulpes", species: "vulpes",
    image: img_red_fox, thumb: th_red_fox, imageSize: { w: 2200, h: 1273 }, naturalHabitat: "forest",
    description: "A clever, adaptable hunter with acute hearing that can pinpoint a mouse under snow, and a bushy tail for balance and warmth.",
    traits: ["Acute hearing", "Adaptable diet", "Bushy tail", "Pouncing leap"],
    stats: { strength: 40, speed: 80, intelligence: 85, stamina: 70, camouflage: 60 },
    habitatFit: { rainforest: 0, forest: 2, grasslands: 1, desert: 0, arctic: 0, mountains: 1, wetlands: 1 },
    facing: "left", headWidth: 26,
    anchors: {
      headTop: { x: 18, y: 3 }, eyeL: { x: 12, y: 40 }, eyeR: { x: 20, y: 40 }, nose: { x: 12, y: 55 }, mouth: { x: 13, y: 60 },
      back: { x: 50, y: 20 }, hips: { x: 68, y: 35 }, rear: { x: 95, y: 90 }, chest: { x: 25, y: 70 },
      frontFeet: [{ x: 22, y: 92 }, { x: 30, y: 90 }], hindFeet: [{ x: 55, y: 80 }, { x: 62, y: 85 }],
    },
  },
  {
    id: "brown-bear", name: "Brown Bear", shortName: "Bear", scientificName: "Ursus arctos", genus: "Ursus", species: "arctos",
    image: img_brown_bear, thumb: th_brown_bear, imageSize: { w: 1386, h: 1405 }, naturalHabitat: "forest",
    description: "A huge omnivore that builds fat reserves all summer and hibernates through winter, with strong forelimbs for digging and fishing.",
    traits: ["Hibernation", "Strong forelimbs", "Omnivore diet", "Keen smell"],
    stats: { strength: 97, speed: 60, intelligence: 65, stamina: 75, camouflage: 45 },
    habitatFit: { rainforest: 0, forest: 2, grasslands: 0, desert: -2, arctic: 0, mountains: 2, wetlands: 1 },
    facing: "left", headWidth: 24,
    anchors: {
      headTop: { x: 20, y: 3 }, eyeL: { x: 18, y: 16 }, eyeR: { x: 17.5, y: 15.5 }, nose: { x: 1.5, y: 26 }, mouth: { x: 4, y: 30 },
      back: { x: 45, y: 12 }, hips: { x: 75, y: 35 }, rear: { x: 95, y: 50 }, chest: { x: 28, y: 60 },
      frontFeet: [{ x: 25, y: 95 }, { x: 45, y: 90 }], hindFeet: [{ x: 70, y: 88 }, { x: 85, y: 90 }],
    },
  },
  {
    id: "owl", name: "Great Horned Owl", shortName: "Owl", scientificName: "Bubo virginianus", genus: "Bubo", species: "virginianus",
    image: img_owl, thumb: th_owl, imageSize: { w: 1101, h: 2200 }, naturalHabitat: "forest",
    description: "A silent night hunter with soft-edged feathers that make no sound in flight, huge light-gathering eyes and a swivelling head.",
    traits: ["Silent flight", "Night vision", "Rotating head", "Crushing talons"],
    stats: { strength: 45, speed: 80, intelligence: 70, stamina: 55, camouflage: 70 },
    habitatFit: { rainforest: 1, forest: 2, grasslands: 1, desert: 0, arctic: 0, mountains: 1, wetlands: 1 },
    facing: "front", headWidth: 42,
    anchors: {
      headTop: { x: 55, y: 3 }, eyeL: { x: 46, y: 9 }, eyeR: { x: 68, y: 9 }, nose: { x: 56, y: 19 }, mouth: { x: 56, y: 24 },
      back: { x: 60, y: 35 }, hips: { x: 55, y: 65 }, rear: { x: 35, y: 92 }, chest: { x: 55, y: 45 },
      frontFeet: [{ x: 55, y: 72 }, { x: 72, y: 74 }], hindFeet: [{ x: 60, y: 75 }],
    },
  },
  {
    id: "lion", name: "African Lion", shortName: "Lion", scientificName: "Panthera leo", genus: "Panthera", species: "leo",
    image: img_lion, thumb: th_lion, imageSize: { w: 2107, h: 2200 }, naturalHabitat: "grasslands",
    description: "The only social big cat, hunting in prides on open plains; the male's mane signals strength and shields the neck in fights.",
    traits: ["Mane", "Pride cooperation", "Powerful roar", "Ambush strength"],
    stats: { strength: 96, speed: 72, intelligence: 72, stamina: 60, camouflage: 55 },
    habitatFit: { rainforest: -1, forest: 0, grasslands: 2, desert: 1, arctic: -2, mountains: -1, wetlands: 0 },
    facing: "left", headWidth: 36,
    anchors: {
      headTop: { x: 22, y: 12 }, eyeL: { x: 11, y: 31 }, eyeR: { x: 27, y: 32 }, nose: { x: 13, y: 47 }, mouth: { x: 14, y: 56 },
      back: { x: 64, y: 30 }, hips: { x: 81, y: 53 }, rear: { x: 95, y: 78 }, chest: { x: 35, y: 73 },
      frontFeet: [{ x: 18, y: 91 }, { x: 45, y: 92 }], hindFeet: [{ x: 89, y: 88 }],
    },
  },
  {
    id: "cheetah", name: "Cheetah", shortName: "Cheetah", scientificName: "Acinonyx jubatus", genus: "Acinonyx", species: "jubatus",
    image: img_cheetah, thumb: th_cheetah, imageSize: { w: 2054, h: 1752 }, naturalHabitat: "grasslands",
    description: "The fastest land animal, built like a sprinter with a flexible spine, long legs and a tail that steers at 100 km/h.",
    traits: ["Explosive sprint", "Flexible spine", "Tear-mark eyes", "Semi-retractable claws"],
    stats: { strength: 55, speed: 100, intelligence: 60, stamina: 40, camouflage: 65 },
    habitatFit: { rainforest: -1, forest: 0, grasslands: 2, desert: 1, arctic: -2, mountains: -1, wetlands: -1 },
    facing: "left", headWidth: 30,
    anchors: {
      headTop: { x: 76, y: 2 }, eyeL: { x: 67, y: 14 }, eyeR: { x: 75, y: 13 }, nose: { x: 58, y: 29 }, mouth: { x: 60, y: 33 },
      back: { x: 85, y: 45 }, hips: { x: 35, y: 60 }, rear: { x: 5, y: 58 }, chest: { x: 68, y: 55 },
      frontFeet: [{ x: 15, y: 68 }, { x: 30, y: 65 }], hindFeet: [{ x: 60, y: 90 }, { x: 80, y: 95 }],
    },
  },
  {
    id: "elephant", name: "African Elephant", shortName: "Elephant", scientificName: "Loxodonta africana", genus: "Loxodonta", species: "africana",
    image: img_elephant, thumb: th_elephant, imageSize: { w: 1633, h: 2200 }, naturalHabitat: "grasslands",
    description: "The largest land animal, with a prehensile trunk for feeding and drinking, huge ears that shed heat, and a remarkable memory.",
    traits: ["Prehensile trunk", "Heat-radiating ears", "Tusks", "Deep memory"],
    stats: { strength: 100, speed: 45, intelligence: 90, stamina: 70, camouflage: 20 },
    habitatFit: { rainforest: 0, forest: 0, grasslands: 2, desert: 1, arctic: -2, mountains: -1, wetlands: 1 },
    facing: "front", headWidth: 45,
    anchors: {
      headTop: { x: 55, y: 5 }, eyeL: { x: 40, y: 28 }, eyeR: { x: 65, y: 28 }, nose: { x: 52, y: 41 }, mouth: { x: 52, y: 48 },
      back: { x: 55, y: 8 }, hips: { x: 55, y: 55 }, rear: { x: 85, y: 50 }, chest: { x: 55, y: 62 },
      frontFeet: [{ x: 35, y: 96 }, { x: 62, y: 96 }], hindFeet: [{ x: 28, y: 92 }, { x: 72, y: 92 }],
    },
  },
  {
    id: "giraffe", name: "Giraffe", shortName: "Giraffe", scientificName: "Giraffa camelopardalis", genus: "Giraffa", species: "camelopardalis",
    image: img_giraffe, thumb: th_giraffe, imageSize: { w: 1645, h: 2200 }, naturalHabitat: "grasslands",
    description: "The tallest animal on Earth, browsing treetop leaves other herbivores cannot reach, with a long tongue and a view over the plains.",
    traits: ["Long neck", "Prehensile tongue", "Tall vantage", "Powerful kick"],
    stats: { strength: 80, speed: 70, intelligence: 55, stamina: 65, camouflage: 50 },
    habitatFit: { rainforest: -1, forest: 0, grasslands: 2, desert: 0, arctic: -2, mountains: -2, wetlands: -1 },
    facing: "left", headWidth: 10,
    anchors: {
      headTop: { x: 14, y: 1 }, eyeL: { x: 8, y: 6 }, eyeR: { x: 8.5, y: 5.8 }, nose: { x: 3, y: 10 }, mouth: { x: 4, y: 12 },
      back: { x: 55, y: 42 }, hips: { x: 75, y: 52 }, rear: { x: 92, y: 58 }, chest: { x: 45, y: 55 },
      frontFeet: [{ x: 50, y: 97 }, { x: 58, y: 97 }], hindFeet: [{ x: 80, y: 95 }, { x: 92, y: 97 }],
    },
  },
  {
    id: "fennec-fox", name: "Fennec Fox", shortName: "Fennec", scientificName: "Vulpes zerda", genus: "Vulpes", species: "zerda",
    image: img_fennec_fox, thumb: th_fennec_fox, imageSize: { w: 2200, h: 1364 }, naturalHabitat: "desert",
    description: "The smallest fox, with enormous ears that radiate heat and pick up prey moving underground, and furred feet for hot sand.",
    traits: ["Heat-radiating ears", "Furred feet", "Night activity", "Water from food"],
    stats: { strength: 20, speed: 72, intelligence: 70, stamina: 60, camouflage: 70 },
    habitatFit: { rainforest: -1, forest: 0, grasslands: 1, desert: 2, arctic: -2, mountains: 0, wetlands: -1 },
    facing: "left", headWidth: 28,
    anchors: {
      headTop: { x: 22, y: 4 }, eyeL: { x: 14, y: 42 }, eyeR: { x: 22, y: 40 }, nose: { x: 12, y: 55 }, mouth: { x: 14, y: 60 },
      back: { x: 50, y: 15 }, hips: { x: 75, y: 30 }, rear: { x: 95, y: 70 }, chest: { x: 30, y: 70 },
      frontFeet: [{ x: 30, y: 93 }, { x: 42, y: 95 }], hindFeet: [{ x: 72, y: 90 }, { x: 80, y: 92 }],
    },
  },
  {
    id: "camel", name: "Dromedary Camel", shortName: "Camel", scientificName: "Camelus dromedarius", genus: "Camelus", species: "dromedarius",
    image: img_camel, thumb: th_camel, imageSize: { w: 1066, h: 1269 }, naturalHabitat: "desert",
    description: "A desert specialist that stores fat in its hump, tolerates huge water loss, and closes its nostrils against blowing sand.",
    traits: ["Fat-storing hump", "Water tolerance", "Sand-proof nostrils", "Wide feet"],
    stats: { strength: 80, speed: 60, intelligence: 50, stamina: 98, camouflage: 45 },
    habitatFit: { rainforest: -2, forest: -1, grasslands: 1, desert: 2, arctic: -1, mountains: 0, wetlands: -2 },
    facing: "left", headWidth: 17,
    anchors: {
      headTop: { x: 12, y: 2 }, eyeL: { x: 3, y: 5.6 }, eyeR: { x: 18.3, y: 6 }, nose: { x: 10, y: 8.5 }, mouth: { x: 10, y: 11.5 },
      back: { x: 50, y: 8 }, hips: { x: 72, y: 30 }, rear: { x: 95, y: 50 }, chest: { x: 30, y: 45 },
      frontFeet: [{ x: 32, y: 96 }, { x: 42, y: 96 }], hindFeet: [{ x: 72, y: 92 }, { x: 80, y: 95 }],
    },
  },
  {
    id: "tortoise", name: "Desert Tortoise", shortName: "Tortoise", scientificName: "Gopherus agassizii", genus: "Gopherus", species: "agassizii",
    image: img_tortoise, thumb: th_tortoise, imageSize: { w: 2200, h: 1443 }, naturalHabitat: "desert",
    description: "A slow, armoured reptile that spends most of its life in burrows, storing water in its bladder to survive months without rain.",
    traits: ["Protective shell", "Burrowing", "Water storage", "Long lifespan"],
    stats: { strength: 35, speed: 8, intelligence: 30, stamina: 85, camouflage: 60 },
    habitatFit: { rainforest: -1, forest: 0, grasslands: 1, desert: 2, arctic: -2, mountains: -1, wetlands: -1 },
    facing: "right", headWidth: 24,
    anchors: {
      headTop: { x: 86, y: 38 }, eyeL: { x: 92, y: 52 }, eyeR: { x: 91, y: 51 }, nose: { x: 99, y: 60 }, mouth: { x: 97, y: 66 },
      back: { x: 45, y: 3 }, hips: { x: 25, y: 40 }, rear: { x: 6, y: 48 }, chest: { x: 80, y: 68 },
      frontFeet: [{ x: 82, y: 95 }], hindFeet: [{ x: 6, y: 88 }, { x: 35, y: 80 }],
    },
  },
  {
    id: "arctic-fox", name: "Arctic Fox", shortName: "Arctic Fox", scientificName: "Vulpes lagopus", genus: "Vulpes", species: "lagopus",
    image: img_arctic_fox, thumb: th_arctic_fox, imageSize: { w: 1373, h: 890 }, naturalHabitat: "arctic",
    description: "A compact fox whose coat turns white in winter and brown in summer, with furred paws and the warmest fur of any mammal.",
    traits: ["Seasonal white coat", "Furred paws", "Compact body", "Cache hunting"],
    stats: { strength: 30, speed: 70, intelligence: 70, stamina: 65, camouflage: 90 },
    habitatFit: { rainforest: -2, forest: 0, grasslands: -1, desert: -2, arctic: 2, mountains: 1, wetlands: 0 },
    facing: "left", headWidth: 22,
    anchors: {
      headTop: { x: 10, y: 6 }, eyeL: { x: 7, y: 22 }, eyeR: { x: 13, y: 20 }, nose: { x: 3, y: 30 }, mouth: { x: 5, y: 34 },
      back: { x: 45, y: 12 }, hips: { x: 70, y: 28 }, rear: { x: 92, y: 68 }, chest: { x: 22, y: 55 },
      frontFeet: [{ x: 22, y: 95 }, { x: 32, y: 95 }], hindFeet: [{ x: 60, y: 90 }, { x: 72, y: 92 }],
    },
  },
  {
    id: "penguin", name: "Emperor Penguin", shortName: "Penguin", scientificName: "Aptenodytes forsteri", genus: "Aptenodytes", species: "forsteri",
    image: img_penguin, thumb: th_penguin, imageSize: { w: 784, h: 713 }, naturalHabitat: "arctic",
    description: "A flightless seabird that huddles through the polar winter, dives hundreds of metres, and 'flies' underwater with flipper wings.",
    traits: ["Blubber insulation", "Huddling", "Flipper wings", "Deep diving"],
    stats: { strength: 45, speed: 40, intelligence: 55, stamina: 85, camouflage: 50 },
    habitatFit: { rainforest: -2, forest: -2, grasslands: -2, desert: -2, arctic: 2, mountains: -1, wetlands: 1 },
    facing: "left", headWidth: 18,
    anchors: {
      headTop: { x: 22, y: 18 }, eyeL: { x: 18.5, y: 25 }, eyeR: { x: 21, y: 24.5 }, nose: { x: 3, y: 42 }, mouth: { x: 5, y: 40 },
      back: { x: 70, y: 15 }, hips: { x: 70, y: 60 }, rear: { x: 95, y: 92 }, chest: { x: 45, y: 60 },
      frontFeet: [{ x: 45, y: 96 }, { x: 60, y: 95 }], hindFeet: [{ x: 40, y: 96 }],
    },
  },
  {
    id: "reindeer", name: "Reindeer", shortName: "Reindeer", scientificName: "Rangifer tarandus", genus: "Rangifer", species: "tarandus",
    image: img_reindeer, thumb: th_reindeer, imageSize: { w: 1741, h: 2200 }, naturalHabitat: "arctic",
    description: "A migrating deer with hollow insulating hair, wide clicking hooves for snow, and eyes that shift colour with the polar seasons.",
    traits: ["Snow hooves", "Hollow hair", "Long migration", "Antlers"],
    stats: { strength: 65, speed: 80, intelligence: 50, stamina: 95, camouflage: 55 },
    habitatFit: { rainforest: -2, forest: 1, grasslands: 1, desert: -1, arctic: 2, mountains: 2, wetlands: 0 },
    facing: "left", headWidth: 22,
    anchors: {
      headTop: { x: 35, y: 36 }, eyeL: { x: 43, y: 42 }, eyeR: { x: 42, y: 41.5 }, nose: { x: 27, y: 52 }, mouth: { x: 29, y: 55 },
      back: { x: 50, y: 45 }, hips: { x: 75, y: 45 }, rear: { x: 94, y: 48 }, chest: { x: 35, y: 65 },
      frontFeet: [{ x: 28, y: 98 }, { x: 40, y: 97 }], hindFeet: [{ x: 78, y: 98 }, { x: 90, y: 97 }],
    },
  },
  {
    id: "snow-leopard", name: "Snow Leopard", shortName: "Snow Leopard", scientificName: "Panthera uncia", genus: "Panthera", species: "uncia",
    image: img_snow_leopard, thumb: th_snow_leopard, imageSize: { w: 1933, h: 2200 }, naturalHabitat: "mountains",
    description: "A ghost of the high mountains with wide fur-covered paws, a thick tail used as a scarf, and a leap of nine metres.",
    traits: ["Wide snow paws", "Scarf tail", "Huge leap", "Smoky camouflage"],
    stats: { strength: 80, speed: 85, intelligence: 65, stamina: 70, camouflage: 92 },
    habitatFit: { rainforest: -1, forest: 1, grasslands: 0, desert: -1, arctic: 1, mountains: 2, wetlands: -1 },
    facing: "front", headWidth: 40,
    anchors: {
      headTop: { x: 22, y: 2 }, eyeL: { x: 14, y: 18 }, eyeR: { x: 30, y: 17 }, nose: { x: 20, y: 30 }, mouth: { x: 20, y: 36 },
      back: { x: 60, y: 15 }, hips: { x: 85, y: 45 }, rear: { x: 95, y: 85 }, chest: { x: 25, y: 55 },
      frontFeet: [{ x: 45, y: 88 }, { x: 60, y: 90 }], hindFeet: [{ x: 90, y: 95 }],
    },
  },
  {
    id: "mountain-goat", name: "Mountain Goat", shortName: "Mountain Goat", scientificName: "Oreamnos americanus", genus: "Oreamnos", species: "americanus",
    image: img_mountain_goat, thumb: th_mountain_goat, imageSize: { w: 1224, h: 1191 }, naturalHabitat: "mountains",
    description: "A cliff specialist whose rubbery, cloven hooves grip near-vertical rock, protected from blizzards by a thick white double coat.",
    traits: ["Grip hooves", "Double coat", "Cliff balance", "Sure footing"],
    stats: { strength: 60, speed: 55, intelligence: 45, stamina: 80, camouflage: 70 },
    habitatFit: { rainforest: -2, forest: 0, grasslands: -1, desert: -1, arctic: 2, mountains: 2, wetlands: -2 },
    facing: "left", headWidth: 16,
    anchors: {
      headTop: { x: 14, y: 8 }, eyeL: { x: 10, y: 21 }, eyeR: { x: 11, y: 20.5 }, nose: { x: 2, y: 32 }, mouth: { x: 3, y: 35 },
      back: { x: 55, y: 12 }, hips: { x: 80, y: 30 }, rear: { x: 95, y: 42 }, chest: { x: 20, y: 60 },
      frontFeet: [{ x: 22, y: 92 }, { x: 15, y: 96 }], hindFeet: [{ x: 75, y: 90 }, { x: 70, y: 96 }],
    },
  },
  {
    id: "yak", name: "Wild Yak", shortName: "Yak", scientificName: "Bos mutus", genus: "Bos", species: "mutus",
    image: img_yak, thumb: th_yak, imageSize: { w: 2200, h: 1182 }, naturalHabitat: "mountains",
    description: "A high-plateau ox with dense wool, a huge lung capacity for thin air, and blood adapted to carry more oxygen.",
    traits: ["High-altitude lungs", "Dense wool", "Massive strength", "Cold tolerance"],
    stats: { strength: 95, speed: 45, intelligence: 40, stamina: 90, camouflage: 40 },
    habitatFit: { rainforest: -2, forest: 0, grasslands: 0, desert: -2, arctic: 1, mountains: 2, wetlands: -1 },
    facing: "left", headWidth: 18,
    anchors: {
      headTop: { x: 12, y: 12 }, eyeL: { x: 8, y: 39 }, eyeR: { x: 15, y: 37 }, nose: { x: 3, y: 45 }, mouth: { x: 5, y: 50 },
      back: { x: 50, y: 8 }, hips: { x: 78, y: 30 }, rear: { x: 95, y: 45 }, chest: { x: 22, y: 65 },
      frontFeet: [{ x: 20, y: 92 }, { x: 30, y: 95 }], hindFeet: [{ x: 72, y: 92 }, { x: 85, y: 95 }],
    },
  },
  {
    id: "ibex", name: "Alpine Ibex", shortName: "Ibex", scientificName: "Capra ibex", genus: "Capra", species: "ibex",
    image: img_ibex, thumb: th_ibex, imageSize: { w: 1335, h: 1224 }, naturalHabitat: "mountains",
    description: "A wild mountain goat famous for scaling near-vertical dam walls, with huge curved horns used in dramatic head-butting contests.",
    traits: ["Curved horns", "Cliff climbing", "Sure footing", "Seasonal coat"],
    stats: { strength: 65, speed: 60, intelligence: 45, stamina: 80, camouflage: 60 },
    habitatFit: { rainforest: -2, forest: 0, grasslands: 0, desert: -1, arctic: 0, mountains: 2, wetlands: -2 },
    facing: "left", headWidth: 16,
    anchors: {
      headTop: { x: 12, y: 10 }, eyeL: { x: 11.5, y: 37.5 }, eyeR: { x: 14, y: 36 }, nose: { x: 5, y: 51 }, mouth: { x: 7, y: 53 },
      back: { x: 55, y: 22 }, hips: { x: 82, y: 35 }, rear: { x: 95, y: 50 }, chest: { x: 25, y: 60 },
      frontFeet: [{ x: 22, y: 96 }, { x: 30, y: 96 }], hindFeet: [{ x: 70, y: 90 }, { x: 85, y: 92 }],
    },
  },
  {
    id: "crocodile", name: "Nile Crocodile", shortName: "Crocodile", scientificName: "Crocodylus niloticus", genus: "Crocodylus", species: "niloticus",
    image: img_crocodile, thumb: th_crocodile, imageSize: { w: 2200, h: 792 }, naturalHabitat: "wetlands",
    description: "An armoured ambush predator that can wait motionless for hours, with the strongest bite ever measured and eyes on top of its head.",
    traits: ["Armoured scales", "Ambush patience", "Bone-crushing bite", "Aquatic stealth"],
    stats: { strength: 95, speed: 50, intelligence: 45, stamina: 80, camouflage: 85 },
    habitatFit: { rainforest: 1, forest: -1, grasslands: 0, desert: 0, arctic: -2, mountains: -2, wetlands: 2 },
    facing: "front", headWidth: 16,
    anchors: {
      headTop: { x: 56, y: 58 }, eyeL: { x: 53, y: 67 }, eyeR: { x: 60, y: 67 }, nose: { x: 58, y: 92 }, mouth: { x: 58, y: 88 },
      back: { x: 45, y: 30 }, hips: { x: 70, y: 25 }, rear: { x: 95, y: 15 }, chest: { x: 56, y: 80 },
      frontFeet: [{ x: 30, y: 82 }, { x: 85, y: 78 }], hindFeet: [{ x: 8, y: 60 }, { x: 97, y: 50 }],
    },
  },
  {
    id: "flamingo", name: "American Flamingo", shortName: "Flamingo", scientificName: "Phoenicopterus ruber", genus: "Phoenicopterus", species: "ruber",
    image: img_flamingo, thumb: th_flamingo, imageSize: { w: 2200, h: 1737 }, naturalHabitat: "wetlands",
    description: "A wading bird whose upside-down bill filters tiny shrimp from shallow water — the same shrimp that turn its feathers pink.",
    traits: ["Filter-feeding bill", "Long wading legs", "One-leg rest", "Flock living"],
    stats: { strength: 25, speed: 65, intelligence: 45, stamina: 60, camouflage: 30 },
    habitatFit: { rainforest: 0, forest: -1, grasslands: 0, desert: -1, arctic: -2, mountains: -2, wetlands: 2 },
    facing: "left", headWidth: 14,
    anchors: {
      headTop: { x: 10, y: 2 }, eyeL: { x: 14, y: 11 }, eyeR: { x: 13, y: 10.5 }, nose: { x: 3, y: 30 }, mouth: { x: 5, y: 24 },
      back: { x: 55, y: 45 }, hips: { x: 70, y: 65 }, rear: { x: 95, y: 80 }, chest: { x: 35, y: 60 },
      frontFeet: [{ x: 45, y: 96 }, { x: 58, y: 96 }], hindFeet: [{ x: 50, y: 96 }],
    },
  },
  {
    id: "hippo", name: "Hippopotamus", shortName: "Hippo", scientificName: "Hippopotamus amphibius", genus: "Hippopotamus", species: "amphibius",
    image: img_hippo, thumb: th_hippo, imageSize: { w: 2200, h: 1302 }, naturalHabitat: "wetlands",
    description: "A river giant that spends its days submerged, secretes its own sunscreen, and defends its territory with metre-long tusks.",
    traits: ["Tusks", "Thick hide", "Skin sunscreen", "Underwater walking"],
    stats: { strength: 98, speed: 40, intelligence: 45, stamina: 70, camouflage: 35 },
    habitatFit: { rainforest: 0, forest: -2, grasslands: 1, desert: -2, arctic: -2, mountains: -2, wetlands: 2 },
    facing: "left", headWidth: 26,
    anchors: {
      headTop: { x: 13, y: 38 }, eyeL: { x: 5, y: 51 }, eyeR: { x: 13, y: 51 }, nose: { x: 4, y: 82 }, mouth: { x: 7, y: 90 },
      back: { x: 50, y: 4 }, hips: { x: 84, y: 14 }, rear: { x: 98, y: 45 }, chest: { x: 26, y: 62 },
      frontFeet: [{ x: 33, y: 97 }, { x: 41, y: 98 }], hindFeet: [{ x: 70, y: 95 }, { x: 93, y: 96 }],
    },
  },
  {
    id: "heron", name: "Grey Heron", shortName: "Heron", scientificName: "Ardea cinerea", genus: "Ardea", species: "cinerea",
    image: img_heron, thumb: th_heron, imageSize: { w: 1037, h: 1407 }, naturalHabitat: "wetlands",
    description: "A patient wading hunter that stands motionless in shallows, then spears fish with a lightning strike of its dagger-like bill.",
    traits: ["Spear bill", "Patient ambush", "Long wading legs", "Broad wings"],
    stats: { strength: 30, speed: 60, intelligence: 55, stamina: 55, camouflage: 55 },
    habitatFit: { rainforest: 1, forest: 0, grasslands: 0, desert: -1, arctic: -1, mountains: -1, wetlands: 2 },
    facing: "left", headWidth: 8,
    anchors: {
      headTop: { x: 28, y: 1 }, eyeL: { x: 23.5, y: 3.6 }, eyeR: { x: 24.5, y: 3.5 }, nose: { x: 5, y: 5 }, mouth: { x: 8, y: 5 },
      back: { x: 65, y: 42 }, hips: { x: 75, y: 52 }, rear: { x: 92, y: 68 }, chest: { x: 55, y: 50 },
      frontFeet: [{ x: 55, y: 83 }, { x: 65, y: 78 }], hindFeet: [{ x: 60, y: 83 }],
    },
  },
  {
    id: "capybara", name: "Capybara", shortName: "Capybara", scientificName: "Hydrochoerus hydrochaeris", genus: "Hydrochoerus", species: "hydrochaeris",
    image: img_capybara, thumb: th_capybara, imageSize: { w: 1776, h: 1269 }, naturalHabitat: "wetlands",
    description: "The world's largest rodent, a semi-aquatic grazer with eyes and nostrils on top of its head so it can hide almost fully submerged.",
    traits: ["Semi-aquatic body", "Herd living", "Top-set eyes", "Ever-growing teeth"],
    stats: { strength: 45, speed: 50, intelligence: 45, stamina: 65, camouflage: 55 },
    habitatFit: { rainforest: 1, forest: 0, grasslands: 1, desert: -2, arctic: -2, mountains: -1, wetlands: 2 },
    facing: "left", headWidth: 22,
    anchors: {
      headTop: { x: 10, y: 1 }, eyeL: { x: 15, y: 7 }, eyeR: { x: 16, y: 6.5 }, nose: { x: 1, y: 15 }, mouth: { x: 3, y: 23 },
      back: { x: 50, y: 10 }, hips: { x: 80, y: 35 }, rear: { x: 95, y: 60 }, chest: { x: 25, y: 60 },
      frontFeet: [{ x: 28, y: 92 }, { x: 35, y: 96 }], hindFeet: [{ x: 72, y: 88 }, { x: 85, y: 95 }],
    },
  },
];

export const animalById = Object.fromEntries(animals.map((a) => [a.id, a]));
export const animalsByHabitat = (habitatId) => animals.filter((a) => a.naturalHabitat === habitatId);
export default animals;
