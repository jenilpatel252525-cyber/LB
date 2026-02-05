import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Navbar() {

    const nav = useNavigate()
    const {setIsAuth} = useAuth()
    const {setAuthReady} = useAuth()

    function Logout(e) {
        e.preventDefault();
        sessionStorage.clear();
        setIsAuth(false)
        setAuthReady(false)
        nav("/")
    }

    return (
        <nav className="bg-white shadow dark:bg-gray-800">
            <div className="container flex items-center justify-center p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">

                <a href="/home" className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">
                    Home
                </a>

                <a href="/profile" className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">
                    Profile
                </a>

                <a href="/recent" className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">
                    Order history
                </a>

                <a
                    href="/"
                    onClick={(e) => Logout(e)}
                    className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
                >
                    Log out
                </a>

            </div>
        </nav>
    );
}
