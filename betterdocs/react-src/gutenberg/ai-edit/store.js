import { createReduxStore, register } from "@wordpress/data";

export const STORE_KEY = "betterdocs/ai-edit";

const DEFAULT_STATE = {
    isOpen: false,
    selectionType: null,
    selectionText: "",
    selectionHtml: "",
    blockClientId: null,
    inlineContext: null,
    result: "",
    status: "idle",
    error: "",
};

const actions = {
    openModal(payload) {
        return { type: "OPEN_MODAL", payload };
    },
    closeModal() {
        return { type: "CLOSE_MODAL" };
    },
    setStatus(status, error = "") {
        return { type: "SET_STATUS", status, error };
    },
    setResult(result) {
        return { type: "SET_RESULT", result };
    },
    resetResult() {
        return { type: "RESET_RESULT" };
    },
};

const reducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case "OPEN_MODAL":
            return {
                ...DEFAULT_STATE,
                isOpen: true,
                ...action.payload,
            };
        case "CLOSE_MODAL":
            return DEFAULT_STATE;
        case "SET_STATUS":
            return { ...state, status: action.status, error: action.error };
        case "SET_RESULT":
            return { ...state, result: action.result, status: "done", error: "" };
        case "RESET_RESULT":
            return { ...state, result: "", status: "idle", error: "" };
        default:
            return state;
    }
};

const selectors = {
    getState(state) {
        return state;
    },
    isOpen(state) {
        return state.isOpen;
    },
};

const store = createReduxStore(STORE_KEY, {
    reducer,
    actions,
    selectors,
});

register(store);

export default store;
