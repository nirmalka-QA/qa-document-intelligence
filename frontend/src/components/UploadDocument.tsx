import { useState } from "react";
import {
  Button,
  Progress,
  Stack,
  Text,
  Card,
  Group,
  Alert,
  ThemeIcon,
  rem,
} from "@mantine/core";
import {
  IconCheck,
  IconAlertCircle,
  IconCloudUpload,
  IconFileTypePdf,
  IconX,
  IconFileText
} from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import api from "../services/api";

interface Props {
  onAnalysisComplete: (data: any) => void;
}

export default function UploadDocument({ onAnalysisComplete }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a document");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setStatus("Uploading document...");

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded / (progressEvent.total || 1)) * 100
          );
          setUploadProgress(percent);
        },
      });

      setStatus("Analyzing document...");
      onAnalysisComplete(response.data);
      setStatus("Analysis completed successfully");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" radius="md" p="xl" withBorder>
      <Stack gap="lg">
        <div>
          <Text fw={700} size="xl" c="dark.9">
            Upload Context Document
          </Text>
          <Text size="sm" c="dimmed">
            Provide a PRD, FRD, or architecture document to begin intelligence extraction.
          </Text>
        </div>

        <Dropzone
          onDrop={(files) => {
            setFile(files[0]);
            setError("");
          }}
          maxSize={200 * 1024 ** 2}
          radius="md"
          styles={{
            root: {
              backgroundColor: "var(--mantine-color-gray-0)",
              border: "2px dashed var(--mantine-color-gray-4)",
              transition: "border-color 0.2s ease, background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "var(--mantine-color-blue-0)",
                borderColor: "var(--mantine-color-blue-4)",
              },
            },
          }}
        >
          <Group justify="center" gap="xl" mih={180} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconCloudUpload style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <ThemeIcon size={80} radius={40} variant="light" color="blue">
                <IconCloudUpload style={{ width: rem(40), height: rem(40) }} stroke={1.5} />
              </ThemeIcon>
            </Dropzone.Idle>

            <Stack gap="xs" style={{ textAlign: "center" }}>
              <Text size="lg" inline fw={600}>
                Drag files here or click to select
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Attach PDF, DOCX, XLSX, or PPTX. Maximum file size is 200 MB.
              </Text>
            </Stack>
          </Group>
        </Dropzone>

        {file && (
          <Card withBorder radius="md" bg="blue.0" p="sm">
            <Group justify="space-between">
              <Group gap="sm">
                <IconFileTypePdf size={28} color="var(--mantine-color-blue-6)" stroke={1.5} />
                <div>
                  <Text fw={600} size="sm">{file.name}</Text>
                  <Text size="xs" c="dimmed">{(file.size / 1024 / 1024).toFixed(2)} MB</Text>
                </div>
              </Group>
              <IconCheck size={20} color="var(--mantine-color-green-6)" />
            </Group>
          </Card>
        )}

        {loading && (
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm" fw={500} c="blue">{status}</Text>
              <Text size="sm" fw={700}>{uploadProgress}%</Text>
            </Group>
            <Progress value={uploadProgress} size="md" radius="xl" animated />
          </Stack>
        )}

        {error && (
          <Alert color="red" variant="light" icon={<IconAlertCircle size={16} />} radius="md">
            {error}
          </Alert>
        )}

        <Button
          size="md"
          radius="md"
          loading={loading}
          onClick={handleUpload}
          fullWidth={false}
          style={{ alignSelf: "flex-start" }}
        >
          Extract Intelligence
        </Button>
      </Stack>
    </Card>
  );
}