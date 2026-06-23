import { Button } from "@mantine/core";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Props {
  testCases: any[];
}

export default function TestCaseExportButton({
  testCases,
}: Props) {

  const exportExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(
        testCases
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Test Cases"
    );

    const excelBuffer =
      XLSX.write(
        workbook,
        {
          bookType: "xlsx",
          type: "array",
        }
      );

    const file =
      new Blob(
        [excelBuffer],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

    saveAs(
      file,
      "TestCases.xlsx"
    );
  };

  return (

    <Button
      color="green"
      onClick={exportExcel}
    >
      Export Test Cases
    </Button>

  );
}