"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Products",
    path: "/products",
  },
  {
    name: "Services",
    path: "/services",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

export default function Navbar() {
  const params = useParams();
  const district = params?.district;

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-lg shadow-md">
      <nav className="container-custom flex items-center justify-between py-4">

        {/* Logo */}
        <Link
          href={district ? `/${district}` : "/"}
          className="flex items-center"
        >
          <img
            src="/qlyte.png"
            alt="Qlyte logo"
            className="h-10 sm:h-12 w-auto cursor-pointer"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const href =
              district
                ? link.path === "/"
                  ? `/${district}`
                  : `/${district}${link.path}`
                : link.path;

            return (
              <Link
                key={link.name}
                href={href}
                className="font-medium text-gray-700 hover:text-blue-600 transition"
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="hidden md:block"
        >
          <Link
            href={district ? `/${district}/contact` : "/contact"}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-full inline-block transition"
          >
            Get Quote
          </Link>
        </motion.div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white shadow-lg border-t"
          >
            <div className="flex flex-col p-5 gap-4">
              {navLinks.map((link) => {
                const href =
                  district
                    ? link.path === "/"
                      ? `/${district}`
                      : `/${district}${link.path}`
                    : link.path;

                return (
                  <Link
                    key={link.name}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="font-medium text-gray-700 hover:text-blue-600 transition"
                  >
                    {link.name}
                  </Link>
                );
              })}

              <Link
                href={district ? `/${district}/contact` : "/contact"}
                onClick={() => setMenuOpen(false)}
                className="bg-blue-700 hover:bg-blue-800 text-white text-center py-3 rounded-full mt-2 transition"
              >
                Get Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}