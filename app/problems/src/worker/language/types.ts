import amqplib from "amqplib";
import { ProblemsTypes } from "../../generated/prisma";

export interface LanguageExecutor {
  (
    channel: amqplib.Channel,
    msg: amqplib.ConsumeMessage,
    data: {
      submissionId: number;
      functionName: string;
      testCases: any[];
      code: string;
      ProblemsTypes: ProblemsTypes;
    }
  ): Promise<void>;
}