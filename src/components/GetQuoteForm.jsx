"use client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

export default function GetQuoteForm() {
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const email = formData.get("email")?.trim();
        const phone = formData.get("phone")?.trim();

        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(phone)) {
            toast.error(
                "Please enter a valid 10-digit mobile number"
            );
            return;
        }

        try {
            await addDoc(
                collection(
                    db,
                    "websitesQueries",
                    "humanbiomedicalcom",
                    "productQueries"
                ),
                {
                    email,
                    phone,
                    productName: "Get Quote",
                    createdAt: serverTimestamp(),
                }
            );

            toast.success("Quote Request Submitted");

            e.target.reset();
            setShowForm(false);

        } catch (error) {
            console.error(error);
            toast.error("Failed to submit query");
        }
    };

    return (
        <>
            <Toaster position="top-right" />

            <div
                style={{
                    position: "relative",
                }}
            >
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        background: "#1565d8",
                        color: "#fff",
                        border: "none",
                        padding: "18px 34px",
                        borderRadius: "999px",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                >
                    Get Quote
                </button>

                {showForm && (
                    <div
                        style={{
                            position: "absolute",
                            top: "80px",
                            left: 0,
                            width: "500px",
                            padding: "25px",
                            background: "#fff",
                            borderRadius: "16px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                            zIndex: 1000,
                        }}
                    >
                        <h3 style={{ marginBottom: "20px" }}>
                            Get Quote
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 15px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    marginBottom: "15px",
                                }}
                            />

                            <input
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                pattern="[6-9]{1}[0-9]{9}"
                                name="phone"
                                placeholder="Enter 10 Digit Mobile Number"
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 15px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    marginBottom: "20px",
                                }}
                            />

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                }}
                            >
                                <button
                                    type="submit"
                                    style={{
                                        background: "#1565d8",
                                        color: "#fff",
                                        border: "none",
                                        padding: "10px 20px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Submit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    style={{
                                        background: "#f3f4f6",
                                        border: "1px solid #d1d5db",
                                        padding: "10px 20px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}