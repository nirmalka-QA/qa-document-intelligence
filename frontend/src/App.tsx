import { AppShell, Group, Text, ThemeIcon, ActionIcon, Tooltip } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import { IconRobot, IconTrash } from "@tabler/icons-react";

import WorkflowStepper from "./components/WorkflowStepper";
import ThemeToggle from "./components/ThemeToggle";
import { useAnalysisStore } from "./store/analysisStore";

export default function App() {
  const navigate = useNavigate();
  // Pull in the active analysis and the clear method
  const { analysis, clearAll } = useAnalysisStore();

  const handleResetSession = () => {
    // Confirm before wiping data
    if (window.confirm("Are you sure you want to clear the current document and all generated data? This cannot be undone.")) {
      clearAll(); // Clears Zustand state and LocalStorage
      navigate("/"); // Send user back to the dashboard
    }
  };

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

          {/* Global Action Tools */}
          <Group gap="sm">
            {/* Only show the reset button if there is active data to clear */}
            {analysis && (
              <Tooltip label="Clear Session Data" withArrow position="bottom">
                <ActionIcon 
                  variant="light" 
                  color="red" 
                  size="lg" 
                  radius="md" 
                  onClick={handleResetSession}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            )}
            
            <ThemeToggle />
          </Group>
        </Group>

        <WorkflowStepper />

        <div style={{ padding: "16px", maxWidth: "1600px", margin: "0 auto" }}>
          <Outlet />
        </div>

      </AppShell.Main>
    </AppShell>
  );
}