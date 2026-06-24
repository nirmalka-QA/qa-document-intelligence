import { AppShell, Group, Text, ThemeIcon } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { IconRobot } from "@tabler/icons-react";

import WorkflowStepper from "./components/WorkflowStepper";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  return (
    <AppShell padding={0}>
      <AppShell.Main>
        
        {/* Premium Header Layout */}
        <Group
          justify="space-between"
          align="center"
          p="md"
          style={{
            borderBottom: "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-5))",
            backgroundColor: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-8))",
            position: "sticky",
            top: 0,
            zIndex: 101,
          }}
        >
          <Group gap="sm">
            <ThemeIcon 
              size="lg" 
              radius="md" 
              variant="gradient" 
              gradient={{ from: 'blue', to: 'cyan' }}
            >
              <IconRobot size={22} />
            </ThemeIcon>
            <div>
              <Text fw={800} size="xl" style={{ letterSpacing: "-0.5px" }}>
                QA Document Intelligence
              </Text>
              <Text size="xs" c="dimmed" fw={600} tt="uppercase" mt={2}>
                Requirement → Test Cases → RTM → Export
              </Text>
            </div>
          </Group>

          <ThemeToggle />
        </Group>

        <WorkflowStepper />

        <div style={{ padding: "16px", maxWidth: "1600px", margin: "0 auto" }}>
          <Outlet />
        </div>

      </AppShell.Main>
    </AppShell>
  );
}