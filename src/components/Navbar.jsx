"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for session in sessionStorage (set by portal after login)
    try {
      const session = sessionStorage.getItem("portal_session");
      setIsLoggedIn(!!session);
    } catch {}
  }, []);

  // Listen for login/logout events from portal
  useEffect(() => {
    const handleStorage = () => {
      try {
        const session = sessionStorage.getItem("portal_session");
        setIsLoggedIn(!!session);
      } catch {}
    };

    // Custom event for same-tab updates
    window.addEventListener("biostack_auth_change", handleStorage);
    return () => window.removeEventListener("biostack_auth_change", handleStorage);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* HEADER SECTION */}
      <header className="fixed top-0 left-0 w-full bg-black/90 backdrop-blur-md text-white shadow-lg border-b border-white/10" style={{ zIndex: 100000 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center" onClick={closeMenu}>
            <Image src="/logo.svg" alt="BioStack Limitless Logo" width={150} height={48} className="h-10 md:h-12 w-auto" priority />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            id="menu-toggle"
            onClick={toggleMenu}
            className="md:hidden text-5xl focus:outline-none hover:text-sage-300 transition-colors z-[110] relative"
            aria-label="Toggle Navigation Menu"
          >
            <span id="menu-icon" className="text-white flex -mt-2">
              {isMobileMenuOpen ? "✕" : "☰"}
            </span>
          </button>

          {/* Navigation Menu */}
          <nav id="menu" className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link text-sm font-medium hover:text-sage-300 transition-colors tracking-wide">HOME</Link>
            {isLoggedIn && (
              <Link href="/shop" className="nav-link text-sm font-medium hover:text-sage-300 transition-colors tracking-wide">SHOP</Link>
            )}
            <Link href="/#services" className="nav-link text-sm font-medium hover:text-sage-300 transition-colors tracking-wide">SERVICES</Link>
            <Link href="/#faq" className="nav-link text-sm font-medium hover:text-sage-300 transition-colors tracking-wide">FAQ</Link>
            <Link href="/#reviews" className="nav-link text-sm font-medium hover:text-sage-300 transition-colors tracking-wide">REVIEWS</Link>
            <Link
              href="/register"
              className="nav-link text-sm font-medium hover:text-sage-300 transition-colors tracking-wide"
            >
              REGISTER
            </Link>
            <Link
              href="/portal"
              className="px-5 py-2.5 border border-white/20 rounded text-sm font-bold tracking-wider hover:bg-white/10 transition-all"
            >
              {isLoggedIn ? "PORTAL" : "LOGIN"}
            </Link>
            <Link
              href="/#contact"
              className="px-5 py-2.5 bg-sage-600 rounded text-sm font-bold tracking-wider hover:bg-sage-500 transition-all shadow-lg hover:shadow-sage-500/25"
            >
              GET IN TOUCH
            </Link>
          </nav>
        </div>
      </header>

      {/* Full Screen Mobile Menu Overlay */}
      <div
        id="mobile-menu-overlay"
        className={`fixed inset-0 z-[2147483647] bg-slate-950/98 backdrop-blur-2xl transform transition-transform duration-500 ease-in-out md:hidden flex justify-center items-center overflow-y-auto ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ zIndex: 2147483647 }}
      >
        <div className="w-full flex flex-col items-center py-20 px-6">
          {/* Logo in Menu */}
          <div className="mb-12">
            <Image src="/logo.svg" alt="BioStack Limitless" width={150} height={40} className="h-10 w-auto" />
          </div>

          <nav className="flex flex-col space-y-6 text-center w-full mb-12">
            <Link href="/" onClick={closeMenu} className="text-3xl font-light text-white hover:text-sage-400 transition-colors tracking-widest uppercase">HOME</Link>
            {isLoggedIn && (
              <Link href="/shop" onClick={closeMenu} className="text-3xl font-light text-white hover:text-sage-400 transition-colors tracking-widest uppercase">SHOP</Link>
            )}
            <Link href="/#services" onClick={closeMenu} className="text-3xl font-light text-white hover:text-sage-400 transition-colors tracking-widest uppercase">SERVICES</Link>
            <Link href="/#faq" onClick={closeMenu} className="text-3xl font-light text-white hover:text-sage-400 transition-colors tracking-widest uppercase">FAQ</Link>
            <Link href="/#reviews" onClick={closeMenu} className="text-3xl font-light text-white hover:text-sage-400 transition-colors tracking-widest uppercase">REVIEWS</Link>
            <Link href="/register" onClick={closeMenu} className="text-3xl font-light text-white hover:text-sage-400 transition-colors tracking-widest uppercase">REGISTER</Link>
          </nav>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <Link
              href="/portal"
              onClick={closeMenu}
              className="w-full py-5 border-2 border-white/20 rounded-full text-xl font-bold text-center text-white tracking-widest uppercase hover:bg-white/10 transition-all"
            >
              {isLoggedIn ? "PORTAL" : "LOGIN"}
            </Link>
            <Link
              href="/#contact"
              onClick={closeMenu}
              className="w-full py-5 bg-sage-600 rounded-full text-xl font-bold text-center text-white tracking-widest uppercase hover:bg-sage-500 transition-all shadow-xl border border-white/10"
            >
              GET IN TOUCH
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
