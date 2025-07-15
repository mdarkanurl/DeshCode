import { JavaScript } from "./js/javascript";
import { Python } from "./py/python"; // Placeholder
import { LanguageExecutor } from "./types";

export const languageExecutors: Record<string, LanguageExecutor> = {
  javascript: JavaScript,
  python: Python,
};
