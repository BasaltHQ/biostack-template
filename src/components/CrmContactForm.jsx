"use client";
import React, { useState } from "react";

const FORM_SLUG = "peptide-shop-contact-form-4dfe8595";
const API_ENDPOINT = "https://crm.basalthq.com/api/forms/submit";

const INQUIRY_OPTIONS = [
  { value: "", label: "Select Inquiry Type" },
  { value: "product_info", label: "Product Information" },
  { value: "bulk_wholesale", label: "Bulk / Wholesale Order" },
  { value: "custom_formulation", label: "Custom Formulation" },
  { value: "technical_question", label: "Technical Question" },
  { value: "coaching", label: "Coaching / Consultation" },
  { value: "other", label: "Other" },
];

export default function CrmContactForm({ heading, subtitle }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    inquiry_type: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const body = new FormData();
      Object.entries(formData).forEach(([k, v]) => body.append(k, v));
      body.append("form_slug", FORM_SLUG);
      body.append("source_url", window.location.href);
      if (document.referrer) body.append("referrer", document.referrer);

      const params = new URLSearchParams(window.location.search);
      if (params.has("utm_source")) body.append("utm_source", params.get("utm_source"));
      if (params.has("utm_medium")) body.append("utm_medium", params.get("utm_medium"));
      if (params.has("utm_campaign")) body.append("utm_campaign", params.get("utm_campaign"));

      const res = await fetch(API_ENDPOINT, { method: "POST", body });
      const result = await res.json();

      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(result.error || "Submission failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Failed to connect. Please try again.");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-sage-500 focus:bg-white focus:ring-2 focus:ring-sage-200 outline-none transition-all text-slate-900 text-sm";

  return (
    <section id="contact" className="py-24 bg-sage-50 border-t border-sage-100">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">
            {heading || "Get In Touch"}
          </h2>
          <p className="text-slate-600">
            {subtitle || "Start your journey to limitless potential today."}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {status === "success" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Thank you!</h3>
              <p className="text-slate-600">We&apos;ve received your message and will get back to you shortly.</p>
            </div>
          ) : (
            <>
              {status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-red-700 text-sm text-center font-medium">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                    <input type="text" name="full_name" required placeholder="Your Full Name"
                      value={formData.full_name} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                    <input type="email" name="email" required placeholder="researcher@institution.com"
                      value={formData.email} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact Phone</label>
                    <input type="tel" name="phone" placeholder="+1 (555) 123-4567"
                      value={formData.phone} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Institution / Company</label>
                    <input type="text" name="company" placeholder="Research University / Biotech Company"
                      value={formData.company} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Inquiry Type *</label>
                  <select name="inquiry_type" required value={formData.inquiry_type} onChange={handleChange} className={inputClass}>
                    {INQUIRY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} disabled={!opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Message *</label>
                  <textarea name="message" rows={4} required
                    placeholder="Describe your peptide research needs, specific product inquiries, or technical questions in detail..."
                    value={formData.message} onChange={handleChange} className={inputClass} />
                </div>

                <button type="submit" disabled={status === "submitting"}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transform hover:-translate-y-1 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:transform-none">
                  {status === "submitting" ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
