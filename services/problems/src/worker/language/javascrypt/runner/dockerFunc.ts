import { runDocker } from "../../utils/dockerRunner";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import amqplib from "amqplib";
import { SubmitRepo } from "../../../repo";
import { prepareCodeWithBabel } from "../babel/prepareCodeWithBabel";
import { isDeepStrictEqual } from "util";
import { LanguageExecutor } from "../types";

const submitRepo = new SubmitRepo();

function makeRunnerExecutor(runnerFile: string): LanguageExecutor {
  return async (channel, msg, data) => {
    const submissionUUID = uuidv4();
    const tempDir = path.join(__dirname, "temp", submissionUUID);
    fs.mkdirSync(tempDir, { recursive: true });

    const userCodePath = path.join(tempDir, "user_code.js");
    try {
      const rewrittenCode = prepareCodeWithBabel(data.code, data.functionName);
      fs.writeFileSync(userCodePath, rewrittenCode);
    } catch (e: any) {
      await submitRepo.update(data.submissionId, {
        status: "INVALID_FUNCTION_SIGNATURE",
        output: JSON.stringify({ error: e.message }),
      });
      channel.ack(msg);
      return;
    }
    fs.writeFileSync(path.join(tempDir, "function_name.txt"), data.functionName);
    fs.copyFileSync(path.resolve(__dirname, `./runner-file/${runnerFile}`), path.join(tempDir, "runner.js"));

    const testResults = [];
    for (const testCase of data.testCases) {
      try {
        const input = typeof testCase.input === "string" ? JSON.parse(testCase.input) : testCase.input;
        const expected = typeof testCase.expected === "string" ? JSON.parse(testCase.expected) : testCase.expected;
        const result = runDocker({
          image: "leetcode-js",
          command: ["timeout", "8s", "node", "runner.js", JSON.stringify(input)],
          mountDir: tempDir,
        });
        const actualRaw = result.stdout?.trim() || '';
        const stderr = result.stderr?.trim() || '';
        let status = "PASSED";
        let passed = false;
        if (result.error) {
          status = "EXECUTION_ERROR";
        } else if (result.signal === "SIGTERM") {
          status = "TIME_OUT";
        } else {
          try {
            const actual = JSON.parse(actualRaw);
            passed = isDeepStrictEqual(actual, expected);
            status = passed ? "PASSED" : "FAILED";
          } catch (e) {
            status = "INVALID_JSON_OUTPUT";
          }
        }
        testResults.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: actualRaw,
          error: stderr,
          status,
          passed
        });
      } catch (e: any) {
        testResults.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          error: e.message,
          status: "INTERNAL_ERROR",
          passed: false
        });
      }
    }
    const allPassed = testResults.every(t => t.passed);
    const hasFatal = testResults.some(t => ["EXECUTION_ERROR", "TIME_OUT", "INVALID_JSON_OUTPUT"].includes(t.status));
    await submitRepo.update(data.submissionId, {
      status: allPassed ? "ACCEPTED" : hasFatal ? "FAILED" : "WRONG_ANSWER",
      output: JSON.stringify(testResults),
    });
    channel.ack(msg);
  };
}

export const arrayAndString = makeRunnerExecutor("Arrays-and-Strings.js");
export const linkedLists = makeRunnerExecutor("Linked-List.js");
export const treesAndGraphs = makeRunnerExecutor("Trees-and-Graphs.js");
export const dynamicProgramming = makeRunnerExecutor("Dynamic-Programming.js");
export const sortingAndSearching = makeRunnerExecutor("Sorting-and-Searching.js");