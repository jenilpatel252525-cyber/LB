import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Navbar() {

    const nav = useNavigate()
    const {setIsAuth} = useAuth()
    const {setAuthReady} = useAuth()

    function Logout() {
        sessionStorage.clear();
        setIsAuth(false)
        setAuthReady(false)
        nav("/")
    }

    return (
        <nav className="bg-white shadow dark:bg-gray-800 w-full">
            <div className="container flex items-center justify-center p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">

                <button onClick={()=>nav('/home')} className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">Home</button>

                <button onClick={()=>nav('/profile')} className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">Profile</button>

                <button onClick={()=>nav('/recent')} className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">Order history</button>

                <button onClick={()=>nav('/')} className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">Logout</button>

            </div>
        </nav>
    );
}
