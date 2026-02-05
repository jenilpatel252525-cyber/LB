let setAuthReadyFn = null;

export const registerAuthReady = (fn) => {
    setAuthReadyFn = fn;
};

export const setAuthReadyExternal = (value) => {
    if (setAuthReadyFn) {
        setAuthReadyFn(value);
    }
};