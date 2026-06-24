import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import DocumentAnalyzer from "./pages/DocumentAnalyzer";
import TestCaseGenerator from "./pages/TestCaseGenerator";
import RTMGenerator from "./pages/RTMGenerator";
import ExportCenter from "./pages/ExportCenter";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "document-analyzer", // No leading slash
        element: <DocumentAnalyzer />,
      },
      {
        path: "testcase-generator", // No leading slash
        element: <TestCaseGenerator />,
      },
      {
        path: "rtm-generator", // No leading slash
        element: <RTMGenerator />,
      },
      {
        path: "export-center", // Removed the leading slash here!
        element: <ExportCenter />,
      },
    ],
  },
]);