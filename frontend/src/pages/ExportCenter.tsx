import {
  Container,
  Stack,
  Title,
  Text,
  SimpleGrid,
  Card,
  Group,
  ThemeIcon,
  Button
} from "@mantine/core";
import { useAnalysisStore } from "../store/analysisStore";
import TestCaseExportButton from "../components/TestCaseExportButton";
import RTMExportButton from "../components/RTMExportButton";
import { IconFileSpreadsheet, IconReportAnalytics, IconDownload } from "@tabler/icons-react";

export default function ExportCenter() {
  const { testCases, rtm } = useAnalysisStore();

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={2} c="dark.9">Export Center</Title>
          <Text c="dimmed" mt={4}>
            Download your generated intelligence artifacts for external review or test management tools.
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          
          {/* Test Case Export Card */}
          <Card withBorder radius="md" p="xl" shadow="sm">
            <Stack justify="space-between" h="100%">
              <Stack gap="xs">
                <ThemeIcon size={48} radius="md" variant="light" color="teal">
                  <IconFileSpreadsheet size={26} />
                </ThemeIcon>
                <Text fw={700} size="lg" mt="md">Test Cases</Text>
                <Text size="sm" c="dimmed">
                  Export all generated functional and non-functional test scenarios into an Excel spreadsheet.
                </Text>
              </Stack>
              <TestCaseExportButton testCases={testCases} />
            </Stack>
          </Card>

          {/* RTM Export Card */}
          <Card withBorder radius="md" p="xl" shadow="sm">
            <Stack justify="space-between" h="100%">
              <Stack gap="xs">
                <ThemeIcon size={48} radius="md" variant="light" color="blue">
                  <IconFileSpreadsheet size={26} />
                </ThemeIcon>
                <Text fw={700} size="lg" mt="md">Traceability Matrix</Text>
                <Text size="sm" c="dimmed">
                  Download the RTM mapping requirements to test cases to ensure 100% coverage.
                </Text>
              </Stack>
              <RTMExportButton rtm={rtm} />
            </Stack>
          </Card>

          {/* Full Report Export Card */}
          <Card withBorder radius="md" p="xl" shadow="sm">
            <Stack justify="space-between" h="100%">
              <Stack gap="xs">
                <ThemeIcon size={48} radius="md" variant="light" color="grape">
                  <IconReportAnalytics size={26} />
                </ThemeIcon>
                <Text fw={700} size="lg" mt="md">Executive Report</Text>
                <Text size="sm" c="dimmed">
                  Generate a comprehensive PDF or Document report detailing risks, gaps, and coverage.
                </Text>
              </Stack>
              <Button 
                variant="light" 
                color="grape" 
                fullWidth 
                leftSection={<IconDownload size={18} />}
                radius="md"
              >
                Export Analysis Report
              </Button>
            </Stack>
          </Card>

        </SimpleGrid>
      </Stack>
    </Container>
  );
}