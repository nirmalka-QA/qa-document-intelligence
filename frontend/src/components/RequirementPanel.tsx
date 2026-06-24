import { Card, Text, List, ThemeIcon, ScrollArea, Group, Badge } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

interface Props {
  requirements: string[];
}

export default function RequirementPanel({ requirements }: Props) {
  return (
    <Card withBorder shadow="sm" radius="md" p="md" h={400}>
      <Group justify="space-between" mb="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', paddingBottom: '12px' }}>
        <Text fw={700} size="lg">Extracted Requirements</Text>
        <Badge variant="light" color="blue">{requirements?.length || 0}</Badge>
      </Group>

      <ScrollArea h={320} offsetScrollbars>
        <List
          spacing="md"
          size="sm"
          center
          icon={
            <ThemeIcon color="blue" size={24} radius="xl" variant="light">
              <IconCheck size={14} />
            </ThemeIcon>
          }
        >
          {requirements?.length > 0 ? (
            requirements.map((req, index) => (
              <List.Item key={index} c="dark.7">{req}</List.Item>
            ))
          ) : (
            <Text c="dimmed" fs="italic" ta="center" mt="xl">No requirements found.</Text>
          )}
        </List>
      </ScrollArea>
    </Card>
  );
}