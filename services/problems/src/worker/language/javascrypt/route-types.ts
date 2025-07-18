// javascript/route-types.ts
import { ProblemTypes } from '../../../generated/prisma';
import { ArrayString } from './queue/array-string/array-string';
import { TreeGraph } from './queue/tree-graph/tree-graph';
import amqplib from "amqplib";
import { SubmitRepo } from "../../../repo";

const submitRepo = new SubmitRepo();

const problemTypeExecutors = {
  Arrays_and_Strings: ArrayString,
  Trees_and_Graphs: TreeGraph
  
};

export const JavaScript = async (
  channel: amqplib.Channel,
  msg: amqplib.ConsumeMessage,
  data: {
    submissionId: number;
    functionName: string;
    testCases: any[];
    code: string;
    ProblemType: ProblemTypes;
  }
) => {
  const executorFn = problemTypeExecutors[data.ProblemType];
  
  if (!executorFn) {
    console.error(`❌ No executor for problem type: ${data.ProblemType}`);
    // Send internal error
    await submitRepo.update(data.submissionId, {
      status: "INTERNAL_ERROR",
      output: JSON.stringify({ error: "Unsupported problem type" }),
    });
    return channel.ack(msg);
  }

  try {
    await executorFn({
      code: data.code,
      functionName: data.functionName,
      testCases: data.testCases,
      submissionId: data.submissionId,
    });
  } catch (e: unknown) {
    console.error(`❌ Execution error in ${data.ProblemType}:`, e);
    await submitRepo.update(data.submissionId, {
      status: "INTERNAL_ERROR",
      output: JSON.stringify({ error: (e as Error).message }),
    });
  }

  channel.ack(msg);
};
