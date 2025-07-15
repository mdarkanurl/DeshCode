import amqplib from "amqplib";

let channel: any;
const queue = 'problems';

async function connect() {
  const conn = await amqplib.connect('amqp://localhost');

  channel = await conn.createChannel();
  await channel.assertQueue(queue, { durable: false });
}

async function sendData(data: any) {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
}

export {
    connect,
    sendData
}