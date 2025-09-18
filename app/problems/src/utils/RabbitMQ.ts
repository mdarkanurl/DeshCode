import amqplib from "amqplib";
import { ProblemsTypes } from "../generated/prisma";
import dotenv from "dotenv";
dotenv.config();

let channel: amqplib.Channel;
const EXCHANGE = 'problems_exchange';
const EXCHANGE_TYPE = 'direct';

async function connect() {
  const conn = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await conn.createChannel();

  await channel.assertExchange(EXCHANGE, EXCHANGE_TYPE, { durable: false });
}

async function sendData(problemsType: ProblemsTypes, data: any) {
  if (!channel) throw new Error("Channel is not initialized. Call connect() first.");

  const queueName = problemsType;
  const routingKey = problemsType;

  await channel.assertQueue(queueName, { durable: false });
  await channel.bindQueue(queueName, EXCHANGE, routingKey);

  channel.publish(
    EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );

  console.log(`✅ Sent submission ${data.submissionId} to queue "${queueName}"`);
}

// This is for testing
connect();

export {
  connect,
  sendData
};