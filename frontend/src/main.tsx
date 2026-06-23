import React from "react";
import ReactDOM from "react-dom/client";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import {
  MantineProvider,
  ColorSchemeScript,
} from "@mantine/core";

import {
  Notifications,
} from "@mantine/notifications";

import {
  RouterProvider,
} from "react-router-dom";

import { router } from "./router";
import { theme } from "./theme/mantineTheme";

import "./index.css";

const savedTheme =
  localStorage.getItem(
    "qa-theme"
  ) === "dark"
    ? "dark"
    : "light";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(

  <React.StrictMode>

    <ColorSchemeScript
      defaultColorScheme={
        savedTheme
      }
    />

    <MantineProvider
      theme={theme}
      defaultColorScheme={
        savedTheme
      }
    >

      <Notifications />

      <RouterProvider
        router={router}
      />

    </MantineProvider>

  </React.StrictMode>

);