import amqplib from "amqplib";
import { ProblemTypes } from "../../generated/prisma"; // Assuming this is an enum
import { languageExecutors } from "../language/languageExecutors";
import { SubmitRepo } from "../../repo/index";

const submitRepo = new SubmitRepo();

const EXCHANGE = "contests_exchange";
const EXCHANGE_TYPE = "direct";

export async function consume(problemType: ProblemTypes) {
  const conn = await amqplib.connect("amqp://localhost");
  const channel = await conn.createChannel();

  const queueName = problemType;
  const routingKey = problemType;

  await channel.assertExchange(EXCHANGE, EXCHANGE_TYPE, { durable: false });
  await channel.assertQueue(queueName, { durable: false });
  await channel.bindQueue(queueName, EXCHANGE, routingKey);
  await channel.prefetch(1);

  console.log(`🟢 [${problemType}] Waiting for submissions...`);

  channel.consume(
    queueName,
    async (msg) => {
      if (!msg) return;

      let data: any;
      try {
        data = JSON.parse(msg.content.toString());
      } catch (e) {
        console.error("❌ Invalid JSON format:", e);
        channel.ack(msg);
        return;
      }

      const executor = languageExecutors[data.language?.toLowerCase()];
      if (!executor) {
        await submitRepo.update(data.submissionId, {
          status: "LANGUAGE_NOT_SUPPORTED",
          output: JSON.stringify({ error: "Unsupported language" }),
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
          ProblemTypes: problemType,
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