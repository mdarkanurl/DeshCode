import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import amqplib from "amqplib";
import { SubmissionsRepo } from "../../../repo";
import { prepareCodeWithBabel } from "./babel/prepareCodeWithBabel";
import { runDocker } from "../../utils/dockerRunner";
import { isDeepStrictEqual } from "util";
import { SubmissionsStatus } from "@prisma/client";

const submissionsRepo = new SubmissionsRepo();

type TestResult = {
  input: any;
  expected: any;
  actual: string | null;
  error: string;
  status: string;
  passed: boolean;
};

export const JavaScript = async (
  channel: amqplib.Channel,
  msg: amqplib.ConsumeMessage,
  data: {
    submissionId: number;
    functionName: string;
    testCases: any[];
    ProblemsTypes: string
    code: string;
  }
) => {
  const submissionUUID = uuidv4();
  const tempDir = path.join(__dirname, "temp", submissionUUID);
  fs.mkdirSync(tempDir, { recursive: true });

  const userCodePath = path.join(tempDir, "user_code.js");

  try {
    const rewrittenCode = prepareCodeWithBabel(data.code, data.functionName);
    fs.writeFileSync(userCodePath, rewrittenCode);
  } catch (e: any) {
    await submissionsRepo.update(data.submissionId, {
      status: SubmissionsStatus.INVALID_FUNCTION_SIGNATURE,
      output: JSON.stringify({ error: e.message }),
    });
    channel.ack(msg);
    return;
  }

  let runnerFile: string;
  if(data.ProblemsTypes === "Linked_Lists") {
    runnerFile = "./runner/Linked-List.js";
  } else if(data.ProblemsTypes === "Trees_and_Graphs") {
    runnerFile = "./runner/Trees-and-Graphs.js";
  } else {
    runnerFile = "./runner/Normal-problems.js";
  }

  fs.writeFileSync(path.join(tempDir, "function_name.txt"), data.functionName);
  fs.copyFileSync(
    path.resolve(__dirname, runnerFile),
    path.join(tempDir, "runner.js")
  );

  const testResults: TestResult[] = [];

  for (const testCase of data.testCases) {
    try {
      let input =
        typeof testCase.input === "string"
          ? JSON.parse(testCase.input)
          : testCase.input;
      const expected =
        typeof testCase.expected === "object"
          ? JSON.stringify(testCase.expected)
          : testCase.expected;

      
      // Only transform object input
      if (!Array.isArray(input)) {
        input = Object.fromEntries(
          Object.entries(input).map(([key, value]) => [
            key,
            Array.isArray(value) ? value : [value],
          ])
        );
      }

      const result = runDocker({
        image: "thearkan/node.js",
        command: ["timeout", "8s", "node", "runner.js", JSON.stringify(input)],
        mountDir: tempDir,
      });

      const actualRaw = result.stdout?.trim() || "";
      const stderr = result.stderr?.trim() || "";
      let status: SubmissionsStatus = SubmissionsStatus.ACCEPTED;
      let passed = false;

      if (result.error) {
        status = SubmissionsStatus.EXECUTION_ERROR;
      } else if (result.signal === "SIGTERM") {
        status = SubmissionsStatus.TIME_OUT;
      } else {
        try {
          let actual = JSON.parse(actualRaw);
          if (typeof actual === 'object') actual = JSON.stringify(actual);
          passed = isDeepStrictEqual(actual, expected);
          status = passed ? SubmissionsStatus.ACCEPTED : SubmissionsStatus.WRONG_ANSWER;
        } catch (e) {
          status = SubmissionsStatus.INTERNAL_ERROR;
        }
      }

      testResults.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: actualRaw,
        error: stderr,
        status: status as SubmissionsStatus,
        passed,
      });
    } catch (e: any) {
      testResults.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: null,
        error: e.message,
        status: SubmissionsStatus.INTERNAL_ERROR,
        passed: false,
      });
    }
  }

  const allPassed = testResults.every((t) => t.passed);
  const hasFatal = testResults.some((t) =>
    [
      SubmissionsStatus.EXECUTION_ERROR as string,
      SubmissionsStatus.TIME_OUT as string,
      SubmissionsStatus.INTERNAL_ERROR as string,
    ].includes(t.status)
  );

  await submissionsRepo.update(data.submissionId, {
    status: allPassed
      ? SubmissionsStatus.ACCEPTED
      : hasFatal
      ? SubmissionsStatus.FAILED
      : SubmissionsStatus.WRONG_ANSWER,
    output: JSON.stringify(testResults),
  });

  fs.rmSync(tempDir, { recursive: true, force: true });
  channel.ack(msg);
};