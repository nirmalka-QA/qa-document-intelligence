import type { TestCase } from "./testcase";
import type { RTM } from "./rtm";

export interface AnalysisResponse {
  document_id: number;
  document_name: string;
  document_type: string;
  file_size: number;

  requirements: string[];
  business_rules: string[];
  validations: string[];

  risks: string[];
  gaps: string[];

  testcases: TestCase[];
  rtm: RTM[];

  generated_testcases: number;
  generated_rtm: number;
  extracted_text_length: number;
}