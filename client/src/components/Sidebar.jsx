import React, { useEffect, useState } from 'react';
import { 
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme
} from '@mui/material';
import {
    EmojiEmotionsOutlined,
    AltRouteOutlined,
    WcOutlined,
    LuggageOutlined,
    ArticleOutlined,
    AssessmentOutlined,
    AdjustOutlined,
    AdsClickOutlined,
    PeopleOutlined,
    SettingsOutlined,
    ChevronLeft,
    ChevronRightOutlined,
    HomeOutlined,
    Groups2Outlined
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import FlexBetween from './FlexBetween';
import profileImage from 'assets/Profile.jpeg';

const navItems = [
    {
        text: "Dashboard",
        icon: <HomeOutlined />,
        path: "/dashboard"
    },
    {
        text: "Fitur Utama",
        icon: null
    },
    {
        text: "Detail Usia",
        icon: <Groups2Outlined />,
        path: "/detail_usia"
    },
    {
        text: "Detail Gender",
        icon: <WcOutlined />,
        path: "/detail_gender"
    },
    {
        text: "Detail Ekspresi",
        icon: <EmojiEmotionsOutlined />,
        path: "/detail_ekspresi"
    },
    {
        text: "Detail Ras",
        icon: <AltRouteOutlined />,
        path: "/detail_ras"
    },
    {
        text: "Detail Bawaan",
        icon: <LuggageOutlined />,
        path: "/detail_bawaan"
    },
    {
        text: "Fitur Tambahan",
        icon: null
    },
    {
        text: "Jumlah Pengunjung",
        icon: <PeopleOutlined />,
        path: "/jumlah_pengunjung"
    },
    {
        text: "Overall Feedback",
        icon: <ArticleOutlined />,
        path: "/overall_feedback"
    },
    {
        text: "Most Clicked",
        icon: <AdsClickOutlined />,
        path: "/most_clicked"
    },
    {
        text: "Click Stream",
        icon: <AdjustOutlined />,
        path: "/click_stream"
    },
    {
        text: "Feedbacks",
        icon: <AssessmentOutlined />,
        path: "/feedbacks"
    },    
];

const Sidebar = ({
    user,
    admin,
    drawerWidth,
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }
          }}
        >
          <Box>
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant='h5' fontWeight="bold">
                    Remosto Dashboard
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon, path }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 0 2rem" }}>
                      {text}
                    </Typography>
                  );
                }
                
                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(path);
                        setActive(path);
                      }}
                      sx={{
                        backgroundColor: active === path ? theme.palette.secondary[300] : "transparent",
                        color: active === path ? theme.palette.primary[600] : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon sx={{
                        ml: "2rem",
                        color: active === path ? theme.palette.primary[600] : theme.palette.secondary[200],
                      }}>
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === path && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </Box>
          <Box mb="1rem">
            <Divider />
            <FlexBetween textTransform="none" gap="1rem" m="2rem 2rem 0 2rem">
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="40px"
                width="40px"
                sx={{ 
                        objectFit: "cover",
                        borderRadius: "10%",
                        //borderRadius: "50%"
                        overflow: "hidden"
                 }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.75rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {admin.name}
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontSize="0.65rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {admin.role}
                </Typography>
              </Box>
              <SettingsOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
  );
}

export default Sidebar;
