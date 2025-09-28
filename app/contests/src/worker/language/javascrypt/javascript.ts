import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import amqplib from "amqplib";
import { SubmissionsRepo } from "../../../repo";
import { prepareCodeWithBabel } from "./babel/prepareCodeWithBabel";
import { isDeepStrictEqual } from "util";
import { SubmissionsStatus } from "@prisma/client";
import { runWithQueue } from "../../utils/DockerQueue";  // ⬅️ new queue wrapper

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
    ProblemsTypes: string;
    code: string;
  }
) => {
  const submissionUUID = uuidv4();
  const tempDir = path.join(__dirname, "temp", submissionUUID);
  fs.mkdirSync(tempDir, { recursive: true });

  const userCodePath = path.join(tempDir, "user_code.js");

  // Step 1: Prepare code with Babel
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

  // Step 2: Pick correct runner
  let runnerFile: string;
  if (data.ProblemsTypes === "Linked_Lists") {
    runnerFile = "./runner/Linked-List.js";
  } else if (data.ProblemsTypes === "Trees_and_Graphs") {
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

  // Step 3: Queue jobs for all test cases
  const jobs = data.testCases.map(async (testCase) => {
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

      // Run inside Docker (through queue)
      const result = await runWithQueue({
        image: "thearkan/node.js",
        command: ["node", "runner.js", JSON.stringify(input)],
        mountDir: tempDir,
        timeout: 8000, // 8s hard stop
      });

      const actualRaw = result?.stdout?.trim() || "";
      const stderr = result?.stderr?.trim() || "";
      let status: SubmissionsStatus = SubmissionsStatus.ACCEPTED;
      let passed = false;

      if (stderr) {
        status = SubmissionsStatus.EXECUTION_ERROR;
      } else {
        try {
          let actual = JSON.parse(actualRaw);
          if (typeof actual === "object") actual = JSON.stringify(actual);
          passed = isDeepStrictEqual(actual, expected);
          status = passed
            ? SubmissionsStatus.ACCEPTED
            : SubmissionsStatus.WRONG_ANSWER;
        } catch {
          status = SubmissionsStatus.INTERNAL_ERROR;
        }
      }

      return {
        input: testCase.input,
        expected: testCase.expected,
        actual: actualRaw,
        error: stderr,
        status,
        passed,
      };
    } catch (e: any) {
      return {
        input: testCase.input,
        expected: testCase.expected,
        actual: null,
        error: e.message,
        status: SubmissionsStatus.INTERNAL_ERROR,
        passed: false,
      };
    }
  });

  // Step 4: Run all jobs with concurrency limit
  const results = await Promise.all(jobs);
  testResults.push(...results);

  // Step 5: Final submission status
  const allPassed = testResults.every((t) => t.passed);
  const fatalStatuses: SubmissionsStatus[] = [
    SubmissionsStatus.EXECUTION_ERROR,
    SubmissionsStatus.TIME_OUT,
    SubmissionsStatus.INTERNAL_ERROR,
  ];

  const hasFatal = testResults.some((t) => fatalStatuses.includes(t.status as SubmissionsStatus));


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
