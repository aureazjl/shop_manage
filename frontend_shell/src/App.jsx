import * as React from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import CustomAppBar from "./components/CustomAppBar";
import SideBar from "./components/SideBar";
import { getDesignTokens } from "./theme";
import { Outlet } from "react-router";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export const API = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? "http://127.0.0.1:18780" : "");

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function MiniDrawer() {
  const [mode, setMode] = React.useState(
    localStorage.getItem("currentMode") ?? "light"
  );
  const [open, setOpen] = React.useState(false);
  const [mobileTopBarVisible, setMobileTopBarVisible] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {(!isMobile || mobileTopBarVisible) && <CustomAppBar
          open={open}
          handleDrawerOpen={handleDrawerOpen}
          setMode={setMode}
          onHideMobile={() => setMobileTopBarVisible(false)}
        />}
        <SideBar open={open} handleDrawerClose={handleDrawerClose} />

        {isMobile && !mobileTopBarVisible && (
          <IconButton
            color="inherit"
            aria-label="显示顶部导航"
            onClick={() => setMobileTopBarVisible(true)}
            sx={{ position: "fixed", top: 8, left: 8, zIndex: (theme) => theme.zIndex.drawer + 2, bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { bgcolor: "primary.dark" } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 3 }, minWidth: 0, overflowX: "hidden", backgroundColor: "background.default", minHeight: "100vh" }}>
          <DrawerHeader sx={{ display: { xs: mobileTopBarVisible ? "flex" : "none", sm: "flex" } }} />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
