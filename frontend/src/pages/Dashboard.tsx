import {
  Card,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import {
  useAnalysisStore,
} from "../store/analysisStore";

export default function Dashboard() {

  const {
    analysis,
    testCases,
    rtm,
  } =
    useAnalysisStore();

  const documentCount =
    analysis ? 1 : 0;

  const requirementCount =
    analysis?.requirements
      ?.length || 0;

  const testCaseCount =
    testCases?.length || 0;

  const rtmCount =
    rtm?.length || 0;

  const riskCount =
    analysis?.risks
      ?.length || 0;

  return (

    <div
      style={{
        width: "100%",
        padding: "16px",
      }}
    >

      <Stack>

        <Paper
          p="md"
          radius="md"
          withBorder
        >

          <Title order={2}>
            QA Document Intelligence Platform
          </Title>

          <Text c="dark">

            Centralized Requirement,
            Test Case and RTM Management

          </Text>

        </Paper>

        <Grid>

          <Grid.Col span={3}>

            <Card
              withBorder
            >

              <Text
                size="sm"
                c="dimmed"
              >
                Documents
              </Text>

              <Title order={2}>
                {documentCount}
              </Title>

            </Card>

          </Grid.Col>

          <Grid.Col span={3}>

            <Card
              withBorder
            >

              <Text
                size="sm"
                c="dimmed"
                 fw={500}
              >
                Requirements
              </Text>

              <Title order={2}>
                {requirementCount}
              </Title>

            </Card>

          </Grid.Col>

          <Grid.Col span={3}>

            <Card
              withBorder
            >

              <Text
                size="sm"
                c="dimmed"
                 fw={500}
              >
                Test Cases
              </Text>

              <Title order={2}>
                {testCaseCount}
              </Title>

            </Card>

          </Grid.Col>

          <Grid.Col span={3}>

            <Card
              withBorder
            >

              <Text
                size="sm"
                c="dimmed"
              >
                RTMs
              </Text>

              <Title order={2}>
                {rtmCount}
              </Title>

            </Card>

          </Grid.Col>

        </Grid>

        <Grid>

          <Grid.Col span={6}>

            <Card
              withBorder
            >

              <Text fw={700}>
                Risks Identified
              </Text>

              <Title order={2}>
                {riskCount}
              </Title>

            </Card>

          </Grid.Col>

          <Grid.Col span={6}>

            <Card
              withBorder
            >

              <Text fw={700}>
                Current Document
              </Text>

              <Text>

                {
                  analysis?.document_name ||
                  "No Document Uploaded"
                }

              </Text>

            </Card>

          </Grid.Col>

        </Grid>

      </Stack>

    </div>

  );
}