import { Badge, Button, Card, ScrollArea, Stack, Table, Textarea, Title, Group, Text, Paper, ThemeIcon } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconSparkles, IconArrowRight, IconTestPipe, IconTestPipe2Filled } from "@tabler/icons-react";
import api from "../services/api";
import { useAnalysisStore } from "../store/analysisStore";

export default function TestCaseGenerator() {
  const navigate = useNavigate();
  const { requirementsText, testCases, setTestCases } = useAnalysisStore();
  const [requirement, setRequirement] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRequirement(requirementsText);
  }, [requirementsText]);

  const generateCases = async () => {
    if (!requirement.trim()) {
      alert("No requirements available to analyze.");
      return;
    }
    try {
      setLoading(true);
      // NEW
      const response = await api.post("/api/testcases/generate", {
        requirements: requirement,
      });
      setTestCases(response.data?.testcases || []);
    } catch (error) {
      console.error(error);
      alert("Failed to generate test cases");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const p = priority?.toLowerCase() || "";
    if (p.includes("high")) return "red";
    if (p.includes("medium")) return "yellow";
    if (p.includes("low")) return "blue";
    return "gray";
  };

  return (
    <div style={{ width: "100%", padding: "12px" }}>
      <Stack>

        <Paper p="xl" radius="md" withBorder shadow="sm" bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))">
          <Group justify="space-between">
            <Group gap="md">
              <ThemeIcon size={50} radius="md" variant="light" color="teal">
                <IconTestPipe2Filled size={28} />
              </ThemeIcon>
              <div>
                <Title order={2}>Test Case Generation</Title>
                <Text c="dimmed" mt={4}>
                  Review extracted requirements and generate comprehensive test scenarios.
                </Text>
              </div>
            </Group>
            {/* Metric showing available requirements to process */}
            <Stack gap={4} align="flex-end">
              <Text size="xs" tt="uppercase" fw={600} c="dimmed">Extracted Requirements</Text>
              <Text size="xl" fw={800}>{useAnalysisStore.getState().analysis?.requirements?.length || 0}</Text>
            </Stack>
          </Group>
        </Paper>

        <Card withBorder radius="md" p="md" shadow="sm">
          <Textarea
            label="Source Requirements Context"
            description="Edit or append requirements before generation."
            minRows={6}
            maxRows={10}
            autosize
            value={requirement}
            onChange={(e) => setRequirement(e.currentTarget.value)}
            styles={{
              input: {
                fontFamily: 'monospace',
                fontSize: '14px',
                backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
                color: 'light-dark(var(--mantine-color-black), var(--mantine-color-gray-3))',
              }
            }}
          />
          <Group justify="flex-end" mt="md">
            <Button
              loading={loading}
              onClick={generateCases}
              leftSection={<IconSparkles size={18} />}
              radius="md"
              disabled={!requirement || requirement.trim() === ""} // Disabled if no requirement
            >
              Generate Scenarios
            </Button>
          </Group>
        </Card>

        {testCases.length > 0 && (
          <Card withBorder radius="md" p={0} shadow="sm">
            <Group justify="space-between" p="md" style={{ borderBottom: '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))' }}>
              <Group gap="sm">
                <Text fw={600} size="lg">Generated Scenarios</Text>
                <Badge size="md" variant="light" color="teal">
                  {testCases.length} Total
                </Badge>
              </Group>
              <Button
                variant="light"
                color="blue"
                rightSection={<IconArrowRight size={16} />}
                onClick={() => navigate("/rtm-generator")}
              >
                Proceed to RTM
              </Button>
            </Group>

            <ScrollArea h={500} offsetScrollbars>
              <Table horizontalSpacing="lg" verticalSpacing="md" highlightOnHover striped>
                <Table.Thead bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))">
                  <Table.Tr>
                    <Table.Th><Text size="xs" tt="uppercase" c="dimmed">Test ID</Text></Table.Th>
                    <Table.Th><Text size="xs" tt="uppercase" c="dimmed">Title</Text></Table.Th>
                    <Table.Th><Text size="xs" tt="uppercase" c="dimmed">Req ID</Text></Table.Th>
                    <Table.Th><Text size="xs" tt="uppercase" c="dimmed">Priority</Text></Table.Th>
                    <Table.Th><Text size="xs" tt="uppercase" c="dimmed">Expected Result</Text></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {testCases.map((tc, index) => (
                    <Table.Tr key={index}>
                      <Table.Td fw={600}>{tc.testcase_id}</Table.Td>
                      <Table.Td maw={300}><Text truncate="end" size="sm">{tc.test_title}</Text></Table.Td>
                      <Table.Td><Badge variant="dot" color="gray">{tc.requirement_id}</Badge></Table.Td>
                      <Table.Td>
                        <Badge variant="light" color={getPriorityColor(tc.priority)} radius="sm">
                          {tc.priority}
                        </Badge>
                      </Table.Td>
                      <Table.Td><Text size="sm" c="dimmed">{tc.expected_result}</Text></Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Card>
        )}
      </Stack>
    </div>
  );
}