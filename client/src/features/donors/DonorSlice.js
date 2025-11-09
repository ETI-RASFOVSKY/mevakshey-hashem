import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUsersFromServer,
  addUserToServer,
  updateUserOnServer,
  deleteUserFromServer
} from "../../api/users";

// קריאת משתמשים
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return await getUsersFromServer();
});

// הוספת משתמש
export const addUser = createAsyncThunk("users/addUser", async (user) => {
  return await addUserToServer(user);
});

// עדכון משתמש
export const updateUser = createAsyncThunk("users/updateUser", async (user) => {
  return await updateUserOnServer(user);
});

// מחיקת משתמש
export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  return await deleteUserFromServer(id);
});

const donorSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // add
      .addCase(addUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // update
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const idx = state.users.findIndex(u => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // delete
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = state.users.filter(u => u.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default donorSlice.reducer;
