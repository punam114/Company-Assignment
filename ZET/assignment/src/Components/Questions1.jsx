import { use, useState } from "react";

export function Authentication() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setEmail("");
    setPassword("");
    setLoading(true);

    try {
      let res = await fetch(
        "https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password: password.trim(),
          }),
        }
      );

      if (!res.ok) {
        setError("invalid email or password");
      }

      let data = await res.json();
      if (data.token) {
        setToken(data.token);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <div style={{border:"1px solid" , padding:"20px"}}>
        <h2>First Assignment</h2>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter email"
        />
        <br></br>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter password"
        />
        <br></br>
        <button type="submit" disabled={loading}>
          Login
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {token && (
        <div>
          <h3>Login Successfull</h3>
          <p style={{ color: "green" }}>
            <strong>Token</strong>
            {token}
          </p>
        </div>
      )}
      </div>
    </>
  );
}
