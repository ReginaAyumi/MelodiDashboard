import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  adminId: null,
  name: '',
  role: '',
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setAdminData: (state, action) => {
      state.adminId = action.payload.adminId;
      state.name = action.payload.name;
      state.role = action.payload.role;
    },
  },
});

export const { setMode, setAdminData } = globalSlice.actions;

export default globalSlice.reducer;
