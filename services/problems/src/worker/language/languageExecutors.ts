import { JavaScript } from "./js/javascript";
import { Python } from "./py/python"; // Placeholder
import { LanguageExecutor } from "./types";
import { runnerExecutors as jsRunnerExecutors } from "./javascrypt/runner/runnerExecutors";

// Placeholder Python problem type executors
const pythonProblemExecutors = {
  "Arrays-and-Strings": async () => { throw new Error("Python Arrays-and-Strings not implemented"); },
  "Linked-List": async () => { throw new Error("Python Linked-List not implemented"); },
  "Trees-and-Graphs": async () => { throw new Error("Python Trees-and-Graphs not implemented"); },
  "Dynamic-Programming": async () => { throw new Error("Python Dynamic-Programming not implemented"); },
  "Sorting-and-Searching": async () => { throw new Error("Python Sorting-and-Searching not implemented"); },
};

export const executors: Record<string, Record<string, import("./types").LanguageExecutor>> = {
  javascript: jsRunnerExecutors,
  python: pythonProblemExecutors,
};
