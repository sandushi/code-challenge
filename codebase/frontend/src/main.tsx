import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AccountsPage from "./pages/AccountsPage";
import HistoryPage from "./pages/HistoryPage";


const router = createBrowserRouter([
    {   path: "/", element: <App />,
        children: [
            { index: true, element: <AccountsPage /> },
            { path: "history", element: <HistoryPage /> },
        ]
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>
);