"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-12 pb-8 border-t border-white/5 text-[10px] uppercase tracking-widest">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 items-start">
          {/* Brand */}
          <div className="space-y-4">
            <Image src="/logo.svg" alt="BioStack Limitless" width={120} height={24} className="h-6 w-auto opacity-80" />
            <p className="text-slate-500 leading-relaxed normal-case tracking-normal text-[11px] max-w-[200px]">
              Premium coaching and pharmaceutical-grade supplements for peak performance.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sage-400 font-bold mb-4">Navigation</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop BioStack</Link></li>
              <li><Link href="/#services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/#reviews" className="hover:text-white transition-colors">Success Stories</Link></li>
              <li><Link href="/#faq" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sage-400 font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/#contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sage-400 font-bold mb-4">Newsletter</h4>
            <p className="text-slate-500 mb-4 normal-case tracking-normal">Latest biohacking tips & updates.</p>
            <form className="flex border-b border-white/10 focus-within:border-sage-500 transition-colors pb-1" onSubmit={(e) => { e.preventDefault(); alert("Newsletter Subscribed!"); }}>
              <input
                type="email"
                placeholder="Email"
                required
                className="bg-transparent text-[11px] w-full py-1 outline-none placeholder:text-slate-700 normal-case tracking-normal"
              />
              <button type="submit" className="text-sage-400 hover:text-white font-bold pl-4 newsletter-submit">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600">
          <span>© {new Date().getFullYear()} BioStack Limitless, LLC.</span>
          <div className="flex gap-8 italic opacity-40">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 text-sage-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
              </svg>
              Pharma Grade
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 text-sage-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
              </svg>
              Lab Tested
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
