import { useState } from "react";

import {
  Button,
  Progress,
  Stack,
  Text,
  Card,
  Badge,
  Group,
  Alert,
} from "@mantine/core";

import {
  IconFileText,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";

import { Dropzone } from "@mantine/dropzone";

import api from "../services/api";

interface Props {
  onAnalysisComplete: (
    data: any
  ) => void;
}

export default function UploadDocument({
  onAnalysisComplete,
}: Props) {

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const [status, setStatus] =
    useState("");

  const [error, setError] =
    useState("");

  const handleUpload = async () => {

    if (!file) {

      setError(
        "Please select a document"
      );

      return;
    }

    try {

      setLoading(true);

      setError("");

      setStatus(
        "Uploading document..."
      );

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await api.post(
          "/api/documents/upload",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },

            onUploadProgress:
              (progressEvent) => {

                const percent =
                  Math.round(
                    (
                      progressEvent.loaded /
                      (
                        progressEvent.total || 1
                      )
                    ) * 100
                  );

                setUploadProgress(
                  percent
                );
              },
          }
        );

      setStatus(
        "Analyzing document..."
      );

      onAnalysisComplete(
        response.data
      );

      setStatus(
        "Analysis completed successfully"
      );

    } catch (err: any) {

      console.error(err);

      setError(
        err?.response?.data?.detail ||
        "Upload failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <Card
      shadow="md"
      radius="md"
      p="lg"
    >

      <Stack>

        <Text
          fw={700}
          size="lg"
        >
          Upload Document
        </Text>

        <Dropzone
          onDrop={(files) =>
            setFile(files[0])
          }
          maxSize={
            200 * 1024 ** 2
          }
        >

          <Stack
            align="center"
            py="xl"
          >

            <IconFileText
              size={48}
            />

            <Text>
              Drag & Drop
              PDF, DOCX,
              XLSX, PPTX
            </Text>

            <Text
              size="sm"
              c="dimmed"
            >
              Maximum file size:
              200 MB
            </Text>

          </Stack>

        </Dropzone>

        {file && (

          <Card
            withBorder
          >

            <Group
              justify="space-between"
            >

              <Text fw={600}>
                {file.name}
              </Text>

              <Badge
                color="cyan"
              >
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}
                MB
              </Badge>

            </Group>

          </Card>

        )}

        {loading && (

          <>

            <Progress
              value={
                uploadProgress
              }
              size="xl"
              animated
            />

            <Text
              ta="center"
            >
              {
                uploadProgress
              }
              %
            </Text>

          </>

        )}

        {status && (

          <Alert
            color="blue"
          >
            {status}
          </Alert>

        )}

        {error && (

          <Alert
            color="red"
            icon={
              <IconAlertCircle
                size={16}
              />
            }
          >
            {error}
          </Alert>

        )}

        <Button
          size="md"
          loading={loading}
          onClick={
            handleUpload
          }
        >
          Analyze Document
        </Button>

      </Stack>

    </Card>
  );
}