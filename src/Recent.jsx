import API from "./api"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Recent(){
    const [recent,setRecent]=useState([])
    const navigate = useNavigate()
    async function fetchData() {
        try{
            const res = await API.get("/order/delivered/")
            setRecent(res.data)
        }
        catch(err){
            console.error(err)
            alert("Failed to load home data")
        }
    }

    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData()
    },[])

    return(
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center p-2.5 space-y-2">
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