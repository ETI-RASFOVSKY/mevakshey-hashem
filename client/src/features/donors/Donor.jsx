import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StudentMoreDetails from "./DonorMoreDetails";
import AddStudent from "./AddDonor";
import EditDonor from "./EditDonor";
import Massage from "../massage/Massage";
import "./Donor.css";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

import { fetchUsers, deleteUser } from "./DonorSlice";

const Donor = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const currentUser = useSelector((state) => state.users.current_user);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // טען את המשתמשים בעת הטעינה
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // מחיקת משתמש
  const handleDeleteUser = (user) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את המשתמש ${user.fname} ?`)) {
      dispatch(deleteUser(user.id));
    }
  };

  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box p={2}>
        <Alert severity="error">
          {error || "שגיאה בטעינת המשתמשים"}
        </Alert>
      </Box>
    );
  }

  return (
    <div className="all">
      <Button
        variant="contained"
        onClick={() => setShowAddUser(true)}
        sx={{
          backgroundColor: "rgba(14, 169, 189, 0.3)",
          color: "#0ea9bd",
          "&:hover": {
            backgroundColor: "rgba(14, 169, 189, 0.5)",
          },
        }}
      >
        הוספת משתמש
      </Button>

      <h2>דף משתמשים</h2>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>שם פרטי</TableCell>
              <TableCell>מייל</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  אין משתמשים להציג
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fname}</TableCell>
                  <TableCell>{user.Email}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setEditUser(user)}
                      sx={{ mr: 1 }}
                    >
                      ערוך
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteUser(user)}
                      sx={{ mr: 1 }}
                    >
                      מחיקה
                    </Button>
                    {["manager", "student"].includes(currentUser?.role) && (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setSelectedUser(user)}
                      >
                        פרטים נוספים
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedUser && (
        <StudentMoreDetails
          selectedUser={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      <Dialog
        open={showAddUser}
        onClose={() => setShowAddUser(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>הוספת משתמש</DialogTitle>
        <DialogContent>
          <AddStudent />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddUser(false)} color="primary">
            סגור
          </Button>
        </DialogActions>
      </Dialog>

      {editUser && <EditDonor editUser={editUser} onClose={() => setEditUser(null)} />}
      <Massage />
    </div>
  );
};

export default Donor;
