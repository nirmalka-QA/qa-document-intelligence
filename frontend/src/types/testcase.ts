export interface TestCase {

  testcase_id: string;

  test_title: string;

  pre_requisites: string;

  test_data: string;

  test_step_number: number;

  test_steps: string;

  expected_result: string;

  actual_result: string;

  test_step_status: string;

  overall_status: string;

  priority: string;

  comments: string;

  requirement_id: string;

  release_sprint: string;
}