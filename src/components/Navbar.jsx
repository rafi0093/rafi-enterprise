import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png"; // logo ঠিক path এ আছে কিনা দেখো

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-green-700 text-white shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* ===== Logo + Name ===== */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 rounded-full border-2 border-yellow-400"
            />
            <span className="font-bold text-lg text-yellow-300">
              M/S RAFI ENTERPRISE
            </span>
          </Link>

          {/* ===== Desktop Menu ===== */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            <Link to="/" className="hover:text-yellow-300">Home</Link>
            <Link to="/about" className="hover:text-yellow-300">About</Link>
            <Link to="/products" className="hover:text-yellow-300">Products</Link>
            <Link to="/gallery" className="hover:text-yellow-300">Gallery</Link>
            <Link to="/contact" className="hover:text-yellow-300">Contact</Link>

            {/* ✅ Admin */}
            <Link
              to="/admin/login"
              className="bg-yellow-400 text-green-900 px-4 py-1 rounded-md hover:bg-yellow-300"
            >
              Admin
            </Link>
          </div>

          {/* ===== Mobile Menu Button ===== */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
          
        {/* ===== Mobile Menu ===== */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-3 pb-4 font-medium">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/products" onClick={() => setIsOpen(false)}>Products</Link>
            <Link to="/gallery" onClick={() => setIsOpen(false)}>Gallery</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>

            {/* ✅ Admin (Mobile) */}
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="bg-yellow-400 text-green-900 px-4 py-2 rounded-md w-fit"
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
