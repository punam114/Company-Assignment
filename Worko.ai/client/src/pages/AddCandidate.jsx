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
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-indigo-500/5 p-10 md:p-14">
          <div className="flex items-center gap-6 mb-12 pb-12 border-b border-gray-50">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
                Add New Candidate
              </h1>
              <p className="text-gray-500 font-medium">
                Expand your talent pipeline with fresh referrals
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-10 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2.5 ml-1 group-focus-within:text-indigo-600 transition-colors">
                Full Name
              </label>
              <input
                type="text"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300 font-medium"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2.5 ml-1 group-focus-within:text-indigo-600 transition-colors">
                Email Address
              </label>
              <input
                type="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@company.com"
                className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300 font-medium"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2.5 ml-1 group-focus-within:text-indigo-600 transition-colors">
                Phone Number
              </label>
              <input
                type="tel"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300 font-medium"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2.5 ml-1 group-focus-within:text-indigo-600 transition-colors">
                Job Title
              </label>
              <input
                type="text"
                onChange={(e) =>
                  setForm({ ...form, jobTitle: e.target.value })
                }
                placeholder="Senior Engineer"
                className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                Professional Resume
              </label>
              <label className="relative group/upload block p-10 border-2 border-dashed border-gray-200 rounded-[2rem] text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-500">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-[1.25rem] flex items-center justify-center text-gray-400 group-hover/upload:text-indigo-500 group-hover/upload:bg-white group-hover/upload:scale-110 transition-all duration-500 shadow-sm">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900 text-lg mb-1 group-hover/upload:text-indigo-600 transition-colors">
                      {file ? file.name : "Drop candidate resume here"}
                    </span>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                      PDF documents preferred
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-gray-50">
            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all duration-300 shadow-xl shadow-gray-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Register Candidate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
