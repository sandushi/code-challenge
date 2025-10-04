import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#1e88e5" },
    },
    shape: { borderRadius: 14 },
    components: {
        MuiButton: { styleOverrides: { root: { textTransform: "none", borderRadius: 12 } } },
        MuiCard: { styleOverrides: { root: { borderWidth: 1.5 } } },
    },
});