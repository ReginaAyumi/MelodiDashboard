import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAdminData } from "state"; // Sesuaikan path dengan lokasi file globalSlice.js
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import welcomeImage from "assets/logo-remosto.svg";

const Login = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5001/auth"; // Ganti dengan URL endpoint login Anda
      const response = await axios.post(url, data);
      const res = response.data;
  
      // Extract adminId, name, and role from response
      const { _id: adminId, name, role } = res.admin; // Sesuaikan dengan struktur respons dari backend
  
      // Dispatch setAdminData untuk menyimpan data admin ke Redux state
      dispatch(setAdminData({ adminId, name, role }));
  
      // Simpan adminId dan token ke localStorage
      localStorage.setItem("adminId", adminId);
      localStorage.setItem("token", res.token);
  
      // Redirect atau navigasi setelah login berhasil
      setTimeout(() => {
        window.location = "/"; // Ganti dengan navigasi yang sesuai
      }, 2000); // Contoh timeout, ganti dengan metode navigasi yang lebih baik
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };
  

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Sign In
            </button>
          </form>
        </div>
        <div className={styles.right}>
        <img src={welcomeImage} alt="Welcome" className={styles.welcome_image} />
          <h1>New Here?</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
