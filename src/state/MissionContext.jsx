import { createContext, startTransition, useContext, useEffect, useMemo, useReducer } from "react";
import { loadMission, saveMission, clearMission } from "../utils/storage";
import { habitatById } from "../data/habitats";
import { animalById } from "../data/animals";
import { traitById } from "../data/traits";
import { generateSpecies } from "../utils/generateSpecies";

export const MAX_TRAITS = 3;

const initial = { habitatId: null, animalId: null, traitIds: [], species: null };

function sanitize(saved) {
  if (!saved) return initial;
  const habitatId = habitatById[saved.habitatId] ? saved.habitatId : null;
  const animalId = animalById[saved.animalId] ? saved.animalId : null;
  const traitIds = Array.isArray(saved.traitIds)
    ? saved.traitIds.filter((id) => traitById[id] && traitById[id].source !== animalId).slice(0, MAX_TRAITS)
    : [];
  const species = saved.species && saved.species.baseAnimalId === animalId && saved.species.habitatId === habitatId ? saved.species : null;
  return { habitatId, animalId, traitIds, species };
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_HABITAT":
      return { ...state, habitatId: action.id, species: null };
    case "SET_ANIMAL": {
      // Drop traits sourced from the new base animal (they're already part of it).
      const traitIds = state.traitIds.filter((t) => traitById[t]?.source !== action.id);
      return { ...state, animalId: action.id, traitIds, species: null };
    }
    case "TOGGLE_TRAIT": {
      const has = state.traitIds.includes(action.id);
      if (has) return { ...state, traitIds: state.traitIds.filter((t) => t !== action.id), species: null };
      if (state.traitIds.length >= MAX_TRAITS) return state;
      return { ...state, traitIds: [...state.traitIds, action.id], species: null };
    }
    case "CLEAR_TRAITS":
      return { ...state, traitIds: [], species: null };
    case "SET_SPECIES":
      return { ...state, species: action.species };
    case "RESET":
      return initial;
    default:
      return state;
  }
}

const MissionContext = createContext(null);

export function MissionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => sanitize(loadMission()));

  useEffect(() => { saveMission(state); }, [state]);

  const value = useMemo(() => {
    const habitat = state.habitatId ? habitatById[state.habitatId] : null;
    const animal = state.animalId ? animalById[state.animalId] : null;
    const traits = state.traitIds.map((id) => traitById[id]).filter(Boolean);
    return {
      ...state,
      habitat,
      animal,
      traits,
      isComplete: state.traitIds.length === MAX_TRAITS,
      setHabitat: (id) => dispatch({ type: "SET_HABITAT", id }),
      setAnimal: (id) => dispatch({ type: "SET_ANIMAL", id }),
      toggleTrait: (id) => dispatch({ type: "TOGGLE_TRAIT", id }),
      clearTraits: () => dispatch({ type: "CLEAR_TRAITS" }),
      generate: () => {
        if (!habitat || !animal || state.traitIds.length !== MAX_TRAITS) return null;
        const species = generateSpecies(animal, habitat, state.traitIds);
        dispatch({ type: "SET_SPECIES", species });
        return species;
      },
      // Wrapped in a transition so it batches with router navigation (React Router navigates
      // inside startTransition); otherwise a page guard could redirect before the route changes.
      reset: () => { clearMission(); startTransition(() => dispatch({ type: "RESET" })); },
    };
  }, [state]);

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
}

export function useMission() {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error("useMission must be used inside MissionProvider");
  return ctx;
}
