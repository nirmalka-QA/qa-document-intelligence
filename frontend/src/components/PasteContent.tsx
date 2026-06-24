import { useState } from "react";
import { Button, Stack, Textarea, Card, Text, Group } from "@mantine/core";
import { IconWand, IconForms } from "@tabler/icons-react";

interface Props {
  onAnalyze: (content: string) => Promise<void>;
}

export default function PasteContent({ onAnalyze }: Props) {
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await onAnalyze(content);
    setIsAnalyzing(false);
  };

  return (
    <Card shadow="sm" radius="md" p="xl" withBorder mt="md">
      <Stack gap="md">
        <Group gap="sm">
          <IconForms color="var(--mantine-color-blue-6)" />
          <Text fw={700} size="xl" c="dark.9">Manual Input</Text>
        </Group>

        <Textarea
          minRows={8}
          maxRows={15}
          autosize
          placeholder="Paste Business Requirements Document (BRD), Software Requirements Specification (SRS), or User Stories here..."
          value={content}
          onChange={(event) => setContent(event.currentTarget.value)}
          styles={{
            input: {
              fontFamily: 'monospace',
              fontSize: '14px',
              backgroundColor: 'var(--mantine-color-gray-0)',
              border: '1px solid var(--mantine-color-gray-3)'
            }
          }}
        />

        <Group justify="flex-end">
          <Button
            radius="md"
            size="md"
            leftSection={<IconWand size={18} />}
            onClick={handleAnalyze}
            loading={isAnalyzing}
            disabled={!content.trim()}
          >
            Analyze Content
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}