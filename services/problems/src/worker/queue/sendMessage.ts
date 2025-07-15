import amqplib from "amqplib";
import { languageExecutors } from "../language/languageExecutors";
import { SubmitRepo } from '../../repo/index'

const submitRepo = new SubmitRepo();

export async function sendMessage() {
  const queue = "problems";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: false });
  channel.prefetch(1);

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
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
      });
    } catch (e: any) {
      console.log('Is it here');
      await submitRepo.update(parseInt(data.submissionId), {
        status: "INTERNAL_ERROR",
        output: JSON.stringify({ error: e.message }),
      });
      channel.ack(msg);
    }
  });
}
