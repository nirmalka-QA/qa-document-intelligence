import {
  Card,
  List,
  Text,
} from "@mantine/core";

interface Props {
  risks: string[];
}

export default function RiskPanel({
  risks,
}: Props) {
  return (
    <Card>

      <Text fw={700}>
        Risk Analysis
      </Text>

      <List>
        {risks?.map((risk, index) => (
          <List.Item key={index}>
            {risk}
          </List.Item>
        ))}
      </List>

    </Card>
  );
}