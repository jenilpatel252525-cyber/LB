import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children }) {
    const { isAuth, authReady } = useAuth();

    // if (!isAuth){
    //     return <Navigate to="/" />;
    // }

    
    if (!authReady) {
            return (
                <div className="min-h-screen flex flex-col">

                    <div className="flex-1 flex justify-center items-center">
    
                        <div className="flex flex-col items-center gap-3">
    
                            {/* spinner */}
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    
                            <p className="text-gray-600">Loading...</p>
    
                        </div>
    
                    </div>
                </div>
            )
        } // or spinner
    
    return isAuth ? children : <Navigate to="/" />;
}