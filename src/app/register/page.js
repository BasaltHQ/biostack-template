"use client";
import React, { useState } from "react";
import Link from "next/link";

const INDUSTRY_OPTIONS = [
  { value: "", label: "Select Industry" },
  { value: "healthcare", label: "Healthcare" },
  { value: "fitness", label: "Fitness & Wellness" },
  { value: "medical", label: "Medical Practice" },
  { value: "pharmaceutical", label: "Pharmaceutical" },
  { value: "nutrition", label: "Nutrition & Dietetics" },
  { value: "sports", label: "Sports & Athletics" },
  { value: "beauty", label: "Beauty & Aesthetics" },
  { value: "retail", label: "Retail" },
  { value: "other", label: "Other" },
];

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    officePhone: "",
    website: "",
    billingAddress: { street: "", city: "", state: "", zip: "", country: "" },
    shippingAddress: { street: "", city: "", state: "", zip: "", country: "" },
    industry: "",
    description: "",
  });

  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const copyBillingToShipping = () => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: { ...prev.billingAddress },
    }));
  };

  // Phone formatter: +1 (XXX) XXX-XXXX
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    const d = digits.length > 0 && digits[0] !== "1" ? "1" + digits : digits;
    if (d.length === 0) return "";
    if (d.length <= 1) return "+1";
    if (d.length <= 4) return `+1 (${d.slice(1)}`;
    if (d.length <= 7) return `+1 (${d.slice(1, 4)}) ${d.slice(4)}`;
    return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    setFormData((prev) => ({ ...prev, officePhone: formatPhone(e.target.value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      setStatus("error");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          officePhone: formData.officePhone,
          website: formData.website,
          billingAddress: formData.billingAddress,
          shippingAddress: formData.shippingAddress,
          industry: formData.industry,
          description: formData.description,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Failed to connect to server. Please try again.");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-sage-500 focus:bg-white focus:ring-2 focus:ring-sage-200 outline-none transition-all text-slate-900 text-sm";
  const labelClass = "block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider";

  return (
    <main className="min-h-screen bg-sage-50 pt-32 pb-24 px-6">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sage-100 -skew-x-12 opacity-40"></div>
      </div>

      <div className="max-w-3xl mx-auto relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 bg-sage-100 text-sage-800 rounded-full text-sm font-bold mb-6 tracking-wider uppercase">
            Join BioStack
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Create Your <span className="text-sage-600">Account</span>
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto text-lg">
            Register below to access our premium shop and personalized wellness services. Your application will be reviewed by our team.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-slate-100">
          {status === "success" ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Registration Submitted!</h3>
              <p className="text-slate-600 max-w-md mx-auto mb-6">
                Your application is now pending review. You&apos;ll be able to log in and access the shop once your account has been approved by our team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="px-6 py-3 bg-sage-600 text-white font-bold rounded-xl hover:bg-sage-500 transition-all shadow-lg text-sm tracking-wide"
                >
                  Return Home
                </Link>
                <Link
                  href="/portal"
                  className="px-6 py-3 bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm tracking-wide"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          ) : (
            <>
              {status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-red-700 text-sm text-center font-medium">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>First Name *</label>
                      <input type="text" name="firstName" required placeholder="Jane" value={formData.firstName} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name *</label>
                      <input type="text" name="lastName" required placeholder="Doe" value={formData.lastName} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Email Address *</label>
                      <input type="email" name="email" required placeholder="jane@example.com" value={formData.email} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <input type="tel" name="officePhone" placeholder="+1 (555) 000-0000" value={formData.officePhone} onChange={handlePhoneChange} className={inputClass} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className={labelClass}>Website</label>
                    <input type="url" name="website" placeholder="https://www.example.com" value={formData.website} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Set Your Password
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Password *</label>
                      <input type="password" name="password" required minLength={6} placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Confirm Password *</label>
                      <input type="password" name="confirmPassword" required minLength={6} placeholder="Re-enter password" value={formData.confirmPassword} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Address Information
                    </h3>
                  </div>

                  {/* Billing Address */}
                  <div className="mb-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Billing</p>
                    <div className="space-y-3">
                      <input type="text" placeholder="Street" value={formData.billingAddress.street} onChange={(e) => handleAddressChange("billingAddress", "street", e.target.value)} className={inputClass} />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="City" value={formData.billingAddress.city} onChange={(e) => handleAddressChange("billingAddress", "city", e.target.value)} className={inputClass} />
                        <input type="text" placeholder="State" value={formData.billingAddress.state} onChange={(e) => handleAddressChange("billingAddress", "state", e.target.value)} className={inputClass} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="ZIP Code" value={formData.billingAddress.zip} onChange={(e) => handleAddressChange("billingAddress", "zip", e.target.value)} className={inputClass} />
                        <input type="text" placeholder="Country" value={formData.billingAddress.country} onChange={(e) => handleAddressChange("billingAddress", "country", e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  </div>

                  {/* Copy to Shipping */}
                  <div className="flex justify-end mb-3">
                    <button type="button" onClick={copyBillingToShipping} className="text-sage-600 text-xs font-bold uppercase tracking-wider hover:text-sage-700 transition-colors">
                      Copy Billing to Shipping →
                    </button>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Shipping</p>
                    <div className="space-y-3">
                      <input type="text" placeholder="Street" value={formData.shippingAddress.street} onChange={(e) => handleAddressChange("shippingAddress", "street", e.target.value)} className={inputClass} />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="City" value={formData.shippingAddress.city} onChange={(e) => handleAddressChange("shippingAddress", "city", e.target.value)} className={inputClass} />
                        <input type="text" placeholder="State" value={formData.shippingAddress.state} onChange={(e) => handleAddressChange("shippingAddress", "state", e.target.value)} className={inputClass} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="ZIP Code" value={formData.shippingAddress.zip} onChange={(e) => handleAddressChange("shippingAddress", "zip", e.target.value)} className={inputClass} />
                        <input type="text" placeholder="Country" value={formData.shippingAddress.country} onChange={(e) => handleAddressChange("shippingAddress", "country", e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Additional Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Industry</label>
                      <select name="industry" value={formData.industry} onChange={handleChange} className={inputClass}>
                        {INDUSTRY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} disabled={!opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>About You</label>
                      <textarea name="description" rows={3} placeholder="Tell us about yourself and your wellness goals..." value={formData.description} onChange={handleChange} className={inputClass + " resize-none"} />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full py-4 bg-sage-600 text-white font-bold rounded-xl hover:bg-sage-500 transition-all duration-300 shadow-lg hover:shadow-sage-600/25 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide text-sm"
                >
                  {status === "submitting" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Submitting Registration...
                    </span>
                  ) : "Submit Registration"}
                </button>

                <p className="text-center text-slate-500 text-sm">
                  Already have an account?{" "}
                  <Link href="/portal" className="text-sage-600 font-bold hover:text-sage-700 transition-colors">Sign In</Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
