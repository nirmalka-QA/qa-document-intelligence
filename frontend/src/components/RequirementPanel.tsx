import {
  Card,
  List,
  Text,
} from "@mantine/core";

interface Props {
  requirements: string[];
}

export default function RequirementPanel({
  requirements,
}: Props) {
  return (
    <Card>

      <Text fw={700}>
        Requirements
      </Text>

      <List>
        {requirements?.map((req, index) => (
          <List.Item key={index}>
            {req}
          </List.Item>
        ))}
      </List>

    </Card>
  );
}