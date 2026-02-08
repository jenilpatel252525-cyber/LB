import API from "./api"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"

export default function Home(){
    // const [loading, setLoading] = useState(false);
    const [active,setActive]=useState([])
    const [recent,setRecent]=useState([])
    const [editingId, setEditingId] = useState(null)
    const [editPickup, setEditPickup] = useState("")
    const [editDelivery, setEditDelivery] = useState("")
    const [editAddress, setEditAddress] = useState("")
    const navigate = useNavigate()
    const ORDER_STEPS = [
        { key: "placed", label: "Placed"},
        { key: "accepted", label: "Accepted"},
        { key: "pickup", label: "Pickup" },
        { key: "washing", label: "Washing" },
        { key: "drying", label: "Drying" },
        { key: "ready", label: "Ready" },
        { key: "out_for_delivery", label: "Out for Delivery" },
        { key: "delivered", label: "Delivered" },
    ]
    
    // if (loading) {
    //     return <p>Loading orders...</p>;
    // }

    function OrderProgress({ status }) {
        const currentIndex = ORDER_STEPS.findIndex(
            (step) => step.key === status
        )

        return (
            <div className="w-full px-4 mt-2 mb-2 flex flex-col items-center justify-center">
                {/* Progress dots + lines */}
                <p className="mb-2 text-red-500">Know the progress of your order.</p>
                <div
                    className="grid"
                    style={{ gridTemplateColumns: `repeat(${ORDER_STEPS.length}, 1fr)` }}
                >
                    {ORDER_STEPS.map((step, index) => (
                        <div key={step.key} className="flex flex-col items-center relative">
                            {/* Line (except first) */}
                            {index > 0 && (
                                <div
                                    className={`absolute top-2 left-[-50%] w-full h-1 ${
                                        index <= currentIndex
                                            ? "bg-green-500"
                                            : "bg-gray-300"
                                    }`}
                                />
                            )}

                            {/* Dot */}
                            <div
                                className={`w-5 h-5 rounded-full z-10 ${
                                    index <= currentIndex
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                }`}
                            />

                            {/* Label */}
                            <span
                                className={`mt-2 text-xs text-center ${
                                    step.key === status
                                        ? "text-green-600 font-semibold"
                                        : "text-gray-500"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }


    async function handleSave(orderId) {
        try {
            await API.patch(`/order/${orderId}/`, {
                pickup_time: editPickup,
                delivery_time: editDelivery,
                address: editAddress,   // ✅ NEW
            })
            setEditingId(null)
            fetchData()
        } catch (err) {
            console.error(err)
            alert("Failed to update order")
        }
    }

    async function handleCancel(orderId) {
        if (!window.confirm("Cancel this order?")) return;

        try {
            await API.delete(`/order/${orderId}/`);
            fetchData(); // refresh list
        } catch (err) {
            console.error(err);
            alert("Failed to cancel order");
        }
    }

    function handleCancelEdit() {
        setEditingId(null)
    }

    function handleEdit(order) {
        setEditingId(order.id)
        setEditPickup(order.pickup_time)
        setEditDelivery(order.delivery_time)
        setEditAddress(order.address)
    }

    async function fetchData() {
        try{
            const res1 = await API.get("/order/active/")
            console.log(res1);
    
            setActive(res1.data)
            const res2 = await API.get("/order/delivered/")
            setRecent(res2.data)
        }
        catch(err){
            // setLoading(true)
            console.error(err)
            // setActive([]);
            // setRecent([]);
        } finally {
            // setLoading(false);
        }
    }

    useEffect(()=>{
        fetchData()
    },[])

    return(
        <>
            <div className="min-h-screen flex flex-col">
                <Navbar></Navbar>
                <div className="flex-1 flex flex-col justify-center items-center space-y-2 p-4">
                    <h1 className="text-xl font-bold mb-4">Active Orders</h1>
                    {active.length === 0 ? (
                        <p>No active orders.</p>
                    ) : (
                        <table className="border-collapse border w-full">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2">Order #</th>
                                    <th className="border p-2">Pickup</th>
                                    <th className="border p-2">Delivery</th>
                                    <th className="border p-2">Address</th>
                                    <th className="border p-2">Status</th>
                                    <th className="border p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {active.map((o) => (
                                    <>
                                        <tr key={o.id} className="text-center">
                                            <td className="border p-2">{o.id}</td>

                                            {/* PICKUP TIME */}
                                            <td className="border p-2">
                                                {editingId === o.id ? (
                                                    <input
                                                        type="datetime-local"
                                                        value={editPickup.slice(0,16)}
                                                        onChange={(e) => setEditPickup(e.target.value)}
                                                        className="border rounded px-1"
                                                    />
                                                ) : (
                                                    new Date(o.pickup_time).toLocaleString()
                                                )}
                                            </td>

                                            {/* DELIVERY TIME */}
                                            <td className="border p-2">
                                                {editingId === o.id ? (
                                                    <input
                                                        type="datetime-local"
                                                        value={editDelivery.slice(0,16)}
                                                        onChange={(e) => setEditDelivery(e.target.value)}
                                                        className="border rounded px-1"
                                                    />
                                                ) : (
                                                    new Date(o.delivery_time).toLocaleString()
                                                )}
                                            </td>

                                            <td className="border p-2">
                                                {editingId === o.id ? (
                                                    <textarea
                                                        rows="2"
                                                        value={editAddress}
                                                        onChange={(e) => setEditAddress(e.target.value)}
                                                        className="border rounded px-1 w-full"
                                                    />
                                                ) : (
                                                    o.address
                                                )}
                                            </td>

                                            {/* STATUS */}
                                            <td className="border p-2">{o.status}</td>

                                            {/* ACTIONS */}
                                            <td className="border p-2">
                                                {o.status === "placed" && (
                                                    <div className="">
                                                        {editingId === o.id ? (
                                                            <>
                                                                <button
                                                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                                                    onClick={() => handleSave(o.id)}
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    className="bg-gray-400 text-white px-2 py-1 rounded"
                                                                    onClick={handleCancelEdit}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                className="bg-blue-400 hover:bg-blue-600 text-white px-2 py-1 rounded"
                                                                onClick={() => handleEdit(o)}
                                                            >
                                                                Update
                                                            </button>
                                                        )}
                                                        <button
                                                            className="bg-red-400 hover:bg-red-600 text-white px-2 py-1 rounded"
                                                            onClick={() => handleCancel(o.id)}
                                                        >
                                                            Cancel order
                                                        </button>
                                                    </div>
                                                )}
                                            </td>   
                                        </tr>
                                        <tr className="">
                                            <td colSpan={6} className="">
                                                <OrderProgress status={o.status} />
                                            </td>
                                        </tr>
                                    </>
                                ))}
                                </tbody>
                        </table>
                    )}
                    <div className="p-2 space-x-2">
                        <button className="bg-green-400 hover:bg-green-600 text-white px-2 py-1 rounded" onClick={()=>navigate("/order")}>Place new order</button>
                        <button className="bg-blue-400 hover:bg-blue-600 text-white px-2 py-1 rounded" onClick={()=>navigate("/profile")}>Go to profile</button>
                    </div>
                    {
                        recent.length > 0 ? (
                            <div className="flex flex-col space-y-2 items-center">
                                <h1 className="text-2xl">Recent orders</h1>
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
                                            recent.slice(0,3).map((o)=>(
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
                                <button onClick={()=>navigate('/recent')} className="bg-blue-400 w-fit hover:bg-blue-600 text-white px-2 py-1 rounded">View all</button>
                            </div>
                        ) : (
                            <p>No recent orders.</p>
                        )
                    }
                </div>
            </div>
        </>
    )
}