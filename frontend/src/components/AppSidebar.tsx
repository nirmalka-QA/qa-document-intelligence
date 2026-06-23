import {
  Stack,
  Button,
  Box,
} from "@mantine/core";

import {
  useNavigate,
} from "react-router-dom";

export default function AppSidebar() {


  const navigate =
    useNavigate();

  return (

    <Box
      style={{
        width: 260,
      }}
      p="md"
    >

      <Stack>


        <Button
          variant="light"
          onClick={() =>
            navigate("/")
          }
        >
          Dashboard
        </Button>

        <Button
          variant="light"
          onClick={() =>
            navigate(
              "/document-analyzer"
            )
          }
        >
          Document Analyzer
        </Button>

        <Button
          variant="light"
          onClick={() =>
            navigate(
              "/testcase-generator"
            )
          }
        >
          Test Cases
        </Button>

        <Button
          variant="light"
          onClick={() =>
            navigate(
              "/rtm-generator"
            )
          }
        >
          RTM Generator
        </Button>

      </Stack>

    </Box>

  );
}

