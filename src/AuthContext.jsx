import { createContext, useContext, useEffect, useState } from "react";
import { registerAuthReady } from "./authEvents";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuth, setIsAuth] = useState(false);
    const [authReady, setAuthReady] = useState(false);

    // 🔥 Rehydrate auth state on app load
    useEffect(() => { 
        const token = sessionStorage.getItem("access");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsAuth(!!token);
        setAuthReady(!!token); // auth state is now known
        registerAuthReady(setAuthReady);
    }, []);

    return (
        <AuthContext.Provider
            value={{ isAuth, setIsAuth, authReady, setAuthReady }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);