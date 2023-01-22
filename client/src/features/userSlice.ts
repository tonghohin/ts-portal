import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Authentication {
  isAuthenticated: boolean;
  unit?: string;
  isAdmin?: boolean;
}

const initialState: Authentication = { isAuthenticated: false };

const fetchUserAuthentication = createAsyncThunk("user/fetchUserAuthentication", async () => {
  const res: Response = await fetch("/authenticate", { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } });
  const data: Authentication = await res.json();
  return data;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAuthentication.pending, (state): Authentication => (state = { isAuthenticated: false }))
      .addCase(fetchUserAuthentication.fulfilled, (state, action): Authentication => action.payload)
      .addCase(fetchUserAuthentication.rejected, (state): Authentication => (state = { isAuthenticated: false }));
  }
});

export { fetchUserAuthentication, userSlice };
export default userSlice.reducer;
