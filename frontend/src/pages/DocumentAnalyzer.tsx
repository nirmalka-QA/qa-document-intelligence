import {
  Container,
  Grid,
  Stack,
  Title,
} from "@mantine/core";

import api from "../services/api";

import UploadDocument from "../components/UploadDocument";
import PasteContent from "../components/PasteContent";
import AnalysisResults from "../components/AnalysisResults";
import RequirementPanel from "../components/RequirementPanel";
import RiskPanel from "../components/RiskPanel";
import {
  useNavigate
} from "react-router-dom";
import {
  useAnalysisStore,
} from "../store/analysisStore";

export default function DocumentAnalyzer() {

  const {
    analysis,
    setAnalysis,
    setRequirementsText,
    setTestCases,
    setRTM,
  } =
    useAnalysisStore();
    const navigate =
  useNavigate();
  
  const handleAnalyze =
    async (
      content: string
    ) => {

      if (
        !content.trim()
      ) {

        alert(
          "Please enter content"
        );

        return;
      }

      try {

        const response =
          await api.post(
            "/api/documents/analyze-text",
            {
              content,
            }
          );

        setAnalysis(
          response.data
        );
navigate(
  "/testcase-generator"
);
        setTestCases(
          response.data
            ?.testcases || []
        );

        setRTM(
          response.data
            ?.rtm || []
        );

        setRequirementsText(

          response.data
            ?.requirements
            ?.join("\n") || ""

        );

      } catch (
      error
      ) {

        console.error(
          error
        );

        alert(
          "Analysis Failed"
        );
      }
    };

  return (

<div
  style={{
    width: "100%",
    padding: "12px",
  }}
>

      <Stack>

        <Title order={2}>
          QA Document Intelligence
        </Title>

        <UploadDocument
          onAnalysisComplete={(
            data
          ) => {

            setAnalysis(
              data
            );
            setTimeout(() => {

  navigate(
    "/testcase-generator"
  );

}, 1000);

            setRequirementsText(

              data
                ?.requirements
                ?.join("\n") || ""

            );
          }}
        />

        <PasteContent
          onAnalyze={
            handleAnalyze
          }
        />

        <AnalysisResults
          data={analysis}
        />

        <Grid>

          <Grid.Col span={6}>

            <RequirementPanel
              requirements={
                analysis?.requirements || []
              }
            />

          </Grid.Col>

          <Grid.Col span={6}>

            <RiskPanel
              risks={
                analysis?.risks || []
              }
            />

          </Grid.Col>

        </Grid>

      </Stack>

    </div>
  );
}