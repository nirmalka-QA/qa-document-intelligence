import {
  Button,
  Container,
  Stack,
  Title,
} from "@mantine/core";

import {
  useAnalysisStore,
} from "../store/analysisStore";

import TestCaseExportButton
  from "../components/TestCaseExportButton";

import RTMExportButton
  from "../components/RTMExportButton";

export default function ExportCenter() {

  const {
    testCases,
    rtm,
  } =
    useAnalysisStore();

  return (

  <div
  style={{
    width: "100%",
    padding: "12px",
  }}
>

      <Stack>

        <Title>
          Export Center
        </Title>

        <TestCaseExportButton
          testCases={
            testCases
          }
        />

        <RTMExportButton
          rtm={rtm}
        />

        <Button
          color="green"
        >
          Export Analysis Report
        </Button>

      </Stack>

    </div>

  );
}