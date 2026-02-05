import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children }) {
    const { isAuth, authReady } = useAuth();

    // if (!isAuth){
    //     return <Navigate to="/" />;
    // }

    if (!authReady) {
        return <p>Loading...</p>; // or spinner
    }

    return isAuth ? children : <Navigate to="/" />;
}