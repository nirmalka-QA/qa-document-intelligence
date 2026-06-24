import { Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Props {
  rtm: any[];
}

export default function RTMExportButton({ rtm }: Props) {
  const exportRTM = () => {
    const worksheet = XLSX.utils.json_to_sheet(rtm);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RTM");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, "RTM.xlsx");
  };

  return (
    <Button
      variant="light"
      color="blue"
      fullWidth
      radius="md"
      leftSection={<IconDownload size={18} />}
      onClick={exportRTM}
      disabled={!rtm || rtm.length === 0}
    >
      Export RTM Matrix
    </Button>
  );
}