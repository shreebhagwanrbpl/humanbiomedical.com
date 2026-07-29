"use client";

import { useState } from "react";

export default function ProductGallery({ product }) {
    const [activeImage, setActiveImage] = useState(0);
    const [activeMedia, setActiveMedia] = useState("image");

    return (
        <div className="product-image-box">

            {/* Main Preview */}
            <div className="main-media-preview">

                {activeMedia === "video" && product.video ? (
                    <video
                        controls
                        className="main-video"
                    >
                        <source
                            src={product.video}
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <img
                        src={
                            product.images?.[activeImage] ||
                            product.image ||
                            "/images/products/default.webp"
                        }
                        alt={product.title || "Medical Equipment"}
                        className="main-product-image"
                    />
                )}

            </div>

            {/* Thumbnails */}
            <div className="media-gallery">

                {product.images?.map((img, index) => (
                    <div
                        key={index}
                        className={`thumb-wrapper ${activeMedia === "image" && activeImage === index
                            ? "active-thumb"
                            : ""
                            }`}
                        onClick={() => {
                            setActiveImage(index);
                            setActiveMedia("image");
                        }}
                    >
                        <img
                            src={img}
                            alt={`${product.title} ${index + 1}`}
                            className="thumb-image"
                        />
                    </div>
                ))}

                {product.video && (
                    <div
                        className={`media-card ${activeMedia === "video" ? "active-thumb" : ""
                            }`}
                        onClick={() => setActiveMedia("video")}
                    >
                        <div className="media-icon">▶</div>
                        <span>Video</span>
                    </div>
                )}

                {product.pdf && (
                    <a
                        href={product.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="media-card"
                    >
                        <div className="media-icon">📄</div>
                        <span>PDF</span>
                    </a>
                )}

            </div>

        </div>
    );
}