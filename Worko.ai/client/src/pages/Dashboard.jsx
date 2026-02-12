import { useEffect, useState } from "react";
import API from "../services/api";
import CandidateCard from "../components/CandidateCard";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await API.get("/candidates");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = data.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      c.status?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: data.length,
    pending: data.filter((c) => c.status === "Pending").length,
    reviewed: data.filter((c) => c.status === "Reviewed").length,
    hired: data.filter((c) => c.status === "Hired").length,
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="container" style={{ paddingTop: '2.5rem' }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Candidate Dashboard
            </h1>
            <p className="page-subtitle">
              Manage and track your recruitment pipeline
            </p>
          </div>

          <div className="search-container">
            <svg
              className="search-icon"
              width="20" height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidates..."
              className="search-input"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {[
            { label: "Total Candidates", value: stats.total, color: "bg-indigo", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
            { label: "Pending Review", value: stats.pending, color: "bg-amber", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Reviewed", value: stats.reviewed, color: "bg-blue", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Hired", value: stats.hired, color: "bg-emerald", icon: "M5 13l4 4L19 7" },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-icon ${stat.color}`}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <div>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <div className="animate-spin" style={{ width: '3rem', height: '3rem', borderRadius: '50%', border: '4px solid #f1f5f9', borderTopColor: 'var(--primary)' }}></div>
          </div>
        ) : filtered.length > 0 ? (
          <div className="card-grid">
            {filtered.map((c) => (
              <CandidateCard key={c._id} c={c} refresh={fetchCandidates} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon-box">
              <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="candidate-name" style={{ marginBottom: '0.5rem' }}>No candidates found</h3>
            <p className="page-subtitle" style={{ fontSize: '0.875rem' }}>
              {search ? `We couldn't find any results for "${search}"` : "Start growing your team by adding your first candidate!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
