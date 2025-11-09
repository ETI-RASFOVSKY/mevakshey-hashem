import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { FormControlLabel, Checkbox } from "@mui/material";
import { updateUser } from "./DonorSlice"; // ✔ זה נשאר



const EditDonor = ({ editUser, onClose }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(editUser || {});
    const currentUser = useSelector((state) => state.users.current_user); // שליפה מ־Redux


    useEffect(() => {
      setUser(editUser);
    }, [editUser]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setUser({
        ...user,
        [name]: value,
      });
    };

    const handleSave = () => {
      dispatch(updateUser(user)); // עדכון המשתמש ב-Redux
      onClose(); // סוגר את החלון אחרי שמירת השינויים
    };
    return (
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>ערוך משתמש</DialogTitle>
        <DialogContent>
          {/* <TextField 
            label="תעודת זהות"
            type="text"
            name="id"
            value={user.id || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={currentUser?.role === "student"} // disable אם המשתמש הוא תלמידה
          /> */}
          <TextField 
            label="שם פרטי"
            type="text"
            name="fname"
            value={user.fname || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={currentUser?.role === "student"} // disable אם המשתמש הוא תלמידה
          />
          {/* <TextField 
            label="שם משפחה"
            type="text"
            name="lname"
            value={user.lname || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={currentUser?.role === "student"} // disable אם המשתמש הוא תלמידה
          /> */}
         {/* {["manager", "student"].includes(currentUser?.role) && (        
          <TextField 
            label="כתובת"
            name="address"
            value={user.address || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          )} */}
          {/* {["manager", "student"].includes(currentUser?.role) && (        */}
           <TextField 
            label="מייל"
            type="email"
            name="Email"
            value={user.Email || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
           {/* )} */}
           {/* {["manager", "student"].includes(currentUser?.role) && (
          <TextField 
            label="טלפון"
            type="tel"
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          )} */}
          {/* <TextField 
            label="קוד משתמש"
            type="text"
            name="userId"
            value={user.userId || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={currentUser?.role === "student"} // disable אם המשתמש הוא תלמידה
          /> */}
          {/* <FormControlLabel
            control={
            <Checkbox
            checked={user.isActive || false}
            onChange={(e) =>
              setUser({
               ...user,
             isActive: e.target.checked,
           })
          }
         disabled={currentUser?.role === "student"} // רק מי שאינו תלמידה יכול לערוך
        />
         }
          label="פעיל"
        /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} color="primary">שמור</Button>
          <Button onClick={onClose} color="secondary">סגור</Button>
        </DialogActions>
      </Dialog>
    );
};

export default EditDonor;
