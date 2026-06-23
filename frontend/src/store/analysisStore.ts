import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  TestCase
} from "../types/testcase";

interface AnalysisStore {

  analysis: any;

  requirementsText: string;

  testCases: TestCase[];

  rtm: any[];

  setAnalysis: (
    data: any
  ) => void;

  setRequirementsText: (
    value: string
  ) => void;

  setTestCases: (
    data: TestCase[]
  ) => void;

  setRTM: (
    data: any[]
  ) => void;

  clearAll: () => void;
}

export const useAnalysisStore =
  create<AnalysisStore>()(

    persist(

      (set) => ({

        analysis: null,

        requirementsText: "",

        testCases: [],

        rtm: [],

        setAnalysis: (
          data
        ) =>
          set({
            analysis: data,
          }),

        setRequirementsText: (
          value
        ) =>
          set({
            requirementsText: value,
          }),

        setTestCases: (
          data
        ) =>
          set({
            testCases: data,
          }),

        setRTM: (
          data
        ) =>
          set({
            rtm: data,
          }),

        clearAll: () =>
          set({
            analysis: null,
            requirementsText: "",
            testCases: [],
            rtm: [],
          }),

      }),

      {
        name:
          "qa-analysis-store",
      }

    )

  );