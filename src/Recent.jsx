import API from "./api"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"

export default function Recent(){
    const [recent,setRecent]=useState([])
    const navigate = useNavigate()
    const [loading , setLoading] = useState(false)
    async function fetchData() {
        try{
            setLoading(true)
            const res = await API.get("/order/delivered/")
            setRecent(res.data)
        }
        catch(err){
            console.error(err)
            alert("Failed to load home data")
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData()
    },[])

    if (loading) {
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
        }

    return(
        <div className="min-h-screen flex-col flex">
            <Navbar></Navbar>
            <div className="flex-1 flex flex-col items-center justify-center p-2.5 space-y-2">
                <h1 className="text-2xl">Recent orders</h1>
                {
                    recent.length > 0 ? (
                        <div className="flex flex-col space-y-2 items-center">
                            <table className="border-collapse border w-full">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">Order #</th>
                                        <th className="border p-2">Pickup</th>
                                        <th className="border p-2">Delivery</th>
                                        <th className="border p-2">Address</th>
                                        <th className="border p-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        recent.map((o)=>(
                                                <tr key={o.id} className="text-center">
                                                    <td className="border p-2 space-x-2">{o.id}</td>
                                                    <td className="border p-2 space-x-2">{new Date(o.pickup_time).toLocaleString()}</td>
                                                    <td className="border p-2 space-x-2">{new Date(o.delivery_time).toLocaleString()}</td>
                                                    <td className="border p-2 space-x-2">{o.address}</td>
                                                    <td className="border p-2 space-x-2">{o.status}</td>
                                                </tr>
                                            )
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No recent orders.</p>
                    )
                }
                <button className="bg-blue-400 w-fit hover:bg-blue-600 text-white px-2 py-1 rounded" onClick={()=>navigate('/home')} type="button">Home</button>
            </div>
        </div>
    )
}