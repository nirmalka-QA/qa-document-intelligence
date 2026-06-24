import {Grid,
  Group,
  Stack,
  Text,
  Title,
  ThemeIcon,
  Paper } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconFileAnalytics,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import UploadDocument from "../components/UploadDocument";
import PasteContent from "../components/PasteContent";
import AnalysisResults from "../components/AnalysisResults";
import RequirementPanel from "../components/RequirementPanel";
import RiskPanel from "../components/RiskPanel";
import { useAnalysisStore } from "../store/analysisStore";
import type { AnalysisResponse } from "../types/analysis";

export default function DocumentAnalyzer() {
  const { analysis, setAnalysis, setRequirementsText, setTestCases, setRTM } =
    useAnalysisStore();
  const navigate = useNavigate();

  const applyResult = (data: AnalysisResponse) => {
    setAnalysis(data);
    setTestCases(data?.testcases || []);
    setRTM(data?.rtm || []);
    setRequirementsText(data?.requirements?.join("\n") || "");
  };

  const handleAnalyze = async (content: string) => {
    if (!content.trim()) {
      notifications.show({
        title: "Validation Error",
        message: "Please enter content to analyze",
        color: "red",
      });
      return;
    }

    try {
      const response = await api.post("/api/documents/analyze-text", { content });
      applyResult(response.data);
      notifications.show({
        title: "Success",
        message: "Analysis completed successfully",
        color: "green",
      });
      navigate("/testcase-generator");
    } catch (error: any) {
      console.error(error);
      notifications.show({
        title: "Analysis Failed",
        message:
          error?.response?.data?.detail || "An error occurred during analysis",
        color: "red",
      });
    }
  };

  const handleUploadComplete = (data: AnalysisResponse) => {
    applyResult(data);
    notifications.show({
      title: "Upload Complete",
      message: "Document analyzed successfully",
      color: "green",
    });
    navigate("/testcase-generator");
  };

  return (
    <div style={{ width: "100%", padding: "12px" }}>
      <Stack>
        {/* Premium Analyzer Header */}
        <Paper p="xl" radius="md" withBorder shadow="sm" bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))">
          <Group justify="space-between">
            <Group gap="md">
              <ThemeIcon size={50} radius="md" variant="light" color="indigo">
                <IconFileAnalytics size={28} />
              </ThemeIcon>
              <div>
                <Title order={2}>Document Analyzer</Title>
                <Text c="dimmed" mt={4}>
                  Upload or paste your business requirements to extract actionable intelligence.
                </Text>
              </div>
            </Group>
            {/* Context Metric */}
            <Stack gap={4} align="flex-end">
               <Text size="xs" tt="uppercase" fw={600} c="dimmed">Status</Text>
               <Text size="xl" fw={800} c={analysis ? "green.6" : "dimmed"}>
                 {analysis ? "Analyzed" : "Pending"}
               </Text>
            </Stack>
          </Group>
        </Paper>
                <UploadDocument onAnalysisComplete={handleUploadComplete} />

        <PasteContent onAnalyze={handleAnalyze} />

        <AnalysisResults data={analysis} />

        <Grid>
          <Grid.Col span={6}>
            <RequirementPanel requirements={analysis?.requirements || []} />
          </Grid.Col>
          <Grid.Col span={6}>
            <RiskPanel risks={analysis?.risks || []} />
          </Grid.Col>
        </Grid>
      </Stack>
    </div>
  );
}