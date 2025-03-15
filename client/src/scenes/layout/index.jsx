import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { useGetAdminQuery } from "state/api";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Ambil adminId dari Redux state
  const adminId = useSelector((state) => state.global.adminId);
  console.log("adminId from Redux:", adminId);

  // Menggunakan useGetAdminQuery untuk mengambil data admin berdasarkan adminId
  const { data, error, isLoading } = useGetAdminQuery(adminId, {
    skip: !adminId,
  });

  useEffect(() => {
    if (!adminId) {
      console.error("adminId is missing");
    }
  }, [adminId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading admin data</div>;

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        admin={data || {}}
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1}>
        <Navbar
          admin={data || {}}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
