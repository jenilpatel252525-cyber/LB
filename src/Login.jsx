import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "./api"
import { useAuth } from "./AuthContext"

export default function Login() {
    const [username, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [loading , setLoading] = useState(false)
    const navigate = useNavigate()
    const {setIsAuth , setAuthReady} = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await API.post("/token/", {
                username,
                password,
            })

            sessionStorage.setItem("access", res.data.access)
            sessionStorage.setItem("refresh", res.data.refresh)
            setIsAuth(true)
            setAuthReady(true)
            navigate("/home")
        } catch (err) {
            if (err.response?.status === 401) {
                alert("Invalid username or password")
            } else {
                alert("Something went wrong. Retry!")
            }
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <div className="bg-gray-400 h-screen flex justify-center items-center">
            <div className="border-2 rounded-2xl bg-cyan-50 w-fit h-fit p-5 flex justify-center items-center flex-col space-y-2">
                <form
                    className="flex justify-center items-center flex-col space-y-2"
                    onSubmit={handleSubmit}
                >
                    <input
                        className="bg-amber-50 border-2 rounded w-full"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="enter username"
                    />

                    <input
                        className="bg-amber-50 border-2 rounded w-full"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="enter password"
                    />

                    <button
                    disabled={loading}
                        className="hover:bg-blue-600 bg-blue-400 w-full rounded"
                        type="submit"
                    >
                        {loading ? "logging in..." : "Login"}
                    </button>
                </form>

                <p>Don't have an account?</p>
                <p>
                    Register here…{" "}
                    <Link
                        className="hover:text-blue-900 text-blue-600 underline"
                        to="/register"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}
