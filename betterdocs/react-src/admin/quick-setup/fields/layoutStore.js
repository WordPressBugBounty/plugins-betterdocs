/* Shared (module-level) store for the Customize step's layout picks.
   The picker writes selections here; Launch (Finish) reads them and saves
   them as theme_mods — so layouts persist only when setup is finished,
   the same as the rest of the wizard's values. */

const store = {};

export const setLayoutPick = (key, value) => {
    store[key] = value;
};

export const getLayoutPicks = () => ({ ...store });

export const hasLayoutPicks = () => Object.keys(store).length > 0;
