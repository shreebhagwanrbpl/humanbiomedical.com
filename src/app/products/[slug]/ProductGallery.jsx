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
                        autoPlay
                        className="main-video"
                    >
                        <source
                            src={product.video}
                            type="video/mp4"
                        />
                    </video>
                ) : (
                    <img
                        src={
                            product.images?.[activeImage] ||
                            product.image ||
                            "/images/products/default.webp"
                        }
                        alt={product.title}
                        className="main-product-image"
                    />
                )}

            </div>

            {/* Thumbnails */}
            <div className="media-gallery">

                {product.images?.map((img, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            setActiveImage(index);
                            setActiveMedia("image");
                        }}
                        className={`thumb-wrapper ${activeMedia === "image" &&
                            activeImage === index
                            ? "active-thumb"
                            : ""
                            }`}
                    >
                        <img
                            src={img}
                            alt=""
                            className="thumb-image"
                        />
                    </div>
                ))}

                {product.video && (
                    <div
                        className={`media-card ${activeMedia === "video"
                            ? "active-thumb"
                            : ""
                            }`}
                        onClick={() =>
                            setActiveMedia("video")
                        }
                    >
                        <div className="media-icon">
                            ▶
                        </div>

                        <span>Video</span>
                    </div>
                )}

                {product.pdf && (
                    <a
                        href={product.pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="media-card"
                    >
                        <div className="media-icon">
                            📄
                        </div>

                        <span>PDF</span>
                    </a>
                )}

            </div>

        </div>
    );
}