import { Stack, Box, NavLink, Group, ThemeIcon, Title, Divider } from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  IconDashboard, 
  IconFileText, 
  IconChecklist, 
  IconTable,
  IconRobot
} from "@tabler/icons-react";

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // To track active route

  const navItems = [
    { label: "Dashboard", path: "/", icon: IconDashboard },
    { label: "Document Analyzer", path: "/document-analyzer", icon: IconFileText },
    { label: "Test Cases", path: "/testcase-generator", icon: IconChecklist },
    { label: "RTM Generator", path: "/rtm-generator", icon: IconTable },
  ];

  return (
    <Box 
      w={280} 
      h="100vh" 
      p="md" 
      style={{ borderRight: "1px solid var(--mantine-color-gray-3)" }}
    >
      <Stack gap="xl">
        
        {/* Brand Logo Area */}
        <Group gap="sm" px="xs" mt="xs">
          <ThemeIcon variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} size="lg" radius="md">
            <IconRobot size={22} />
          </ThemeIcon>
          <Title order={4} fw={800} style={{ letterSpacing: "-0.5px" }}>
            QA Intel
          </Title>
        </Group>

        <Divider />

        {/* Navigation Links */}
        <Stack gap="xs">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              label={item.label}
              leftSection={<item.icon size={20} stroke={1.5} />}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              variant="light"
              color="blue"
              fw={500}
              style={{ borderRadius: "8px" }}
            />
          ))}
        </Stack>

      </Stack>
    </Box>
  );
}