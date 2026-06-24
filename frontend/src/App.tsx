import { AppShell, Group, Text, ActionIcon, Tooltip, ThemeIcon } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import { IconTrash, IconNfc } from "@tabler/icons-react";

import WorkflowStepper from "./components/WorkflowStepper";
import ThemeToggle from "./components/ThemeToggle";
import { useAnalysisStore } from "./store/analysisStore";

export default function App() {
  const navigate = useNavigate();
  const { analysis, clearAll } = useAnalysisStore();

  const handleResetSession = () => {
    if (window.confirm("Are you sure you want to clear the current document and all generated data? This cannot be undone.")) {
      clearAll(); 
      navigate("/"); 
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
            {/* The New "Nexa QA" Logo using an Icon */}
            <ThemeIcon 
              size={42} 
              radius="md" 
              variant="light" 
              gradient={{ from: 'cyan', to: 'blue', deg: 135 }}
            >
              <IconNfc size={28} stroke={2} />
            </ThemeIcon>
            <div>
              <Text fw={800} size="xl" style={{ letterSpacing: "-0.5px" }}>
                Nexa QA
              </Text>
              <Text size="xs" c="dimmed" fw={600} tt="uppercase" mt={2}>
                Intelligent QA Workspace
              </Text>
            </div>
          </Group>

          {/* Global Action Tools */}
          <Group gap="sm">
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