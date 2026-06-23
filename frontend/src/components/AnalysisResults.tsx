import {
  Card,
  Stack,
  Text,
  Divider,
} from "@mantine/core";

interface Props {
  data: any;
}

export default function AnalysisResults({
  data,
}: Props) {

  if (!data) return null;

  return (
    <Card
      shadow="sm"
      p="lg"
    >

      <Stack>

        <Text fw={700}>
          Analysis Results
        </Text>

        <Divider />

        <Text>
          Document:
          {" "}
          {data.document_name ||
            "Manual Input"}
        </Text>

        <Text>
          Type:
          {" "}
          {data.document_type ||
            "Text"}
        </Text>

        <Text>
          Requirements:
          {" "}
          {data.requirements?.length || 0}
        </Text>

        <Text>
          Business Rules:
          {" "}
          {data.business_rules?.length || 0}
        </Text>

        <Text>
          Risks:
          {" "}
          {data.risks?.length || 0}
        </Text>

        <Text>
          Gaps:
          {" "}
          {data.gaps?.length || 0}
        </Text>

        <Text>
          Test Cases:
          {" "}
          {data.generated_testcases || 0}
        </Text>

      </Stack>

    </Card>
  );
}