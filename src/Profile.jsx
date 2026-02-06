import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";
import Navbar from "./Navbar";

export default function Profile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [hasProfile, setHasProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileId, setProfileId] = useState(null);

    const navigate = useNavigate();

    async function fetchData() {
        try {
            const res = await API.get("/profile/");

            if (res.data.length === 0) {
                // no profile exists
                setHasProfile(false);
                return;
            }

            // profile exists → take first item
            const profile = res.data[0];

            setName(profile.name);
            setEmail(profile.email);
            setAddress(profile.address);
            setContact(profile.contact);
            setProfileId(profile.id);
            setHasProfile(true);

        } catch (err) {
            console.error(err);
            alert("Failed to load profile");
        }
    }

    useEffect(() => {
        fetchData();   // ✅ ACTUALLY CALL IT
    }, []);

    async function onclick(e) {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name,
            email,
            address,
            contact,
        };

        try {
            if (!hasProfile) {
                await API.post("/profile/", payload);
                setHasProfile(true);
                alert("Profile created.");
            } else {
                await API.put(`/profile/${profileId}/`, payload);
                alert("Profile updated.");
            }
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Retry!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Navbar></Navbar>
                <div className="bg-gray-400 flex-1 w-full flex justify-center items-center flex-col space-y-3">
                    <div className="border-2 rounded-2xl bg-cyan-50 w-1/2 min-h-[50%] flex justify-center items-center flex-col space-y-2">
                        <form
                            className="w-full max-w-md flex justify-center items-center flex-col space-y-2"
                            onSubmit={onclick}
                        >
                            <label>Name:</label>
                            <input
                                className="bg-amber-50 border-2 rounded w-3/5"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="enter name"
                            />

                            <label>Email:</label>
                            <input
                                className="bg-amber-50 border-2 rounded w-3/5"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="enter email"
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

                            <label>Contact:</label>
                            <input
                                className="bg-amber-50 border-2 rounded w-3/5"
                                type="tel"
                                minLength={10}
                                maxLength={10}
                                required
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="enter contact number"
                            />

                            <button
                                className="hover:bg-blue-600 bg-blue-400 w-1/2 rounded mb-2"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "update"}
                            </button>
                        </form>
                    </div>
                    <button className="hover:bg-green-600 bg-green-400 w-1/12 rounded" onClick={() => navigate("/home")} type="button">Home</button>
                </div>
            </div>
        </>
    );
}
