import { Card, Text, List, ThemeIcon, ScrollArea, Group, Badge } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

interface Props {
  risks: string[];
}

export default function RiskPanel({ risks }: Props) {
  return (
    <Card withBorder shadow="sm" radius="md" p="md" h={400}>
      <Group justify="space-between" mb="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', paddingBottom: '12px' }}>
        <Text fw={700} size="lg" c="red.7">Identified Risks & Gaps</Text>
        <Badge variant="light" color="red">{risks?.length || 0}</Badge>
      </Group>

      <ScrollArea h={320} offsetScrollbars>
        <List
          spacing="md"
          size="sm"
          icon={
            <ThemeIcon color="red" size={24} radius="xl" variant="light">
              <IconAlertTriangle size={14} />
            </ThemeIcon>
          }
        >
          {risks?.length > 0 ? (
            risks.map((risk, index) => (
              <List.Item key={index} c="dark.7">{risk}</List.Item>
            ))
          ) : (
            <Text c="dimmed" fs="italic" ta="center" mt="xl">No risks identified.</Text>
          )}
        </List>
      </ScrollArea>
    </Card>
  );
}