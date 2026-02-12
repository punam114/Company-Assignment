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

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending": return "status-pending";
      case "Reviewed": return "status-reviewed";
      case "Hired": return "status-hired";
      default: return "";
    }
  };

  return (
    <div className="candidate-card">
      <div className={`status-badge ${getStatusClass(c.status)}`}>
        {c.status}
      </div>

      <div className="candidate-info">
        <div className="avatar-placeholder">
          {c.name.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="candidate-name truncate">
            {c.name}
          </h3>
          <p className="candidate-job truncate">
            {c.jobTitle}
          </p>
        </div>
      </div>

      <div className="contact-info">
        <div className="contact-item">
          <div className="contact-icon-box">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <span className="truncate">{c.email}</span>
        </div>

        <div className="contact-item">
          <div className="contact-icon-box">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <span className="truncate">{c.phone}</span>
        </div>
      </div>

      <div className="status-select-container">
        <label className="status-select-label">
          Change Pipeline Status
        </label>
        <select
          value={c.status}
          onChange={changeStatus}
          className="status-select"
        >
          <option>Pending</option>
          <option>Reviewed</option>
          <option>Hired</option>
        </select>
        <div className="select-caret">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
