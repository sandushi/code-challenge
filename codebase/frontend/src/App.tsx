import React from "react";
import { Tabs, Tab, Box, Typography, AppBar, Toolbar, Container } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const tabs = [
    { label: "Accounts", value: "/" },
    { label: "Payment History", value: "/history" }
];

function App() {
    const nav = useNavigate();
    const { pathname } = useLocation();
    const current = pathname === "/" ? "/" : "/history";

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Toolbar sx={{ gap: 2 }}>
                    <Typography variant="h6" fontWeight={700}>EnergyPay</Typography>
                    <Tabs value={current} onChange={(_, value) => nav(value)}>
                        {tabs.map((t) => (
                            <Tab key={t.value} value={t.value} label={t.label} />
                        ))}
                    </Tabs> 
                </Toolbar>
            </AppBar>
            <Container sx={{ py: 3 }}>
                <Outlet />
            </Container>
        </Box>
    );
}

export default App;
