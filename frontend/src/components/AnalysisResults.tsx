import { Card, Stack, Text, Group, SimpleGrid, ThemeIcon } from "@mantine/core";
import { DonutChart } from "@mantine/charts";
import { 
  IconChecklist, 
  IconAlertTriangle, 
  IconZoomExclamation, 
  IconTestPipe 
} from "@tabler/icons-react";

interface Props {
  data: any;
}

export default function AnalysisResults({ data }: Props) {
  if (!data) return null;

  const reqCount = data.requirements?.length || 0;
  const riskCount = data.risks?.length || 0;
  const gapCount = data.gaps?.length || 0;
  const testCount = data.generated_testcases || 0;

  // Chart data configuration
  const chartData = [
    { name: "Requirements", value: reqCount, color: "blue.5" },
    { name: "Risks", value: riskCount, color: "red.5" },
    { name: "Gaps", value: gapCount, color: "orange.5" },
    { name: "Test Cases", value: testCount, color: "teal.5" },
  ].filter(item => item.value > 0); // Only show segments with actual data

  return (
    <Card shadow="sm" p="xl" radius="md" withBorder>
      <Stack gap="xl">
        <div>
          <Text fw={700} size="xl" c="dark.9">Intelligence Summary</Text>
          <Text size="sm" c="dimmed">
            Analyzed {data.document_name || "Manual Input"} ({data.document_type || "Text"})
          </Text>
        </div>

        <Group align="center" gap={50}>
          {/* Donut Chart Visualization */}
          {chartData.length > 0 ? (
            <DonutChart 
              data={chartData} 
              size={160} 
              thickness={20} 
              paddingAngle={5}
              withLabelsLine={false}
              withLabels={false}
            />
          ) : (
            <Text c="dimmed" fs="italic">No actionable data extracted yet.</Text>
          )}

          {/* Key Metrics Grid */}
          <SimpleGrid cols={2} spacing="xl" verticalSpacing="lg" style={{ flex: 1 }}>
            <Group gap="sm">
              <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                <IconChecklist size={20} />
              </ThemeIcon>
              <div>
                <Text size="sm" c="dimmed" fw={500} tt="uppercase">Requirements</Text>
                <Text fw={700} size="xl">{reqCount}</Text>
              </div>
            </Group>

            <Group gap="sm">
              <ThemeIcon variant="light" color="red" size="lg" radius="md">
                <IconAlertTriangle size={20} />
              </ThemeIcon>
              <div>
                <Text size="sm" c="dimmed" fw={500} tt="uppercase">Risks</Text>
                <Text fw={700} size="xl">{riskCount}</Text>
              </div>
            </Group>

            <Group gap="sm">
              <ThemeIcon variant="light" color="orange" size="lg" radius="md">
                <IconZoomExclamation size={20} />
              </ThemeIcon>
              <div>
                <Text size="sm" c="dimmed" fw={500} tt="uppercase">Gaps Detected</Text>
                <Text fw={700} size="xl">{gapCount}</Text>
              </div>
            </Group>

            <Group gap="sm">
              <ThemeIcon variant="light" color="teal" size="lg" radius="md">
                <IconTestPipe size={20} />
              </ThemeIcon>
              <div>
                <Text size="sm" c="dimmed" fw={500} tt="uppercase">Test Scenarios</Text>
                <Text fw={700} size="xl">{testCount}</Text>
              </div>
            </Group>
          </SimpleGrid>
        </Group>
      </Stack>
    </Card>
  );
}