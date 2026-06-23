import {
  Box,
  Card,
  Group,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";

import {
  IconCheck,
} from "@tabler/icons-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const steps = [
  {
    number: "00",
    title: "Dashboard",
    subtitle: "Overview",
    path: "/",
  },
  {
    number: "01",
    title: "Analyzer",
    subtitle: "Requirements",
    path: "/document-analyzer",
  },
  {
    number: "02",
    title: "Test Cases",
    subtitle: "Coverage",
    path: "/testcase-generator",
  },
  {
    number: "03",
    title: "RTM",
    subtitle: "Traceability",
    path: "/rtm-generator",
  },
  {
    number: "04",
    title: "Export",
    subtitle: "Reports",
    path: "/export-center",
  },
];

export default function WorkflowStepper() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const theme =
    useMantineTheme();

  const {
    colorScheme,
  } =
    useMantineColorScheme();

  const isDark =
    colorScheme === "dark";

  const activeIndex =
    steps.findIndex(
      (step) =>
        step.path ===
        location.pathname
    );

  return (

    <Card
      shadow="xs"
      radius="md"
      withBorder
      p="sm"
      mb="md"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background:
          isDark
            ? theme.colors.dark[7]
            : "#ffffff",
      }}
    >

      <Group
        gap="xs"
        wrap="nowrap"
        align="stretch"
      >

        {steps.map(
          (
            step,
            index
          ) => {

            const isActive =
              location.pathname ===
              step.path;

            const isCompleted =
              index <
              activeIndex;

            return (

              <Box
                key={step.path}
                style={{
                  flex: 1,
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate(
                    step.path
                  )
                }
              >

                <Card
                  radius="md"
                  p="xs"
                  withBorder
                  style={{

                    transition:
                      "all 0.2s ease",

                    background:

                      isActive

                        ? (

                            isDark

                              ? theme.colors.blue[9]

                              : "#eef7ff"

                          )

                        : (

                            isDark

                              ? theme.colors.dark[6]

                              : "#ffffff"

                          ),

                    border:

                      isActive

                        ? `2px solid ${theme.colors.blue[6]}`

                        : `1px solid ${
                            isDark
                              ? theme.colors.dark[4]
                              : "#dee2e6"
                          }`,

                    boxShadow:

                      isActive

                        ? "0 4px 12px rgba(34,139,230,0.20)"

                        : "none",

                    minHeight: 85,
                  }}
                >

                  <Stack gap={2}>

                    <Group
                      justify="space-between"
                    >

                      <Text
                        size="xs"
                        fw={700}
                        c={
                          isActive
                            ? "blue"
                            : undefined
                        }
                      >
                        {step.number}
                      </Text>

                      {

                        isCompleted && (

                          <ThemeIcon
                            color="green"
                            size={16}
                            radius="xl"
                          >

                            <IconCheck
                              size={10}
                            />

                          </ThemeIcon>

                        )

                      }

                    </Group>

                    <Text
                      fw={700}
                      size="sm"
                    >
                      {step.title}
                    </Text>

                    <Text
                      size="xs"
                      c="dimmed"
                    >
                      {step.subtitle}
                    </Text>

                  </Stack>

                </Card>

              </Box>

            );
          }
        )}

      </Group>

      <Progress
        mt="sm"
        size="sm"
        radius="xl"
        value={
          (
            (
              activeIndex + 1
            ) /
            steps.length
          ) * 100
        }
      />

    </Card>

  );
}