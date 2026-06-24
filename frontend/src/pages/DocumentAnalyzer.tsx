import { Grid, Stack, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
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
        <Title order={2}>QA Document Intelligence</Title>

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