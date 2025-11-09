import { useState } from "react";
import "./MessageForm.css";

const Message = () => {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // שולח רק את תוכן ההודעה (content)
      const res = await fetch("http://localhost:3000/api/messages/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: formData.message,
        }),
      });

      if (res.ok) {
        console.log("הודעה נשלחה בהצלחה!");
        setSuccess("הודעה נשלחה בהצלחה!");
        setFormData({ name: "", message: "" });
      } else {
        const data = await res.json();
        setError(data.error || "שגיאה בשליחה");
      }
    } catch (err) {
      setError("שגיאת רשת, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", message: "" });
    setError("");
    setSuccess("");
  };

  return (
    <div className="message-form">
      <h2>שליחת הודעה למערכת</h2>

      {loading && <p>טוען...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        {/* שדה שם לא חובה, אפשר להסיר אם לא צריך
        <input
          type="text"
          name="name"
          placeholder="שם (לא חובה)"
          value={formData.name}
          onChange={handleChange}
          disabled
        /> */}
        <textarea
          name="message"
          placeholder="כתוב את ההודעה כאן..."
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          שלח הודעה
        </button>
        <button type="button" onClick={handleReset} disabled={loading}>
          איפוס
        </button>
      </form>
    </div>
  );
};

export default Message;
