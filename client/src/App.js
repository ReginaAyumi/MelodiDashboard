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
import Feedbacks from "scenes/feedbacks";
import JumlahPengunjung from "scenes/jumlah_pengunjung";
import OverallFeedback from "scenes/overall_feedback";
import MostClicked from "scenes/most_clicked";
import ClickStream from "scenes/click_stream";
import DetailUsia from "scenes/detail_usia";
import DetailGender from "scenes/detail_gender";
import DetailEkspresi from "scenes/detail_ekspresi";
import DetailRas from "scenes/detail_ras";
import DetailBawaan from "scenes/detail_bawaan";
import Login from "components/Login";
import Signup from "components/SignUp";

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
                path="/detail_ras"
                element={<PrivateRoute element={<DetailRas />} />}
              />
              <Route
                path="/detail_bawaan"
                element={<PrivateRoute element={<DetailBawaan />} />}
              />
              <Route
                path="/feedbacks"
                element={<PrivateRoute element={<Feedbacks />} />}
              />
              {/* <Route
                path="/jumlah_pengunjung"
                element={<PrivateRoute element={<JumlahPengunjung />} />}
              /> */}
              <Route
                path="/overall_feedback"
                element={<PrivateRoute element={<OverallFeedback />} />}
              />
              <Route
                path="/most_clicked"
                element={<PrivateRoute element={<MostClicked />} />}
              />
              <Route
                path="/click_stream"
                element={<PrivateRoute element={<ClickStream />} />}
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
