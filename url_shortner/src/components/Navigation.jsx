import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link, BarChart } from "@mui/icons-material";

const Navigation = () => {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Link sx={{ mr: 2, color: "inherit" }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          QuickLink
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            variant={location.pathname === "/" ? "outlined" : "text"}
            startIcon={<Link />}
          >
            Shortener
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/statistics"
            variant={location.pathname === "/statistics" ? "outlined" : "text"}
            startIcon={<BarChart />}
          >
            Statistics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
