"use client";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import "./contact.css";

export default function ContactClient({
    districtData,
}) {
    const [contactInfo, setContactInfo] = useState([]);

    const districtName =
        districtData?.district || "India";

    const stateName =
        districtData?.state || "";

    const districtSlug =
        districtData?.slug || "";

    const formattedDistrict =
        districtName
            .split("-")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");

    const Office =
        districtSlug
            ? stateName
                ? `${formattedDistrict}, ${stateName}, India`
                : `${formattedDistrict}, India`
            : "Jaipur, Rajasthan, India";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const phoneRegex =
            /^[6-9]\d{9}$/;

        if (!formData.name.trim()) {
            toast.error("Name is required");
            return;
        }

        if (!emailRegex.test(formData.email)) {
            toast.error("Enter a valid email address");
            return;
        }

        if (!phoneRegex.test(formData.phone)) {
            toast.error("Enter a valid 10 digit mobile number");
            return;
        }

        if (formData.message.trim().length < 10) {
            toast.error("Message must be at least 10 characters");
            return;
        }

        try {
            const res = await fetch("/api/contact-query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company,
                    message: formData.message,
                    district: districtName,
                    websiteId: "humanbiomedicalcom",
                    companyId: "human",
                    source: "contact_page",
                }),
            });

            if (res.ok) {
                toast.success("Message sent successfully");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    company: "",
                    message: "",
                });
            } else {
                toast.error("Failed to send message");
            }
        } catch (error) {
            console.error("Contact query submission error:", error);
            toast.error("Failed to send message");
        }
    };

    useEffect(() => {
        const loadContact = async () => {
            try {
                const res = await fetch(
                    `/api/site-data?type=contact&companyId=human&websiteId=humanbiomedicalcom&t=${Date.now()}`
                );
                if (res.ok) {
                    const json = await res.json();
                    const data = json.data;
                    if (data && Array.isArray(data.contactInfo)) {
                        setContactInfo(data.contactInfo);
                    } else if (Array.isArray(data)) {
                        setContactInfo(data);
                    }
                }
            } catch (err) {
                // Silently handle
            }
        };

        loadContact();
    }, []);

    const getValue = (key) => {
        return (
            contactInfo.find((item) =>
                item.label
                    ?.toLowerCase()
                    .includes(key.toLowerCase())
            )?.value || ""
        );
    };

    return (
        <>
            <Toaster position="top-right" />

            {/* HERO */}
            <section className="contact-hero">
                <div className="container-custom">
                    <span className="contact-tag">
                        Contact Us
                    </span>

                    <h1>
                        Contact Human Biomedical LLP in {districtName}
                    </h1>

                    <p>
                        Looking for laboratory instruments, hospital equipment,
                        diagnostic systems, pathology analyzers, medical devices,
                        laboratory consumables, or healthcare solutions? Our team is
                        ready to help you with product recommendations, technical
                        guidance, quotations, and timely delivery across {districtName}.
                    </p>
                </div>
            </section>

            {/* CONTACT */}
            <section className="contact-section">
                <div className="container-custom contact-grid">

                    <div className="contact-info">

                        <span>Get In Touch</span>

                        <h2>
                            Speak With Our Healthcare Equipment Experts
                        </h2>

                        <p>
                            Human Biomedical LLP is committed to providing reliable
                            laboratory and hospital equipment solutions. Contact our
                            experts for product information, quotations, technical
                            support, installation guidance, and after-sales assistance.
                        </p>

                        <div className="info-cards">

                            <div className="info-card">
                                📍
                                <div>
                                    <h4>Office Address</h4>
                                    <p>
                                        {getValue("Address") || Office}
                                    </p>
                                </div>
                            </div>

                            <div className="info-card">
                                📞
                                <div>
                                    <h4>Call Us</h4>
                                    <p>
                                        {getValue("Phone") ||
                                            "+91 XXXXX XXXXX"}
                                    </p>
                                </div>
                            </div>

                            <div className="info-card">
                                ✉️
                                <div>
                                    <h4>Email Us</h4>
                                    <p>
                                        {getValue("Email") ||
                                            "info@humanbiomedical.com"}
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* FORM */}
                    <div className="contact-form-box">

                        <h3>Send Message</h3>

                        <form onSubmit={handleSubmit}>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                required
                            />

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                required
                            />

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setFormData({
                                        ...formData,
                                        phone: value,
                                    });
                                }}
                                placeholder="Phone Number"
                                maxLength={10}
                                required
                            />

                            <textarea
                                rows="5"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us about your requirement..."
                                required
                            />

                            <button type="submit">
                                Send Message
                            </button>

                        </form>

                    </div>

                </div>
            </section>

            {/* SEO */}
            <section className="seo-contact">
                <div className="container-custom">

                    <h2>
                        Trusted Laboratory & Hospital Equipment Supplier in {districtName}
                    </h2>

                    <p>
                        Human Biomedical LLP is a trusted supplier of laboratory
                        instruments, hospital equipment, diagnostic systems,
                        pathology analyzers, ICU & OT equipment, medical devices,
                        laboratory consumables, and healthcare solutions in
                        {` ${districtName}`}. We proudly serve hospitals,
                        diagnostic centres, pathology laboratories, research
                        institutions, clinics, nursing homes, blood banks,
                        and healthcare organizations with quality products,
                        expert support, and dependable service.
                    </p>

                </div>
            </section>

            {/* MAP */}
            <section className="map-section">
                <div className="container-custom">
                    <div className="map-wrapper">

                        <div
                            style={{
                                border: "4px solid #2563eb",
                                borderRadius: "20px",
                                overflow: "hidden",
                            }}
                        >
                            <iframe
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                    getValue("Office") || Office
                                )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                width="100%"
                                height="500"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                    </div>
                </div>
            </section>

        </>
    );
}