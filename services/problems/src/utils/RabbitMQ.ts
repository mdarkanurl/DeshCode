import amqplib from "amqplib";
import { ProblemTypes } from "../generated/prisma";

let channel: amqplib.Channel;
const EXCHANGE = 'problems_exchange';
const EXCHANGE_TYPE = 'direct';

async function connect() {
  const conn = await amqplib.connect('amqp://localhost');
  channel = await conn.createChannel();

  await channel.assertExchange(EXCHANGE, EXCHANGE_TYPE, { durable: true });
}

async function sendData(problemType: ProblemTypes, data: any) {
  if (!channel) throw new Error("Channel is not initialized. Call connect() first.");

  const queueName = problemType;
  const routingKey = problemType;

  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, EXCHANGE, routingKey);

  channel.publish(
    EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );

  console.log(`✅ Sent submission ${data.submitId} to queue "${queueName}"`);
}

export {
  connect,
  sendData
};