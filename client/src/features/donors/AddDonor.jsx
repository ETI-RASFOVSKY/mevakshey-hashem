import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { addUser } from "./DonorSlice";

const AddDonor = () => {
  const dispatch = useDispatch();

  const [newUser, setNewUser] = useState({
    fname: "",
    lname: "",
    Email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!newUser.fname || !newUser.Email) {
      alert("נא למלא את כל השדות המסומנים ב-*");
      return;
    }
    try {
      await dispatch(addUser(newUser)).unwrap(); // unwrap כדי לקבל הצלחה/כישלון ישיר
      alert("משתמש נוסף בהצלחה");
      setNewUser({
        fname: "",
        lname: "",
        Email: "",
      });
      console.log("After reset:", newUser);
    } catch (error) {
      alert("שגיאה בהוספת המשתמש: " + error.message);
    }
  };

  return (
    <div>
      <TextField
        label="שם פרטי *"
        type="text"
        name="fname"
        value={newUser.fname}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="מייל *"
        type="email"
        name="Email"
        value={newUser.Email}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSave}>
        הוסף משתמש
      </Button>
    </div>
  );
};

export default AddDonor;
