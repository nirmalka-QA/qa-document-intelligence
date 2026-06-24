import { Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Props {
  testCases: any[];
}

export default function TestCaseExportButton({ testCases }: Props) {
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(testCases);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Test Cases");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, "TestCases.xlsx");
  };

  return (
    <Button
      variant="light"
      color="teal"
      fullWidth
      radius="md"
      leftSection={<IconDownload size={18} />}
      onClick={exportExcel}
      disabled={!testCases || testCases.length === 0}
    >
      Export Test Cases
    </Button>
  );
}