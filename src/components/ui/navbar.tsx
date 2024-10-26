"use client"
import React from 'react';
import { useState } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="relative flex items-center justify-between px-4 py-4 w-full bg-gray-100">
            {/* Logo / Name Section */}
            <div className="text-xl font-bold">
                NAME
            </div>

            {/* Hamburger Menu Button (visible on small screens) */}
            <div className="lg:hidden">
                <button onClick={toggleMenu} className="text-2xl p-2">
                    ☰ {/* Hamburger icon */}
                </button>
                
                {/* Dropdown Menu (full-width on mobile screens) */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg w-screen">
                        <div className="flex flex-col items-center text-center">
                            <a href="#home" className="w-full py-3 text-center hover:bg-gray-200">Home</a>
                            <a href="#about" className="w-full py-3 text-center hover:bg-gray-200">About Us</a>
                            <a href="#services" className="w-full py-3 text-center hover:bg-gray-200">Services</a>
                            <a href="#contact" className="w-full py-3 text-center hover:bg-gray-200">Contact</a>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Links (visible on larger screens only) */}
            <div className="hidden lg:flex lg:w-2/4 justify-between items-center">
                <a href="#home" className="px-4">Home</a>
                <a href="#about" className="px-4">About Us</a>
                <a href="#services" className="px-4">Services</a>
                <a href="#contact" className="px-4">Contact</a>
            </div>

            {/* Login Button */}
            <div className="hidden lg:block">
                <button className="bg-red-200 px-6 py-2 rounded-3xl">
                    Login
                </button>
            </div>

            {/* Login Button for Small Screens */}
            <div className="lg:hidden">
                <button className="bg-red-200 px-4 py-2 rounded-full">
                    Login
                </button>
            </div>
        </div>
    );
}
