import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "100vh", paddingBottom: "40px", boxSizing: "border-box" }}>
      <h2>Welcome to PopX</h2>
      <p className="subtitle" style={{ marginBottom: "30px", color: "#8c9096", lineHeight: "1.5" }}>Lorem ipsum dolor sit amet,<br/>consectetur adipiscing elit.</p>
      
      <button onClick={() => navigate("/register")} style={{ marginBottom: "10px" }}>Create Account</button>
      <button className="secondary" style={{ marginBottom: "0" }} onClick={() => navigate("/login")}>Already Registered? Login</button>
    </div>
  );
}