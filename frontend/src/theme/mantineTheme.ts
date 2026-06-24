// src/theme/mantineTheme.ts
import { createTheme, Card, Paper, Table, Textarea } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "blue",
  defaultRadius: "md",
  
  // 1. Global Component Overrides
  components: {
    
    // Make all Cards automatically adapt their background and borders
    Card: Card.extend({
      styles: {
        root: {
          backgroundColor: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-5))",
          color: "light-dark(var(--mantine-color-black), var(--mantine-color-gray-2))",
        },
      },
    }),

    // Make all Paper elements (like headers/steppers) adapt
    Paper: Paper.extend({
      styles: {
        root: {
          backgroundColor: "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))",
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-5))",
        },
      },
    }),

    // Fix Table header backgrounds which usually get stuck on gray.0
    Table: Table.extend({
      styles: {
        thead: {
          backgroundColor: "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))",
        },
        tr: {
          borderColor: "light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-6))",
        }
      },
    }),

    // Ensure Textareas (like in your PasteContent) don't have glaring white backgrounds in dark mode
    Textarea: Textarea.extend({
      styles: {
        input: {
          backgroundColor: "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))",
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-5))",
          color: "light-dark(var(--mantine-color-black), var(--mantine-color-gray-3))",
        },
      },
    }),
  },
});