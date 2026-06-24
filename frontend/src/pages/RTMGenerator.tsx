import { Badge, Button, Card, Container, Group, Paper, ScrollArea, Stack, Table, Text, Title, ThemeIcon } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconTableExport, IconArrowRight, IconShieldCheck } from "@tabler/icons-react";
import api from "../services/api";
import { useAnalysisStore } from "../store/analysisStore";

export default function RTMGenerator() {
  const navigate = useNavigate();
  const { analysis, testCases, rtm, setRTM } = useAnalysisStore();
  const [loading, setLoading] = useState(false);

  const generateRTM = async () => {
    try {
      setLoading(true);
      const response = await api.post("/api/rtm/generate", {
        requirements: analysis?.requirements || [],
        testcases: testCases || [],
      });
      setRTM(response.data.rtm);
    } catch (error) {
      console.error(error);
      alert("Failed To Generate RTM");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("covered") || s.includes("pass")) return "green";
    if (s.includes("missing") || s.includes("uncovered")) return "red";
    if (s.includes("partial")) return "orange";
    return "gray";
  };

  return (
  
      <div style={{ width: "100%", padding: "12px" }}>
      <Stack gap="xl">
        <Paper p="xl" radius="md" withBorder shadow="sm" bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))">
          <Group justify="space-between">
            <Group gap="md">
              <ThemeIcon size={50} radius="md" variant="light" gradient={{ from: 'blue', to: 'cyan' }}>
                <IconShieldCheck size={28} />
              </ThemeIcon>
              <div>
                <Title order={2}>Requirement Traceability</Title>
                <Text c="dimmed" mt={4}>
                  Map generated test cases against core business requirements to ensure full coverage.
                </Text>
              </div>
            </Group>
            <Stack gap={4} align="flex-end">
              <Text size="xs" tt="uppercase" fw={600} c="dimmed">Active Requirements</Text>
              <Text size="xl" fw={800}>{analysis?.requirements?.length || 0}</Text>
            </Stack>
          </Group>
        </Paper>

        <Card withBorder shadow="sm" radius="md" p={0}>
          <Group justify="space-between" p="md" style={{ borderBottom: '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))' }}>
            <Group gap="sm">
              <Text fw={600} size="lg">Coverage Matrix</Text>
              {rtm.length > 0 && (
                <Badge size="md" variant="light" color="blue">
                  {rtm.length} Traces
                </Badge>
              )}
            </Group>
            <Button
              loading={loading}
              onClick={generateRTM}
              leftSection={<IconTableExport size={18} />}
              radius="md"
              // Disabled if there are no testcases or no requirements loaded
              disabled={testCases.length === 0 || !analysis?.requirements || analysis.requirements.length === 0}
            >
              Generate RTM Matrix
            </Button>
          </Group>

          <ScrollArea h={600} offsetScrollbars>
            <Table horizontalSpacing="lg" verticalSpacing="md" highlightOnHover striped>
              <Table.Thead bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))">
                <Table.Tr>
                  <Table.Th><Text size="xs" tt="uppercase" c="dimmed">Req ID</Text></Table.Th>
                  <Table.Th><Text size="xs" tt="uppercase" c="dimmed">Requirement Description</Text></Table.Th>
                  <Table.Th><Text size="xs" tt="uppercase" c="dimmed">Linked Tests</Text></Table.Th>
                  <Table.Th><Text size="xs" tt="uppercase" c="dimmed">Coverage Type</Text></Table.Th>
                  <Table.Th><Text size="xs" tt="uppercase" c="dimmed">Status</Text></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rtm.length > 0 ? (
                  rtm.map((row, index) => (
                    <Table.Tr key={index}>
                      <Table.Td fw={600}>{row.requirement_id}</Table.Td>
                      <Table.Td maw={300}><Text truncate="end" size="sm" c="dimmed">{row.requirement}</Text></Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={500} style={{ fontFamily: 'monospace' }}>
                          {row.testcase_ids}
                        </Text>
                      </Table.Td>
                      <Table.Td><Text size="sm">{row.coverage}</Text></Table.Td>
                      <Table.Td>
                        <Badge variant="dot" color={getStatusColor(row.status)} radius="sm">
                          {row.status}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={5} h={200}>
                      <Stack align="center" justify="center" gap="xs">
                        <IconTableExport size={40} color="var(--mantine-color-gray-4)" />
                        <Text ta="center" c="dimmed" fw={500}>
                          Matrix is empty. Click generate to map your records.
                        </Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
          
          {rtm.length > 0 && (
            <Group justify="flex-end" p="md" bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))" style={{ borderTop: '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))' }}>
              <Button
                color="green"
                rightSection={<IconArrowRight size={16} />}
                onClick={() => navigate("/export-center")}
                radius="md"
              >
                Continue to Export Center
              </Button>
            </Group>
          )}
        </Card>
      </Stack>
</div>
  );
}