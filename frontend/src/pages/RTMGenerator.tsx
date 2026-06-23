import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

import {
  useAnalysisStore,
} from "../store/analysisStore";

export default function RTMGenerator() {

  const navigate =
    useNavigate();

  const {
    analysis,
    testCases,
    rtm,
    setRTM,
  } =
    useAnalysisStore();

  const [loading, setLoading] =
    useState(false);

  const generateRTM =
    async () => {

      try {

        setLoading(true);

        const response =
          await api.post(
            "/api/rtm/generate",
            {

              requirements:
                analysis?.requirements || [],

              testcases:
                testCases || [],
            }
          );

        setRTM(
          response.data.rtm
        );

      } catch (error) {

        console.error(error);

        alert(
          "Failed To Generate RTM"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <Container
      size="xl"
      py="md"
    >

      <Stack>

        <Paper
          p="md"
          radius="md"
          withBorder
        >

          <Group
            justify="space-between"
          >

            <div>

              <Title order={2}>
                RTM Generator
              </Title>

              <Text c="dimmed">

                Generate Requirement
                Traceability Matrix

              </Text>

            </div>

            <Badge
              size="xl"
              color="green"
            >
              {
                analysis?.requirements
                  ?.length || 0
              }
              {" "}
              Requirements
            </Badge>

          </Group>

        </Paper>

        <Card
          withBorder
          shadow="sm"
        >

          <Group
            justify="space-between"
            mb="md"
          >

            <Text fw={700}>
              Requirement Coverage
            </Text>

            <Button
              loading={loading}
              onClick={
                generateRTM
              }
            >
              Generate RTM
            </Button>

          </Group>

          {

            rtm.length > 0 && (

              <Badge
                mb="md"
                size="lg"
              >
                RTM Rows:
                {" "}
                {rtm.length}
              </Badge>

            )

          }

          <ScrollArea
            h={650}
          >

            <Table
              striped
              highlightOnHover
              withTableBorder
              stickyHeader
            >

              <Table.Thead>

                <Table.Tr>

                  <Table.Th>
                    Requirement ID
                  </Table.Th>

                  <Table.Th>
                    Requirement
                  </Table.Th>

                  <Table.Th>
                    Test Cases
                  </Table.Th>

                  <Table.Th>
                    Coverage
                  </Table.Th>

                  <Table.Th>
                    Status
                  </Table.Th>

                </Table.Tr>

              </Table.Thead>

              <Table.Tbody>

                {

                  rtm.length > 0 ?

                    rtm.map(
                      (
                        row,
                        index
                      ) => (

                        <Table.Tr
                          key={index}
                        >

                          <Table.Td>
                            {
                              row.requirement_id
                            }
                          </Table.Td>

                          <Table.Td>
                            {
                              row.requirement
                            }
                          </Table.Td>

                          <Table.Td>
                            {
                              row.testcase_ids
                            }
                          </Table.Td>

                          <Table.Td>
                            {
                              row.coverage
                            }
                          </Table.Td>

                          <Table.Td>

                            <Badge
                              color="green"
                            >
                              {
                                row.status
                              }
                            </Badge>

                          </Table.Td>

                        </Table.Tr>

                      )
                    )

                    :

                    <Table.Tr>

                      <Table.Td
                        colSpan={5}
                      >

                        <Text
                          ta="center"
                          c="dimmed"
                        >

                          Click Generate RTM
                          to create
                          Requirement
                          Traceability Matrix

                        </Text>

                      </Table.Td>

                    </Table.Tr>

                }

              </Table.Tbody>

            </Table>

          </ScrollArea>
          {
            rtm.length > 0 && (

              <Group
                justify="flex-end"
                mt="md"
              >

                <Button
                  color="green"
                  onClick={() =>
                    navigate(
                      "/export-center"
                    )
                  }
                >
                  Continue To Export →
                </Button>

              </Group>

            )
          }

        </Card>

      </Stack>

    </Container>
  );
}