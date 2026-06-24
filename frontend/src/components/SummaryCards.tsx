import { Card, Text, Group, ThemeIcon, SimpleGrid } from "@mantine/core";
import { 
  IconListDetails, 
  IconAlertHexagon, 
  IconZoomExclamation, 
  IconFlask 
} from "@tabler/icons-react";

interface Props {
  analysis: any;
}

export default function SummaryCards({ analysis }: Props) {
  if (!analysis) return null;

  const stats = [
    { title: "Requirements", value: analysis?.requirements?.length || 0, icon: IconListDetails, color: "blue" },
    { title: "Risks", value: analysis?.risks?.length || 0, icon: IconAlertHexagon, color: "red" },
    { title: "Gaps", value: analysis?.gaps?.length || 0, icon: IconZoomExclamation, color: "orange" },
    { title: "Test Cases", value: analysis?.generated_testcases || 0, icon: IconFlask, color: "teal" },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
      {stats.map((stat, idx) => (
        <Card 
          key={idx} 
          withBorder 
          radius="md" 
          padding="lg"
        >
          <Group justify="space-between" align="center">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase">
              {stat.title}
            </Text>
            <ThemeIcon variant="light" color={stat.color} size="md" radius="xl">
              <stat.icon size={16} stroke={2} />
            </ThemeIcon>
          </Group>
          <Text mt="md" size="xl" fw={700}>
            {stat.value}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  );
}