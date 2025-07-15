import amqplib from "amqplib";

export interface LanguageExecutor {
  (
    channel: amqplib.Channel,
    msg: amqplib.ConsumeMessage,
    data: {
      submissionId: number;
      functionName: string;
      testCases: any[];
      code: string;
    }
  ): Promise<void>;
}
