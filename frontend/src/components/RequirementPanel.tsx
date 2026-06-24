import { Card, Text, List, ThemeIcon, ScrollArea, Group, Badge, Stack } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

interface Props {
  requirements: any[]; // Changed from string[] to any[] to accept both formats
}

export default function RequirementPanel({ requirements }: Props) {
  return (
    <Card withBorder shadow="sm" radius="md" p="md" h={400}>
      <Group justify="space-between" mb="md" style={{ borderBottom: '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))', paddingBottom: '12px' }}>
        <Text fw={700} size="lg">Extracted Requirements</Text>
        <Badge variant="light" color="blue">{requirements?.length || 0}</Badge>
      </Group>

      <ScrollArea h={320} offsetScrollbars>
        <List
          spacing="xl"
          size="sm"
          center={false}
          icon={
            <ThemeIcon color="blue" size={24} radius="xl" variant="light" mt={2}>
              <IconCheck size={14} />
            </ThemeIcon>
          }
        >
          {requirements?.length > 0 ? (
            requirements.map((req, index) => {
              // Intelligently check if it's the new AI object format or the old string format
              const isObject = typeof req === 'object' && req !== null;
              const reqId = isObject ? req.requirement_id : `REQ-${String(index + 1).padStart(3, '0')}`;
              const reqDesc = isObject ? req.description : req;
              const reqType = isObject ? req.type : "Functional";

              return (
                <List.Item key={index}>
                  <Stack gap={4}>
                    <Group gap="xs">
                      <Badge size="xs" variant="dot" color="blue">{reqId}</Badge>
                      <Badge size="xs" variant="outline" color="gray">{reqType}</Badge>
                    </Group>
                    <Text size="sm">{reqDesc}</Text>
                  </Stack>
                </List.Item>
              );
            })
          ) : (
            <Text c="dimmed" fs="italic" ta="center" mt="xl">No requirements found.</Text>
          )}
        </List>
      </ScrollArea>
    </Card>
  );
}