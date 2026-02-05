import API from "./api"
import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import App from "./App"

export default function Order(){
    const [pickup, setPickup] = useState("")
    const [delivery, setDelivery] = useState("")
    const [address, setAddress] = useState("")
    const navigate = useNavigate()

    async function fetchData() {
        try {
            const res = await API.get("/profile/");

            if (res.data.length === 0) {
                // no profile exists
                alert("please make profile to place order.")
                navigate('/profile')
            }

            // profile exists → take first item
            const profile = res.data[0];
            setAddress(profile.address)

        } catch (err) {
            console.error(err);
            alert("Failed to load profile");
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();   // ✅ ACTUALLY CALL IT
    }, []);

    async function onclick(e) {
        e.preventDefault()
        const payload = {
            pickup_time: pickup,
            delivery_time: delivery,
            address: address,
        };
        try{
            await API.post(
                "/order/",
                payload
            )
            alert("order placed successfully!")
        }
        catch(err){
            console.error(err);
            alert("Something went wrong. Retry!");
        }
    }

    return (
        <div className="flex flex-col min-h-screen items-center justify-center space-y-2">
            <div className="border-2 rounded-2xl bg-cyan-50 w-1/2 min-h-[50%] flex justify-center items-center flex-col space-y-2">
                <form
                    className="w-full max-w-md flex justify-center items-center flex-col space-y-2"
                    onSubmit={onclick}
                >
                    <label>Pickup time:</label>
                    <input
                        className="bg-amber-50 border-2 rounded w-3/5"
                        type="datetime-local"
                        required
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        placeholder="enter pickup time"
                    />

                    <label>Delivery time:</label>
                    <input
                        className="bg-amber-50 border-2 rounded w-3/5"
                        type="datetime-local"
                        required
                        value={delivery}
                        onChange={(e) => setDelivery(e.target.value)}
                        placeholder="enter delivery time"
                    />

                    <label>Address:</label>
                    <textarea
                        className="bg-amber-50 border-2 rounded w-3/5"
                        required
                        rows="2"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="enter address"
                    ></textarea>

                    <button
                        className="hover:bg-blue-600 bg-blue-400 w-1/2 rounded mb-2"
                        type="submit"
                    >
                        Submit
                    </button>
                </form>
            </div>
            <button className="hover:bg-green-600 bg-green-400 w-1/12 rounded" onClick={() => navigate("/home")} type="button">Home</button>
        </div>
    )
}