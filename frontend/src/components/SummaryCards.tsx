import {
  Card,
  Grid,
  Text,
} from "@mantine/core";

interface Props {
  analysis: any;
}

export default function SummaryCards({
  analysis,
}: Props) {

  if (!analysis) return null;

  return (

    <Grid>

      <Grid.Col span={3}>
        <Card withBorder>
          <Text fw={700}>
            Requirements
          </Text>

          <Text size="xl">
            {
              analysis
                ?.requirements
                ?.length || 0
            }
          </Text>
        </Card>
      </Grid.Col>

      <Grid.Col span={3}>
        <Card withBorder>
          <Text fw={700}>
            Risks
          </Text>

          <Text size="xl">
            {
              analysis
                ?.risks
                ?.length || 0
            }
          </Text>
        </Card>
      </Grid.Col>

      <Grid.Col span={3}>
        <Card withBorder>
          <Text fw={700}>
            Gaps
          </Text>

          <Text size="xl">
            {
              analysis
                ?.gaps
                ?.length || 0
            }
          </Text>
        </Card>
      </Grid.Col>

      <Grid.Col span={3}>
        <Card withBorder>
          <Text fw={700}>
            Test Cases
          </Text>

          <Text size="xl">
            {
              analysis
                ?.generated_testcases || 0
            }
          </Text>
        </Card>
      </Grid.Col>

    </Grid>
  );
}