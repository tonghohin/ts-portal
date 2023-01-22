import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Authentication {
  isAuthenticated: boolean;
  username?: string;
  isAdmin?: boolean;
}

const initialState: Authentication = { isAuthenticated: false };

export const fetchAuthentication = createAsyncThunk("admin/fetchAuthentication", async () => {
  const res: Response = await fetch("/admin/authenticate", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
  const data: Authentication = await res.json();
  return data;
});

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthentication.pending, (state): Authentication => (state = { isAuthenticated: false }))
      .addCase(fetchAuthentication.fulfilled, (state, action): Authentication => action.payload)
      .addCase(fetchAuthentication.rejected, (state): Authentication => (state = { isAuthenticated: false }));
  }
});

export default adminSlice.reducer;
