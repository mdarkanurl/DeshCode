import amqplib from 'amqplib';
import dotenv from 'dotenv';
dotenv.config({
  path: './.env',
});

let send_verification_code_queue_channel: amqplib.Channel;
const queue = 'send_verification_code_queue';
let conn: amqplib.ChannelModel;

async function connectWithRabbitMQ() {
  conn = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  send_verification_code_queue_channel = await conn.createChannel();

  await send_verification_code_queue_channel.assertQueue(queue);
}

async function sendVerificationCodeQueue(email: string, code: string) {
  const channel = await conn.createChannel();
  channel.sendToQueue(queue, Buffer.from(JSON.stringify({ email, code })));
}

export {
  connectWithRabbitMQ,
  sendVerificationCodeQueue
};