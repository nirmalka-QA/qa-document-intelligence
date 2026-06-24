import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AnalysisResponse } from "../types/analysis";
import type { TestCase } from "../types/testcase";
import type { RTM } from "../types/rtm";

interface AnalysisStore {
  analysis: AnalysisResponse | null;
  requirementsText: string;
  testCases: TestCase[];
  rtm: RTM[];

  setAnalysis: (data: AnalysisResponse) => void;
  setRequirementsText: (value: string) => void;
  setTestCases: (data: TestCase[]) => void;
  setRTM: (data: RTM[]) => void;
  clearAll: () => void;
}

export const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set) => ({
      analysis: null,
      requirementsText: "",
      testCases: [],
      rtm: [],

      setAnalysis: (data) => set({ analysis: data }),
      setRequirementsText: (value) => set({ requirementsText: value }),
      setTestCases: (data) => set({ testCases: data }),
      setRTM: (data) => set({ rtm: data }),

      clearAll: () =>
        set({
          analysis: null,
          requirementsText: "",
          testCases: [],
          rtm: [],
        }),
    }),
    { name: "qa-analysis-store" }
  )
);