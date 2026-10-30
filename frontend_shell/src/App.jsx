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
import Typography from "@mui/material/Typography";

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
        {!isMobile && <CustomAppBar
          open={open}
          handleDrawerOpen={handleDrawerOpen}
          setMode={setMode}
        />}
        <SideBar open={open} handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen} />


        <Box component="main" sx={{ flexGrow: 1, p: { xs: 1.5, sm: 3 }, minWidth: 0, overflowX: "hidden", backgroundColor: "background.default", minHeight: "100vh" }}>
          {isMobile && <Box sx={{ mb: 2, px: 0.5, pt: 0.5 }}>
            <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ letterSpacing: 0.5 }}>电商财务分析平台</Typography>
            <Typography variant="caption" color="text.secondary">经营数据一站式分析</Typography>
          </Box>}
          <DrawerHeader sx={{ display: { xs: "none", sm: "flex" } }} />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
