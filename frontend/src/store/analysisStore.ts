import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AnalysisState {
  analysis: any | null;
  requirementsText: string;
  testCases: any[];
  rtm: any[];
  setAnalysis: (data: any) => void;
  setRequirementsText: (text: string) => void;
  setTestCases: (testCases: any[]) => void;
  setRTM: (rtm: any[]) => void;
  clearAll: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      analysis: null,
      requirementsText: "",
      testCases: [],
      rtm: [],
      setAnalysis: (data) => {
        // Unpack the JSON objects into a cleanly formatted string for the Test Case Textarea
        const parsedReqs = data.requirements?.map((req: any) => {
            if (typeof req === 'object' && req !== null) {
                return `[${req.requirement_id}] ${req.type}: ${req.description}`;
            }
            return String(req);
        }).join("\n\n") || "";

        set({ 
            analysis: data, 
            requirementsText: parsedReqs,
            testCases: [], // Reset downstream steps on new document
            rtm: [] 
        });
      },
      setRequirementsText: (text) => set({ requirementsText: text }),
      setTestCases: (testCases) => set({ testCases }),
      setRTM: (rtm) => set({ rtm }),
      clearAll: () => set({ analysis: null, requirementsText: "", testCases: [], rtm: [] })
    }),
    {
      name: 'qa-analysis-storage',
    }
  )
);