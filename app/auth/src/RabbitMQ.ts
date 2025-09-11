import amqplib from 'amqplib';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config({ path: '../.env' });

let send_verification_code_queue_channel: amqplib.Channel;
const queue = 'send_verification_code_queue';
let conn: amqplib.ChannelModel;

async function connectWithRabbitMQ() {
  conn = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  send_verification_code_queue_channel = await conn.createChannel();

  await send_verification_code_queue_channel.assertQueue(queue);

  // Start consuming after channel is ready
  send_verification_code_queue_channel.consume(
    queue,
    (msg: amqplib.ConsumeMessage | null) => {
      if (msg) {
        const { email, code } = JSON.parse(msg.content.toString());
        console.log(`Received message from ${queue}:`, email, code);

        const resend = new Resend(process.env.RESEND_API_KEY || 're_xxxxxxxxx');

        (async function () {
          const { data, error } = await resend.emails.send({
            from: 'DeshCode <onboarding@resend.dev>',
            to: [email],
            subject: 'Your Verification Code',
            html: `<strong>Your verification code is: ${code}</strong>`,
          });

          if (error) {
            return console.error({ error });
          }

          console.log({ data });
        })();

        send_verification_code_queue_channel.ack(msg);
      }
    }
  );
}

async function sendVerificationCodeQueue(email: string, code: string) {
  if (!conn) throw new Error("RabbitMQ connection not initialized.");
  const channel = await conn.createChannel();
  channel.sendToQueue(queue, Buffer.from(JSON.stringify({ email, code })));
}

export {
  connectWithRabbitMQ,
  sendVerificationCodeQueue
};
