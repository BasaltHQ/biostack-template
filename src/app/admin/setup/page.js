"use client";
import React, { useState, useEffect } from "react";

export default function AdminSetup() {
    const [available, setAvailable] = useState(null); // null = loading, true/false
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/admin/setup")
            .then((r) => r.json())
            .then((d) => setAvailable(d.available))
            .catch(() => setAvailable(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        setStatus("submitting");
        setError("");

        try {
            const res = await fetch("/api/admin/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setStatus("success");
            } else {
                setError(data.error || "Setup failed");
                setStatus("idle");
            }
        } catch {
            setError("Failed to connect to server");
            setStatus("idle");
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-sage-500 focus:bg-white focus:ring-2 focus:ring-sage-200 outline-none transition-all text-slate-900 text-sm";

    return (
        <main className="min-h-screen bg-sage-50 pt-32 pb-24 px-6 flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-block px-3 py-1 bg-sage-100 text-sage-800 rounded-full text-sm font-bold mb-4 tracking-wider uppercase">
                        Admin Setup
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Admin Account</h1>
                </div>

                {available === null && (
                    <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-slate-100">
                        <div className="animate-spin h-8 w-8 border-2 border-sage-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-slate-500 text-sm mt-4">Checking availability...</p>
                    </div>
                )}

                {available === false && (
                    <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-slate-100">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Setup Complete</h3>
                        <p className="text-slate-500 text-sm">An admin account has already been created. This page is no longer accessible.</p>
                    </div>
                )}

                {available === true && status === "success" && (
                    <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-slate-100">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
                            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Admin Account Created!</h3>
                        <p className="text-slate-500 text-sm mb-6">You can now log in via the portal.</p>
                        <a href="/portal" className="px-6 py-3 bg-sage-600 text-white font-bold rounded-xl hover:bg-sage-500 transition-all shadow-lg text-sm">Go to Portal</a>
                    </div>
                )}

                {available === true && status !== "success" && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                        <p className="text-slate-500 text-sm mb-6 text-center">This is a one-time setup. Once created, this page will be locked.</p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-6">
                                <p className="text-red-700 text-sm text-center font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Full Name</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Admin Name" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Email</label>
                                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="admin@example.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Password (min 8 chars)</label>
                                <input type="password" required minLength={8} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={inputClass} placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Confirm Password</label>
                                <input type="password" required minLength={8} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className={inputClass} placeholder="••••••••" />
                            </div>
                            <button type="submit" disabled={status === "submitting"} className="w-full py-3.5 bg-sage-600 text-white font-bold rounded-xl hover:bg-sage-500 transition-all shadow-lg disabled:opacity-50 tracking-wide text-sm">
                                {status === "submitting" ? "Creating..." : "Create Admin Account"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}
