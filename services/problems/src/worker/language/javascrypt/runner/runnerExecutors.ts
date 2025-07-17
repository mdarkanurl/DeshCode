import { arrayAndString, linkedLists, treesAndGraphs, dynamicProgramming, sortingAndSearching } from "./dockerFunc";
import { LanguageExecutor } from "../types";

export const runnerExecutors: Record<string, LanguageExecutor> = {
  "Arrays-and-Strings": arrayAndString,
  "Linked-List": linkedLists,
  "Trees-and-Graphs": treesAndGraphs,
  "Dynamic-Programming": dynamicProgramming,
  "Sorting-and-Searching": sortingAndSearching
};