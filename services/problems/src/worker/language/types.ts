import amqplib from "amqplib";
import { ProblemTypes } from "../../generated/prisma";

export interface LanguageExecutor {
  (
    channel: amqplib.Channel,
    msg: amqplib.ConsumeMessage,
    data: {
      submissionId: number;
      functionName: string;
      testCases: any[];
      code: string;
      ProblemType: ProblemTypes;
    }
  ): Promise<void>;
}