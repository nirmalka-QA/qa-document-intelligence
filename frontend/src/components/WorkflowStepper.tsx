import {
  Box,
  Card,
  Group,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";

const steps = [
  { number: "01", title: "Overview", subtitle: "Dashboard", path: "/" },
  { number: "02", title: "Analyzer", subtitle: "Requirements", path: "/document-analyzer" },
  { number: "03", title: "Test Cases", subtitle: "Coverage", path: "/testcase-generator" },
  { number: "04", title: "RTM", subtitle: "Traceability", path: "/rtm-generator" },
  { number: "05", title: "Export", subtitle: "Reports", path: "/export-center" },
];

export default function WorkflowStepper() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const activeIndex = steps.findIndex((step) => step.path === location.pathname);

  return (
    <Card
      radius="md"
      p="sm"
      mb="xl"
      bg="transparent"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(10px)",
      }}
    >
      <Group gap="sm" wrap="nowrap" align="stretch">
        {steps.map((step, index) => {
          const isActive = location.pathname === step.path;
          const isCompleted = index < activeIndex;

          return (
            <Box
              key={step.path}
              style={{ flex: 1, cursor: "pointer" }}
              onClick={() => navigate(step.path)}
            >
              <Card
                radius="md"
                p="sm"
                style={{
                  transition: "all 0.2s ease",
                  backgroundColor: isActive 
                    ? (isDark ? theme.colors.blue[9] : theme.colors.blue[0]) 
                    : "transparent",
                  border: isActive
                    ? `1px solid ${theme.colors.blue[5]}`
                    : `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                  minHeight: 80,
                }}
              >
                <Stack gap={0} justify="space-between" h="100%">
                  <Group justify="space-between">
                    <Text size="xs" fw={800} c={isActive ? "blue.6" : "dimmed"}>
                      {step.number}
                    </Text>
                    {isCompleted && (
                      <ThemeIcon color="teal" size={18} radius="xl" variant="light">
                        <IconCheck size={12} stroke={3} />
                      </ThemeIcon>
                    )}
                  </Group>
                  <div style={{ marginTop: '8px' }}>
                    <Text fw={700} size="sm" lh={1.1}>{step.title}</Text>
                    <Text size="xs" c="dimmed" mt={2}>{step.subtitle}</Text>
                  </div>
                </Stack>
              </Card>
            </Box>
          );
        })}
      </Group>

      <Progress
        mt="md"
        size="sm"
        radius="xl"
        color="blue"
        value={((activeIndex + 1) / steps.length) * 100}
        style={{ backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[2] }}
      />
    </Card>
  );
}