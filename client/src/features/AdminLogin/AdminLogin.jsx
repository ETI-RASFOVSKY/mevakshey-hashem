import React, { useState } from "react";
import "./AdminLogin.css";
import { API_BASE_URL, setAuthToken } from "../../config";

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "שגיאה בהתחברות");
        setLoading(false);
        return;
      }

      // שמירת token
      if (data.token) {
        setAuthToken(data.token);
        onLogin(true); // סימון שהמנהל מחובר
      } else {
        setError("שגיאה בהתחברות - לא התקבל token");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("שגיאה בחיבור לשרת");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminLoginContainer">
      <form onSubmit={handleLogin} className="adminLoginForm">
        <h2>כניסת מנהל</h2>
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "מתחבר..." : "התחבר"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;
