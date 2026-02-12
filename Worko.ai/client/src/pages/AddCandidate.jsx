import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AddCandidate() {
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async () => {
    if (!form.name || !form.email || !form.jobTitle) {
      return setError("Required fields: Name, Email, and Job Title");
    }
    setLoading(true);
    try {
      setError("");
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      if (file) fd.append("resume", file);

      await API.post("/candidates", fd);
      nav("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add candidate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page">
      <Navbar />
      <div className="container" style={{ paddingTop: '3rem' }}>
        <div className="form-card">
          <div className="form-header">
            <div className="form-header-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h1 className="auth-title">
                Add New Candidate
              </h1>
              <p className="auth-subtitle">
                Expand your talent pipeline with fresh referrals
              </p>
            </div>
          </div>

          {error && (
            <div className="error-alert">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@company.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input
                type="text"
                onChange={(e) =>
                  setForm({ ...form, jobTitle: e.target.value })
                }
                placeholder="Senior Engineer"
                className="form-input"
              />
            </div>

            <div className="col-span-full">
              <label className="form-label">Professional Resume</label>
              <label className="upload-area">
                <div className="upload-icon-box">
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontWeight: '700', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                    {file ? file.name : "Drop candidate resume here"}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    PDF documents preferred
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="submit-btn"
            style={{ width: '100%', marginTop: '3rem', padding: '1.25rem' }}
          >
            {loading ? (
              <div className="animate-spin" style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', border: '3px solid white', borderTopColor: 'transparent' }}></div>
            ) : (
              <>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Register Candidate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
