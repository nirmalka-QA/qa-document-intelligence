export interface AnalysisResponse {
  document_name: string;
  document_type: string;
  file_size: number;

  requirements: string[];
  business_rules: string[];
  validations: string[];

  risks: string[];
  gaps: string[];

  generated_testcases: number;

  extracted_text_length: number;
}