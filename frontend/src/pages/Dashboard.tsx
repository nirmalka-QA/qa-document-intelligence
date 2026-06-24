import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  ThemeIcon,
  Badge,
  SimpleGrid,
} from "@mantine/core";
import { useAnalysisStore } from "../store/analysisStore";
import {
  IconFileAnalytics,
  IconListCheck,
  IconTestPipe,
  IconTableShare,
  IconAlertTriangle,
  IconFileDescription,
} from "@tabler/icons-react";

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <Card withBorder radius="md" padding="xl" shadow="xs">
    <Group justify="space-between" align="flex-start">
      <Stack gap="xs">
        <Text size="sm" c="dimmed" fw={600} tt="uppercase">
          {title}
        </Text>
        <Title order={2} style={{ fontSize: "2rem", fontWeight: 700 }}>
          {value}
        </Title>
      </Stack>
      <ThemeIcon size="xl" radius="md" variant="light" color={color}>
        <Icon size={26} stroke={1.5} />
      </ThemeIcon>
    </Group>
  </Card>
);

export default function Dashboard() {
  const { analysis, testCases, rtm } = useAnalysisStore();

  const documentCount = analysis ? 1 : 0;
  const requirementCount = analysis?.requirements?.length || 0;
  const testCaseCount = testCases?.length || 0;
  const rtmCount = rtm?.length || 0;
  const riskCount = analysis?.risks?.length || 0;

  return (
    <div style={{ width: "100%", padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      <Stack gap="xl">
        <Group justify="space-between" align="flex-end">
          <Stack gap="xs">
            <Text size="sm" fw={700} c="blue" tt="uppercase" letterSpacing={1}>
              Platform Overview
            </Text>
            {/* Removed hardcoded dark color so it inherits correctly */}
            <Title order={1} style={{ fontWeight: 800 }}>
              QA Document Intelligence
            </Title>
            <Text c="dimmed" size="md" mt={-4}>
              Centralized Requirement, Test Case, and RTM Management
            </Text>
          </Stack>
          <Badge size="lg" variant="dot" color={analysis ? "green" : "gray"} radius="md">
            {analysis ? "Document Loaded" : "Awaiting Upload"}
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
          <StatCard title="Documents" value={documentCount} icon={IconFileAnalytics} color="blue" />
          <StatCard title="Requirements" value={requirementCount} icon={IconListCheck} color="grape" />
          <StatCard title="Test Cases" value={testCaseCount} icon={IconTestPipe} color="teal" />
          <StatCard title="RTMs" value={rtmCount} icon={IconTableShare} color="orange" />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Card withBorder radius="md" padding="xl" shadow="xs">
            <Group justify="space-between" align="center">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconAlertTriangle size={22} color="var(--mantine-color-red-6)" />
                  <Text fw={700} size="lg">Risks Identified</Text>
                </Group>
                <Text size="sm" c="dimmed">
                  Potential gaps or anomalies detected in the current document.
                </Text>
              </Stack>
              <Title order={1} c="red.6" style={{ fontSize: "3rem" }}>
                {riskCount}
              </Title>
            </Group>
          </Card>

          <Card withBorder radius="md" padding="xl" shadow="xs">
            <Stack justify="space-between" h="100%">
              <Stack gap="xs">
                <Group gap="xs">
                  <IconFileDescription size={22} color="var(--mantine-color-blue-6)" />
                  <Text fw={700} size="lg">Current Context</Text>
                </Group>
                <Text size="sm" c="dimmed">Currently analyzing workspace.</Text>
              </Stack>
              {/* Used light-dark() to make background adapt automatically */}
              <Card 
                bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))" 
                radius="sm" 
                mt="md" 
                p="md"
              >
                <Text fw={600} size="md" c={analysis?.document_name ? undefined : "dimmed"}>
                  {analysis?.document_name || "No Document Uploaded"}
                </Text>
              </Card>
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </div>
  );
}