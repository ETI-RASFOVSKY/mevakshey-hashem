import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const StudentMoreDetails = ({ selectedUser, onClose }) => {
  if (!selectedUser) return null; // אם אין משתמש נבחר, לא מציג כלום

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>פרטים נוספים</DialogTitle>
      <DialogContent>
        <p><strong>שם פרטי:</strong> {selectedUser.fname}</p>
        <p><strong>שם משפחה:</strong> {selectedUser.lname}</p>
        <p><strong>כתובת:</strong> {selectedUser.address}</p>
        <p><strong>אימייל:</strong> {selectedUser.Email}</p>
        <p><strong>מס' פלאפון:</strong> {selectedUser.phone}</p>
        <p><strong>סכום התרומה:</strong> {selectedUser.donationAmount}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">סגור</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentMoreDetails;
