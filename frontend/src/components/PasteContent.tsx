import { useState } from "react";

import {
  Button,
  Stack,
  Textarea,
} from "@mantine/core";
interface Props {
  onAnalyze: (
    content: string
  ) => Promise<void>;
}

export default function PasteContent({
  onAnalyze,
}: Props) {

  const [content, setContent] =
    useState("");

  return (

    <Stack>

      <Textarea
        minRows={10}
        label="Paste Requirements"
        placeholder="Paste BRD, SRS, User Story..."
        value={content}
        onChange={(event) =>
          setContent(
            event.currentTarget.value
          )
        }
      />

      <Button
  onClick={() => {

    console.log(
      "Button Clicked"
    );

    console.log(
      content
    );

    onAnalyze(
      content
    );
  }}
>
  Analyze Content
</Button>

    </Stack>
  );
}