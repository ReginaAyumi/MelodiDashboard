//src/App.js
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAdminData } from "state"; 
import { Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import DetailUsia from "scenes/detail_usia";
import DetailGender from "scenes/detail_gender";
import DetailEkspresi from "scenes/detail_ekspresi";
import Login from "components/Login";
import Signup from "components/SignUp";
import CameraComponent from "./components/CameraComponents";
// import { WebSocket } from "ws";

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Ambil adminId dan token dari localStorage
    const adminId = localStorage.getItem("adminId");
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");

    // Jika adminId ada di localStorage, dispatch setAdminData
    if (adminId) {
      dispatch(setAdminData({ adminId, name, role }));
    }

    // Sesuaikan URL server WebSocket
    const socket = new WebSocket("ws://localhost:5001");

    // Tambahkan listener untuk event open, message, dan close
    socket.onopen = () => {
      console.log("WebSocket connected from client");
    };

    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);

      // Jika data berupa JSON, parse menjadi objek
      const message = JSON.parse(event.data);
      console.log("Parsed message:", message);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected on client");
    };

    return () => {
      socket.close();
    };
  }, [dispatch]);

  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<Signup />} />
            <Route element={<Layout />}>
              <Route
                path="/"
                element={<PrivateRoute element={<Dashboard />} />}
              />
              <Route
                path="/dashboard"
                element={<PrivateRoute element={<Dashboard />} />}
              />
              <Route
                path="/detail_usia"
                element={<PrivateRoute element={<DetailUsia />} />}
              />
              <Route
                path="/detail_gender"
                element={<PrivateRoute element={<DetailGender />} />}
              />
              <Route
                path="/detail_ekspresi"
                element={<PrivateRoute element={<DetailEkspresi />} />}
              />
              <Route
                path="/camera"
                element={<PrivateRoute element={<CameraComponent />} />}
              />
              <Route path="/" element={<Navigate replace to="/login" />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
