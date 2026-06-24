import React from "react";
import ReactDOM from "react-dom/client";

// 1. Mantine Core Styles
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { RouterProvider } from "react-router-dom";

// 2. Local Imports
import { router } from "./router";
import { theme } from "./theme/mantineTheme";

// 3. Global CSS
import "./index.css"; 
import "./styles/globals.css";

// Check local storage for the user's previous theme preference
const savedTheme = localStorage.getItem("qa-theme") === "dark" ? "dark" : "light";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* ColorSchemeScript MUST be here so the app knows the theme BEFORE it renders */}
    <ColorSchemeScript defaultColorScheme={savedTheme} />
    
    <MantineProvider theme={theme} defaultColorScheme={savedTheme}>
      <Notifications position="top-right" />
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);