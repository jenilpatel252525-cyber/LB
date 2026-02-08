import API from "./api"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import React from "react"

export default function Home() {

    const [active,setActive]=useState([])
    const [recent,setRecent]=useState([])
    const [editingId, setEditingId] = useState(null)
    const [editPickup, setEditPickup] = useState("")
    const [editDelivery, setEditDelivery] = useState("")
    const [editAddress, setEditAddress] = useState("")
    const [loading , setLoading] = useState(false)
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
                address: editAddress,
            })
            setEditingId(null)
            fetchData()
        } catch {
            alert("Failed to update order")
        }
    }

    async function handleCancel(orderId) {
        if (!window.confirm("Cancel this order?")) return
        try {
            await API.delete(`/order/${orderId}/`)
            fetchData()
        } catch {
            alert("Failed to cancel order")
        }
    }

    function handleEdit(order) {
        setEditingId(order.id)
        setEditPickup(order.pickup_time)
        setEditDelivery(order.delivery_time)
        setEditAddress(order.address)
    }

    function handleCancelEdit() {
        setEditingId(null)
    }

    async function fetchData() {
        try{
            setLoading(true)
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
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchData()
    },[])

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />

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


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 p-4 space-y-4">

                <h1 className="text-xl font-bold text-center">Active Orders</h1>

                {active.length === 0 ? (
                    <p className="text-center">No active orders.</p>
                ) : (

                    <table className="w-full border-collapse border table-fixed text-sm">

                         <colgroup>
                            <col className="w-[11%]" />
                            <col className="w-[18%]" />
                            <col className="w-[18%]" />
                            <col className="w-[25%]" />
                            <col className="w-[15%]" />
                            <col className="w-[13%]" />
                        </colgroup>

                        <thead>
                            <tr className="bg-gray-200">
                                {["Order #","Pickup","Delivery","Address","Status","Actions"].map(h => (
                                    <th key={h} className="border p-1 wrap-break-word">{h}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {active.map(o => (
                                <React.Fragment key={o.id}>

                                    <tr className="text-center">

                                        <td className="border p-1 overflow-hidden">{o.id}</td>

                                        {/* Pickup */}
                                        <td className="border p-1 overflow-hidden">
                                            {editingId === o.id ? (
                                                <input
                                                    type="datetime-local"
                                                    value={editPickup.slice(0,16)}
                                                    onChange={e => setEditPickup(e.target.value)}
                                                    className="w-full min-w-0 border rounded px-1 text-xs"
                                                />
                                            ) : (
                                                new Date(o.pickup_time).toLocaleString()
                                            )}
                                        </td>

                                        {/* Delivery */}
                                        <td className="border p-1 overflow-hidden">
                                            {editingId === o.id ? (
                                                <input
                                                    type="datetime-local"
                                                    value={editDelivery.slice(0,16)}
                                                    onChange={e => setEditDelivery(e.target.value)}
                                                    className="w-full min-w-0 border rounded px-1 text-xs"
                                                />
                                            ) : (
                                                new Date(o.delivery_time).toLocaleString()
                                            )}
                                        </td>

                                        {/* Address */}
                                        <td className="border p-1 wrap-break-word overflow-hidden">
                                            {editingId === o.id ? (
                                                <textarea
                                                    rows="2"
                                                    value={editAddress}
                                                    onChange={e => setEditAddress(e.target.value)}
                                                    className="w-full min-w-0 border rounded px-1 text-xs"
                                                />
                                            ) : o.address}
                                        </td>

                                        <td className="border p-1 wrap-break-word">{o.status}</td>

                                        {/* Actions */}
                                        <td className="border p-1">
                                            {o.status === "placed" && (
                                                <div className="flex flex-col gap-1">

                                                    {editingId === o.id ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleSave(o.id)}
                                                                className="bg-green-400 hover:bg-green-600 text-white rounded text-xs px-1 py-1">
                                                                Save
                                                            </button>

                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="bg-gray-400 hover:bg-gray-600 text-white rounded text-xs px-1 py-1">
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEdit(o)}
                                                            className="bg-blue-400 hover:bg-blue-600 text-white rounded text-xs px-1 py-1">
                                                            Update
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleCancel(o.id)}
                                                        className="bg-red-400 hover:bg-red-600 text-white rounded text-xs px-1 py-1">
                                                        Cancel order
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan={6} className="border">
                                            <OrderProgress status={o.status} />
                                        </td>
                                    </tr>

                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="flex gap-2 justify-center">
                    <button
                        onClick={() => navigate("/order")}
                        className="bg-green-400 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                        Place Order
                    </button>

                    <button
                        onClick={() => navigate("/profile")}
                        className="bg-blue-400 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        Profile
                    </button>
                </div>

                {/* Recent Orders */}

                {recent.length > 0 && (
                    <>
                        <h2 className="text-lg font-bold text-center">Recent Orders</h2>

                        <table className="w-full border-collapse border table-fixed text-sm">

                            <thead>
                                <tr className="bg-gray-200">
                                    {["Order #","Pickup","Delivery","Address","Status"].map(h => (
                                        <th key={h} className="border p-1 wrap-break-word">{h}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {recent.slice(0,3).map(o => (
                                    <tr key={o.id} className="text-center">
                                        <td className="border p-1">{o.id}</td>
                                        <td className="border p-1 wrap-break-word">
                                            {new Date(o.pickup_time).toLocaleString()}
                                        </td>
                                        <td className="border p-1 wrap-break-word">
                                            {new Date(o.delivery_time).toLocaleString()}
                                        </td>
                                        <td className="border p-1 wrap-break-word">{o.address}</td>
                                        <td className="border p-1">{o.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button
                            onClick={() => navigate("/recent")}
                            className="mx-auto block bg-blue-400 hover:bg-blue-600  text-white px-3 py-1 rounded text-sm">
                            View All
                        </button>
                    </>
                )}

            </div>
        </div>
    )
}
