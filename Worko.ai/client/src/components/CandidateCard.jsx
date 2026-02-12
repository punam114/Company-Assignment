import API from "../services/api";

export default function CandidateCard({ c, refresh }) {
  const changeStatus = async (e) => {
    try {
      await API.put(`/candidates/${c._id}/status`, {
        status: e.target.value,
      });
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10";
      case "Reviewed":
        return "bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/10";
      case "Hired":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/10";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100 ring-gray-500/10";
    }
  };

  return (
    <div className="group relative bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 overflow-hidden">
      <div className="absolute top-0 right-0 p-6">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ring-4 ring-offset-0 ${getStatusStyles(
            c.status
          )}`}
        >
          {c.status}
        </span>
      </div>

      <div className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl shadow-inner">
            {c.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
              {c.name}
            </h3>
            <p className="text-gray-500 font-medium text-sm truncate">
              {c.jobTitle}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-50 group-hover:bg-white group-hover:border-gray-100 transition-all">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-indigo-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="truncate">{c.email}</span>
          </div>

          <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-50 group-hover:bg-white group-hover:border-gray-100 transition-all">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-indigo-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="truncate">{c.phone}</span>
          </div>
        </div>

        <div className="relative">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Change Pipeline Status
          </label>
          <select
            value={c.status}
            onChange={changeStatus}
            className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer hover:bg-white"
          >
            <option>Pending</option>
            <option>Reviewed</option>
            <option>Hired</option>
          </select>
          <div className="absolute right-4 bottom-3.5 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
