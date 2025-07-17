import amqplib from "amqplib";
import { ProblemTypes } from "../../generated/prisma";
import { executors } from "../language/languageExecutors";
import { SubmitRepo } from "../../repo/index";

const submitRepo = new SubmitRepo();

const EXCHANGE = "problems_exchange";
const EXCHANGE_TYPE = "direct";

export async function consume(problemType: ProblemTypes) {
  const conn = await amqplib.connect("amqp://localhost");
  const channel = await conn.createChannel();

  const queueName = problemType;
  const routingKey = problemType;

  await channel.assertExchange(EXCHANGE, EXCHANGE_TYPE, { durable: true });
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, EXCHANGE, routingKey);
  await channel.prefetch(1); // Prevent overload, one message at a time

  console.log(`🟢 [${problemType}] Waiting for submissions...`);

  channel.consume(
    queueName,
    async (msg) => {
      if (!msg) return;

      let data;
      try {
        data = JSON.parse(msg.content.toString());
      } catch (e) {
        console.error("❌ Invalid JSON format:", e);
        channel.ack(msg); // Acknowledge to avoid message lock
        return;
      }

      const language = data.language?.toLowerCase();
      const problemType = data.problemType;
      const languageExecutors = executors[language];
      const executor = languageExecutors && languageExecutors[problemType];
      if (!executor) {
        await submitRepo.update(data.submissionId, {
          status: !languageExecutors ? "LANGUAGE_NOT_SUPPORTED" : "PROBLEM_TYPE_NOT_SUPPORTED",
          output: JSON.stringify({ error: !languageExecutors ? "Unsupported language" : "Unsupported problem type" }),
        });
        channel.ack(msg);
        return;
      }

      try {
        await executor(channel, msg, {
          submissionId: data.submissionId,
          functionName: data.functionName,
          testCases: data.testCases,
          code: data.code,
        });
      } catch (e: any) {
        console.error(`❌ Executor failed (ID: ${data.submissionId}):`, e);
        await submitRepo.update(parseInt(data.submissionId), {
          status: "INTERNAL_ERROR",
          output: JSON.stringify({ error: e.message }),
        });
        channel.ack(msg);
      }
    },
    {
      noAck: false,
    }
  );
}