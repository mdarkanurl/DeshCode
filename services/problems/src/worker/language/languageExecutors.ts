import { JavaScript } from "./javascrypt/javascript";
import { LanguageExecutor } from "./types";

export const languageExecutors: Record<string, LanguageExecutor> = {
  javascript: JavaScript
};