import {
  Badge,
  Button,
  Card,
  ScrollArea,
  Stack,
  Table,
  Textarea,
  Title,
  Group,
} from "@mantine/core";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../services/api";

import {
  useAnalysisStore,
} from "../store/analysisStore";

export default function TestCaseGenerator() {

  const navigate =
    useNavigate();

  const {
    requirementsText,
    testCases,
    setTestCases,
  } =
    useAnalysisStore();

  const [requirement, setRequirement] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    setRequirement(
      requirementsText
    );

  }, [
    requirementsText
  ]);

  const generateCases =
    async () => {

      if (
        !requirement.trim()
      ) {

        alert(
          "No requirements available"
        );

        return;
      }

      try {

        setLoading(true);

        const response =
          await api.post(
            "/api/documents/analyze-text",
            {
              content:
                requirement,
            }
          );

        const generatedCases =
          response.data
            ?.testcases || [];

        setTestCases(
          generatedCases
        );

      } catch (
        error
      ) {

        console.error(
          error
        );

        alert(
          "Failed to generate test cases"
        );

      } finally {

        setLoading(false);
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

        <Title>
          Test Case Generator
        </Title>

        <Textarea
          label="Requirements / User Stories"
          minRows={10}
          value={requirement}
          onChange={(e) =>
            setRequirement(
              e.currentTarget.value
            )
          }
        />

        <Button
          loading={loading}
          onClick={
            generateCases
          }
        >
          Generate Test Cases
        </Button>

        {

          testCases.length > 0 && (

            <Card
              withBorder
            >

              <Stack>

                <Group
                  justify="space-between"
                >

                  <Badge
                    size="lg"
                    color="green"
                  >
                    Generated:
                    {" "}
                    {
                      testCases.length
                    }
                  </Badge>

                  <Button
                    color="blue"
                    onClick={() =>
                      navigate(
                        "/rtm-generator"
                      )
                    }
                  >
                    Continue To RTM →
                  </Button>

                </Group>

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
                          Test Case ID
                        </Table.Th>

                        <Table.Th>
                          Test Title
                        </Table.Th>

                        <Table.Th>
                          Requirement ID
                        </Table.Th>

                        <Table.Th>
                          Priority
                        </Table.Th>

                        <Table.Th>
                          Expected Result
                        </Table.Th>

                      </Table.Tr>

                    </Table.Thead>

                    <Table.Tbody>

                      {

                        testCases.map(
                          (
                            tc,
                            index
                          ) => (

                            <Table.Tr
                              key={index}
                            >

                              <Table.Td>
                                {
                                  tc.testcase_id
                                }
                              </Table.Td>

                              <Table.Td>
                                {
                                  tc.test_title
                                }
                              </Table.Td>

                              <Table.Td>
                                {
                                  tc.requirement_id
                                }
                              </Table.Td>

                              <Table.Td>
                                {
                                  tc.priority
                                }
                              </Table.Td>

                              <Table.Td>
                                {
                                  tc.expected_result
                                }
                              </Table.Td>

                            </Table.Tr>

                          )
                        )

                      }

                    </Table.Tbody>

                  </Table>

                </ScrollArea>

              </Stack>

            </Card>

          )

        }

      </Stack>

    </div>
  );
}