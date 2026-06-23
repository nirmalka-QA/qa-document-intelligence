import {
  AppShell,
  Group,
  Text,
} from "@mantine/core";

import { Outlet } from "react-router-dom";

import WorkflowStepper from "./components/WorkflowStepper";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {

  return (

    <AppShell
      padding={0}
    >

      <AppShell.Main>

        <Group
          justify="space-between"
          p="md"
          style={{
            borderBottom:
              "1px solid #e9ecef",
          }}
        >

          <div>

            <Text
              fw={700}
              size="xl"
            >
              QA Document Intelligence
            </Text>

            <Text
              size="sm"
              c="dimmed"
            >
              Requirement → Test Cases → RTM → Export
            </Text>

          </div>

          <ThemeToggle />

        </Group>

        <WorkflowStepper />

        <div
          style={{
            padding: "12px",
          }}
        >

          <Outlet />

        </div>

      </AppShell.Main>

    </AppShell>

  );
}