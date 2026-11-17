
import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000";
const STATUSES = ["New", "Contacted", "Qualified", "Converted", "Rejected"];

function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null);

  const isDashboard = window.location.pathname === "/admin/dashboard";

  const fetchLeads = async (authToken) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        setToken("");
        window.location.href = "/admin";
        return;
      }

      if (!response.ok) throw new Error(result.message || "Could not load leads");

      setLeads(Array.isArray(result) ? result : result.leads || result.data || []);
    } catch (err) {
      setError(err.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isDashboard) fetchLeads(token);
  }, [token, isDashboard]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const result = await response.json();

      if (!response.ok || !result.token) {
        throw new Error(result.message || "Invalid email or password");
      }

      localStorage.setItem("adminToken", result.token);
      setToken(result.token);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.message === "Failed to fetch" ? "Backend server is not running." : err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setError("");
      const response = await fetch(`${API_URL}/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Update failed");

      setLeads((old) => old.map((lead) =>
        lead._id === id ? { ...lead, ...result, status } : lead
      ));
      setSelectedLead((old) => old?._id === id ? { ...old, ...result, status } : old);
      setSuccess("Lead status updated successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead permanently?")) return;

    try {
      const response = await fetch(`${API_URL}/api/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Delete failed");

      setLeads((old) => old.filter((lead) => lead._id !== id));
      setSelectedLead(null);
      setSuccess("Lead deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const term = search.toLowerCase();
      const matchesSearch =
        (lead.name || "").toLowerCase().includes(term) ||
        (lead.email || "").toLowerCase().includes(term);
      const matchesStatus = filter === "All" || (lead.status || "New") === filter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, filter]);

  const exportCSV = () => {
    if (!leads.length) {
      setError("There are no leads to export.");
      return;
    }

    const columns = ["Name", "Email", "Service", "Budget", "Timeline", "Message", "Status"];
    const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = leads.map((lead) => [
      lead.name, lead.email, lead.service, lead.budget,
      lead.timeline, lead.message, lead.status || "New",
    ]);

    const csv = [columns, ...rows].map((row) => row.map(escapeCSV).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cynbit-leads.csv";
    link.click();
    URL.revokeObjectURL(url);
    setSuccess("CSV exported successfully.");
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  if (!isDashboard || !token) {
    return (
      <div className="admin-page">
        <style>{styles}</style>
        <form className="admin-card" onSubmit={handleLogin}>
          <div className="admin-logo">CYNBIT<span>.</span></div>
          <p className="admin-label">ADMIN PORTAL</p>
          <h1>Welcome back</h1>
          <p className="description">Sign in to manage your project inquiries.</p>
          <label>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@cynbit.com" required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In →"}</button>
          <a href="/" className="back-link">← Back to website</a>
        </form>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <style>{styles}</style>

      <header className="topbar">
        <div className="admin-logo">CYNBIT<span>.</span></div>
        <div className="top-actions">
          <span>Admin Dashboard</span>
          <button className="logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        <div className="heading-row">
          <div>
            <p className="admin-label">OVERVIEW</p>
            <h1>Project Inquiries</h1>
            <p className="description">Manage and track your project leads.</p>
          </div>
          <div className="heading-actions">
            <button className="export" onClick={exportCSV}>↓ Export CSV</button>
            <button className="refresh" onClick={() => fetchLeads(token)}>↻ Refresh</button>
          </div>
        </div>

        <div className="stats">
          <div className="stat"><span>Total Leads</span><h2>{leads.length}</h2></div>
          <div className="stat"><span>New Leads</span><h2>{leads.filter(l => (l.status || "New") === "New").length}</h2></div>
          <div className="stat"><span>Contacted</span><h2>{leads.filter(l => l.status === "Contacted").length}</h2></div>
          <div className="stat"><span>Converted</span><h2>{leads.filter(l => l.status === "Converted").length}</h2></div>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <section className="leads-panel">
          <div className="panel-heading">
            <h2>All Inquiries ({filteredLeads.length})</h2>
            <div className="filters">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email..." />
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                {STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
          </div>

          {loading ? <p>Loading leads...</p> : filteredLeads.length === 0 ? (
            <p className="empty">No matching inquiries found.</p>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Service</th><th>Budget</th>
                    <th>Status</th><th>Details</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead._id}>
                      <td>{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.service || "-"}</td>
                      <td>{lead.budget || "-"}</td>
                      <td>
                        <select value={lead.status || "New"} onChange={(e) => updateStatus(lead._id, e.target.value)}>
                          {STATUSES.map((status) => <option key={status}>{status}</option>)}
                        </select>
                      </td>
                      <td><button className="details" onClick={() => setSelectedLead(lead)}>View Details</button></td>
                      <td><button className="delete" onClick={() => deleteLead(lead._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedLead && (
          <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
            <section className="detail-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close" onClick={() => setSelectedLead(null)}>×</button>
              <p className="admin-label">LEAD DETAILS</p>
              <h2>{selectedLead.name || "Unnamed Lead"}</h2>
              <div className="detail-grid">
                <div><small>Email</small><p>{selectedLead.email || "-"}</p></div>
                <div><small>Service</small><p>{selectedLead.service || "-"}</p></div>
                <div><small>Budget</small><p>{selectedLead.budget || "-"}</p></div>
                <div><small>Timeline</small><p>{selectedLead.timeline || "-"}</p></div>
                <div><small>Status</small><p>{selectedLead.status || "New"}</p></div>
                <div className="full-detail"><small>Message</small><p>{selectedLead.message || "No message provided."}</p></div>
              </div>
              <button className="modal-button" onClick={() => setSelectedLead(null)}>Close Details</button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = `
* { box-sizing:border-box; }
.admin-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; background:#10110f; color:white; font-family:Arial,sans-serif; }
.admin-card { width:100%; max-width:420px; padding:40px; background:#191b18; border:1px solid #30332e; border-radius:16px; }
.admin-logo { font-size:28px; font-weight:bold; color:white; }
.admin-logo span { color:#b8f34a; }
.admin-label { color:#b8f34a; letter-spacing:3px; font-size:12px; }
.admin-card h1,.heading-row h1 { font-size:32px; color:white; }
.description { color:#aaa; line-height:1.6; }
.admin-card label { display:block; margin:20px 0 8px; color:white; }
.admin-card input { width:100%; padding:14px; background:#10110f; border:1px solid #393d36; border-radius:8px; color:white; }
.admin-card button { width:100%; padding:15px; margin-top:25px; background:#b8f34a; border:0; border-radius:8px; font-weight:bold; cursor:pointer; }
.back-link { display:block; text-align:center; margin-top:25px; color:#b8f34a; text-decoration:none; }
.error { color:#ff7777; } .success { color:#b8f34a; }
.dashboard { min-height:100vh; background:#10110f; color:white; font-family:Arial,sans-serif; }
.topbar { padding:22px 5%; border-bottom:1px solid #30332e; display:flex; justify-content:space-between; align-items:center; }
.top-actions { display:flex; align-items:center; gap:20px; }
.logout,.delete,.details { padding:10px 16px; border:0; border-radius:6px; cursor:pointer; font-weight:bold; }
.logout,.export,.refresh,.modal-button { background:#b8f34a; color:#10110f; }
.main-content { padding:40px 5%; }
.heading-row { display:flex; justify-content:space-between; align-items:center; gap:20px; flex-wrap:wrap; }
.heading-actions { display:flex; gap:10px; flex-wrap:wrap; }
.export,.refresh { padding:13px 20px; border:0; border-radius:7px; cursor:pointer; font-weight:bold; }
.stats { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; margin:30px 0; }
.stat,.leads-panel { background:#191b18; border:1px solid #30332e; border-radius:12px; padding:22px; }
.stat span { color:#aaa; } .stat h2 { font-size:30px; color:#b8f34a; }
.panel-heading { display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; }
.panel-heading h2 { margin:0; }
.filters { display:flex; gap:10px; flex-wrap:wrap; }
.filters input,.filters select,.table-scroll select { padding:11px; background:#10110f; color:white; border:1px solid #444; border-radius:6px; }
.table-scroll { overflow-x:auto; margin-top:20px; }
table { width:100%; min-width:850px; border-collapse:collapse; }
th,td { padding:14px; text-align:left; border-bottom:1px solid #30332e; font-size:13px; }
th { color:#b8f34a; }
.delete { background:#e34b4b; color:white; }
.details { background:#303b25; color:#b8f34a; }
.empty { color:#aaa; padding:20px 0; }
.modal-overlay { position:fixed; inset:0; background:#000b; display:flex; align-items:center; justify-content:center; padding:20px; z-index:1000; }
.detail-modal { width:100%; max-width:600px; padding:30px; border:1px solid #3c4434; border-radius:16px; background:#191b18; position:relative; }
.detail-modal h2 { font-size:28px; }
.close { position:absolute; top:15px; right:18px; background:transparent; border:0; color:white; font-size:30px; cursor:pointer; }
.detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:25px 0; }
.detail-grid small { color:#b8f34a; }
.detail-grid p { overflow-wrap:anywhere; color:#eee; }
.full-detail { grid-column:1/-1; }
.modal-button { padding:12px 20px; border:0; border-radius:7px; cursor:pointer; font-weight:bold; }
@media(max-width:800px) { .stats { grid-template-columns:repeat(2,1fr); } .main-content { padding:25px 4%; } }
@media(max-width:480px) { .stats { grid-template-columns:1fr; } .admin-card { padding:28px 22px; } .detail-grid { grid-template-columns:1fr; } .full-detail { grid-column:auto; } }
`;

export default Admin;
