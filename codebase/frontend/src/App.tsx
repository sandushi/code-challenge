import React from "react";
import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";


function App() {
    const nav = useNavigate();
    const { pathname } = useLocation();

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            Energy App
        </Box>
    );
}

export default App;
