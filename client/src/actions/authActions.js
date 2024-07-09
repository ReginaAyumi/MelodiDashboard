// src/actions/authActions.js

import axios from "axios";
import { setAdminId } from "state";

export const login = (email, password) => async (dispatch) => {
  try {
    const { data } = await axios.post("http://localhost:5001/auth", { email, password });
    const { adminId, name, role } = data.admin; // Pastikan respons dari API mengandung adminId, name, dan role
    
    dispatch(setAdminId({ adminId, name, role })); // Dispatch untuk mengatur state Redux
    
    localStorage.setItem("token", data.token); // Simpan token ke local storage atau sesuai kebutuhan

    setTimeout(() => {
      window.location = "/"; // Redirect ke halaman setelah login sukses
    }, 2000000);
  } catch (error) {
    console.error("Login failed", error);
  }
};
