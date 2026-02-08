import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "./api"

export default function Register(){
    const [username , setUserName] = useState("")
    const [password , setPassword] = useState("")
    const [loading , setLoading] = useState(false)
    const navigate = useNavigate()

    async function onclick(e) {
        e.preventDefault();
        setLoading(true)
        try{
            await API.post(
                "/register/",
                {
                    "username":username,
                    "password":password
                }
            )
            alert("registered successfully!")
            navigate("/")
            }
        catch{
            alert("something went wrong. retry!")
            }
        finally{
            setLoading(false)
        }
        }

    return(
        <div className="bg-gray-400 h-screen flex justify-center items-center">
            <div className="border-2 rounded-2xl bg-cyan-50 w-fit h-fit flex justify-center items-center flex-col p-5 space-y-2">
                <form className="flex justify-center items-center flex-col space-y-2" onSubmit={onclick}>
                    <input className="bg-amber-50 border-2 rounded" type="text" required value={username} onChange={(e)=>setUserName(e.target.value)} placeholder="enter username" />
                    <input className="bg-amber-50 border-2 rounded" type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="enter password" />
                    <button disabled={loading} className="hover:bg-blue-600 bg-blue-400  w-full rounded" type="submit">{loading ? "Registering..." : "Register"}</button>
                </form>
                <p>Already registered?</p>
                <p>Login here... <Link className="hover:text-blue-900 text-blue-600 underline" to={"/"}>Login</Link> </p>
            </div>
        </div>
    )
}