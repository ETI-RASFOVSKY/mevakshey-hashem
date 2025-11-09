import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../donors/DonorSlice";
import "./FooterForm.css";

const FooterForm = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ fname: "", Email: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({ fname: "", Email: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setSuccessMessage("");
  };

  const handleSend = () => {
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
    dispatch(addUser({ fname: formData.fname, Email: formData.Email }));
    setFormData({ fname: "", Email: "" });
    setSuccessMessage("נרשמת בהצלחה");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
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
          <button className="sendEmail" onClick={handleSend}>
            שלח
          </button>
        </div>

        {successMessage && (
          <div className="successMessage">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default FooterForm;
