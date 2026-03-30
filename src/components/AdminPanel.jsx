"use client";
import React, { useState, useEffect } from "react";

export default function AdminPanel({ adminEmail, onSignOut }) {
    const [registrations, setRegistrations] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState(null);
    const [actionResult, setActionResult] = useState({});
    const [activeSubTab, setActiveSubTab] = useState("registrations"); // registrations | clients

    // Client Directory specific state
    const [clientSearch, setClientSearch] = useState("");
    const [clientFilter, setClientFilter] = useState("all");
    const [clientSort, setClientSort] = useState("newest");

    useEffect(() => {
        fetchRegistrations();
        fetchClients();
    }, []);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/registrations");
            const data = await res.json();
            if (data.success) setRegistrations(data.data || []);
        } catch { }
        setLoading(false);
    };

    const fetchClients = async () => {
        try {
            const res = await fetch("/api/admin/clients");
            const data = await res.json();
            if (data.success) setClients(data.data || []);
        } catch { }
    };

    const handleAction = async (regId, action) => {
        setActionLoading(regId);
        try {
            const res = await fetch("/api/admin/registrations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registrationId: regId, action }),
            });
            const data = await res.json();
            setActionResult((prev) => ({ ...prev, [regId]: data.success ? action + "d" : (data.error || "failed") }));
            if (data.success) {
                await fetchRegistrations();
                await fetchClients();
            }
        } catch {
            setActionResult((prev) => ({ ...prev, [regId]: "error" }));
        }
        setActionLoading(null);
    };

    const handlePushCrm = async (regId) => {
        setActionLoading(`crm-${regId}`);
        try {
            const res = await fetch("/api/admin/registrations/push-crm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registrationId: regId }),
            });
            const data = await res.json();
            setActionResult((prev) => ({ ...prev, [`crm-${regId}`]: data.success ? "pushed" : (data.error || "failed") }));
            if (data.success) await fetchRegistrations();
        } catch {
            setActionResult((prev) => ({ ...prev, [`crm-${regId}`]: "error" }));
        }
        setActionLoading(null);
    };

    const handleResetPassword = async (clientEmail) => {
        setActionLoading(`reset-${clientEmail}`);
        try {
            const res = await fetch("/api/admin/clients", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: clientEmail }),
            });
            const data = await res.json();
            setActionResult((prev) => ({ ...prev, [`reset-${clientEmail}`]: data.success ? "reset_enabled" : (data.error || "failed") }));
            if (data.success) await fetchClients();
        } catch {
            setActionResult((prev) => ({ ...prev, [`reset-${clientEmail}`]: "error" }));
        }
        setActionLoading(null);
    };

    const handleDeleteClient = async (clientId, clientEmail) => {
        if (!confirm(`Are you sure you want to permanently delete ${clientEmail}? This cannot be undone.`)) return;
        setActionLoading(`del-${clientId}`);
        try {
            const res = await fetch("/api/admin/clients", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clientId }),
            });
            const data = await res.json();
            setActionResult((prev) => ({ ...prev, [`del-${clientId}`]: data.success ? "deleted" : (data.error || "failed") }));
            if (data.success) await fetchClients();
        } catch {
            setActionResult((prev) => ({ ...prev, [`del-${clientId}`]: "error" }));
        }
        setActionLoading(null);
    };

    const handleResetRegistration = async (regId) => {
        if (!confirm("Reset this registration back to pending? The admin will need to re-approve it.")) return;
        setActionLoading(`rpend-${regId}`);
        try {
            const res = await fetch("/api/admin/registrations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registrationId: regId, action: "reset" }),
            });
            const data = await res.json();
            setActionResult((prev) => ({ ...prev, [`rpend-${regId}`]: data.success ? "reset" : (data.error || "failed") }));
            if (data.success) await fetchRegistrations();
        } catch {
            setActionResult((prev) => ({ ...prev, [`rpend-${regId}`]: "error" }));
        }
        setActionLoading(null);
    };

    const filteredRegs = filter === "all" ? registrations : registrations.filter((r) => r.status === filter);

    const statusBadge = (status) => {
        const colors = {
            pending: "bg-amber-50 text-amber-700 border-amber-200",
            approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
            rejected: "bg-red-50 text-red-700 border-red-200",
        };
        return `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${colors[status] || ""}`;
    };

    const filteredSortedClients = clients
        .filter((c) => {
            if (clientFilter === "reset_req" && !c.passwordResetRequested) return false;
            if (clientFilter === "reset_active" && !c.passwordResetMode) return false;
            
            if (clientSearch) {
                const searchLower = clientSearch.toLowerCase();
                return (
                    (c.name && c.name.toLowerCase().includes(searchLower)) ||
                    (c.email && c.email.toLowerCase().includes(searchLower))
                );
            }
            return true;
        })
        .sort((a, b) => {
            if (clientSort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (clientSort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
            if (clientSort === "name_asc") return (a.name || "").localeCompare(b.name || "");
            if (clientSort === "name_desc") return (b.name || "").localeCompare(a.name || "");
            return 0;
        });

    return (
        <>
            {/* Admin Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Admin Panel</h2>
                    <p className="text-slate-500 text-sm">{adminEmail}</p>
                </div>
                <button onClick={onSignOut} className="text-slate-400 hover:text-slate-600 text-xs font-medium tracking-wide transition-colors flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Sign Out
                </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-2 mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-slate-100">
                <button onClick={() => setActiveSubTab("registrations")}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 ${activeSubTab === "registrations" ? "bg-sage-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}>
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Registrations
                        {registrations.filter(r => r.status === "pending").length > 0 && (
                            <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{registrations.filter(r => r.status === "pending").length}</span>
                        )}
                    </span>
                </button>
                <button onClick={() => setActiveSubTab("clients")}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 ${activeSubTab === "clients" ? "bg-sage-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}>
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Client Directory
                        {clients.filter(c => c.passwordResetRequested).length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{clients.filter(c => c.passwordResetRequested).length}</span>
                        )}
                    </span>
                </button>
            </div>

            {/* REGISTRATIONS TAB */}
            {activeSubTab === "registrations" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    {/* Filter */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {["all", "pending", "approved", "rejected"].map((f) => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? "bg-sage-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                                {f} {f !== "all" && `(${registrations.filter(r => r.status === f).length})`}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="animate-pulse h-20 bg-slate-50 rounded-xl" />)}</div>
                    ) : filteredRegs.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500">No registrations found.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredRegs.map((reg) => (
                                <div key={reg._id} className="border border-slate-100 rounded-xl p-5 hover:border-sage-200 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-900">{reg.firstName} {reg.lastName}</h4>
                                                <span className={statusBadge(reg.status)}><span className="w-1.5 h-1.5 rounded-full bg-current"></span>{reg.status}</span>
                                            </div>
                                            <p className="text-slate-500 text-sm">{reg.email}</p>
                                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                                                {reg.officePhone && <span>📞 {reg.officePhone}</span>}
                                                {reg.industry && <span>🏢 {reg.industry}</span>}
                                                {reg.website && <span>🌐 {reg.website}</span>}
                                                <span>📅 {new Date(reg.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            {reg.description && <p className="text-slate-500 text-xs mt-2 italic">&quot;{reg.description}&quot;</p>}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {reg.status === "pending" && (
                                                <>
                                                    <button onClick={() => handleAction(reg._id, "approve")} disabled={actionLoading === reg._id}
                                                        className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors disabled:opacity-50">
                                                        {actionLoading === reg._id ? "..." : "✓ Approve"}
                                                    </button>
                                                    <button onClick={() => handleAction(reg._id, "reject")} disabled={actionLoading === reg._id}
                                                        className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50">
                                                        {actionLoading === reg._id ? "..." : "✕ Reject"}
                                                    </button>
                                                </>
                                            )}
                                            {reg.status === "approved" && !reg.crmAccountId && (
                                                <button onClick={() => handlePushCrm(reg._id)} disabled={actionLoading === `crm-${reg._id}`}
                                                    className="px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors disabled:opacity-50">
                                                    {actionLoading === `crm-${reg._id}` ? "Pushing..." : "Push to CRM"}
                                                </button>
                                            )}
                                            {reg.crmAccountId && (
                                                <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    In CRM
                                                </span>
                                            )}
                                            {reg.status !== "pending" && (
                                                <button onClick={() => handleResetRegistration(reg._id)} disabled={actionLoading === `rpend-${reg._id}`}
                                                    className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors disabled:opacity-50">
                                                    {actionLoading === `rpend-${reg._id}` ? "..." : "↩ Reset to Pending"}
                                                </button>
                                            )}
                                            {actionResult[reg._id] && <span className="text-xs text-slate-400">{actionResult[reg._id]}</span>}
                                            {actionResult[`crm-${reg._id}`] && <span className="text-xs text-slate-400">{actionResult[`crm-${reg._id}`]}</span>}
                                            {actionResult[`rpend-${reg._id}`] && <span className="text-xs text-slate-400">{actionResult[`rpend-${reg._id}`]}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* CLIENTS TAB */}
            {activeSubTab === "clients" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search clients by name or email..."
                            value={clientSearch}
                            onChange={(e) => setClientSearch(e.target.value)}
                            className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                        />
                        <select
                            value={clientFilter}
                            onChange={(e) => setClientFilter(e.target.value)}
                            className="px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
                        >
                            <option value="all">All Statuses</option>
                            <option value="reset_req">Reset Requested</option>
                            <option value="reset_active">Reset Active</option>
                        </select>
                        <select
                            value={clientSort}
                            onChange={(e) => setClientSort(e.target.value)}
                            className="px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name_asc">Name (A-Z)</option>
                            <option value="name_desc">Name (Z-A)</option>
                        </select>
                    </div>
                
                    <div className="text-sm text-slate-500 font-medium mb-4">
                        Showing {filteredSortedClients.length} of {clients.length} client{clients.length !== 1 ? "s" : ""}
                    </div>
                    
                    {filteredSortedClients.length === 0 ? (
                        <div className="text-center py-12"><p className="text-slate-500">No clients match your filter.</p></div>
                    ) : (
                        <div className="space-y-3">
                            {filteredSortedClients.map((c) => (
                                <div key={c._id} className="border border-slate-100 rounded-xl p-5 hover:border-sage-200 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-900">{c.name}</h4>
                                                {c.passwordResetRequested && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                                                        Reset Requested
                                                    </span>
                                                )}
                                                {c.passwordResetMode && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200">
                                                        Reset Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-500 text-sm">{c.email}</p>
                                            <p className="text-slate-400 text-xs mt-1">Joined {new Date(c.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {(c.passwordResetRequested && !c.passwordResetMode) && (
                                                <button onClick={() => handleResetPassword(c.email)} disabled={actionLoading === `reset-${c.email}`}
                                                    className="px-3 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors disabled:opacity-50">
                                                    {actionLoading === `reset-${c.email}` ? "..." : "Allow Reset"}
                                                </button>
                                            )}
                                            {!c.passwordResetRequested && !c.passwordResetMode && (
                                                <button onClick={() => handleResetPassword(c.email)} disabled={actionLoading === `reset-${c.email}`}
                                                    className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors disabled:opacity-50">
                                                    {actionLoading === `reset-${c.email}` ? "..." : "Force Reset"}
                                                </button>
                                            )}
                                            {c.passwordResetMode && (
                                                <span className="text-amber-600 text-xs font-bold">Awaiting new password</span>
                                            )}
                                            <button onClick={() => handleDeleteClient(c._id, c.email)} disabled={actionLoading === `del-${c._id}`}
                                                className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50">
                                                {actionLoading === `del-${c._id}` ? "..." : "Delete"}
                                            </button>
                                            {actionResult[`reset-${c.email}`] === "reset_enabled" && (
                                                <span className="text-emerald-600 text-xs font-bold">✓ Enabled</span>
                                            )}
                                            {actionResult[`del-${c._id}`] === "deleted" && (
                                                <span className="text-red-600 text-xs font-bold">Deleted</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
