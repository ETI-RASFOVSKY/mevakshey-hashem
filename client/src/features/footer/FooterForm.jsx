import React, { useState } from "react";
import "./FooterForm.css";
import { API_BASE_URL } from "../../config";

const FooterForm = () => {
  const [formData, setFormData] = useState({ fname: "", Email: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ fname: "", Email: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setSuccessMessage("");
    setServerError("");
  };

  const handleSend = async () => {
    let newErrors = { fname: "", Email: "" };
    let hasError = false;

    if (!formData.fname) {
      newErrors.fname = "נא למלא שם";
      hasError = true;
    }

    if (!formData.Email) {
      newErrors.Email = "נא למלא מייל";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({ fname: "", Email: "" });
    setServerError("");

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || "שגיאה בשליחת הפרטים");
        return;
      }

      setFormData({ fname: "", Email: "" });
      setSuccessMessage(data.message || "נרשמת בהצלחה");

      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (err) {
      console.error("Subscribe error:", err);
      setServerError("שגיאה בשליחת הנתונים. נסה שוב מאוחר יותר.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <h2 className="formTitle">להצטרפות לניוזלטר</h2>
      <div className="formFields">
        <div>
          <label>הכנס שם</label>
          {errors.fname && <div className="errorMessage">{errors.fname}</div>}
          <input
            type="text"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>הכנס מייל</label>
          {errors.Email && <div className="errorMessage">{errors.Email}</div>}
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
          />
        </div>
        <div>
          <button className="sendEmail" onClick={handleSend} disabled={loading}>
            {loading ? "שולח..." : "שלח"}
          </button>
        </div>

        {serverError && (
          <div className="errorMessage" style={{ textAlign: "center" }}>
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="successMessage">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default FooterForm;
