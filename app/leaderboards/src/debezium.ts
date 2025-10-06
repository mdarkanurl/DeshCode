import { Kafka } from 'kafkajs'; // From GitHub
import axios from 'axios';
import dotenv from "dotenv";
import { redis } from './redis';

dotenv.config();

(async () => {
  try {
    // Fetch existing connectors
    const { data } = await axios.get(`${process.env.DEBEZIUM_CONNECTOR_URL}/connectors`);
    console.log("Existing connectors:", data);

    // Register Connector if none exists
    if (data.length === 0) {
      console.log("Registering new Debezium connector...");
      await axios.post(`${process.env.DEBEZIUM_CONNECTOR_URL}/connectors`, {
        "name": "submissions-debezium-connector",
        "config": {
          "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
          "database.hostname": "postgres",
          "database.port": "5432",
          "database.user": "postgres",
          "database.password": "postgres",
          "database.dbname": "contests_db",
          "max.batch.size": 2048,
          "max.queue.size": 8192,
          "database.server.name": "contests",
          "plugin.name": "pgoutput",
          "slot.name": "debezium_slot",
          "publication.name": "submissions_pub",
          "topic.prefix": "contests",
          "table.include.list": "public.submissions",
          "snapshot.mode": "never",
          "transforms": "unwrap",
          "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
          "transforms.unwrap.add.headers": "op",
          "column.include.list": "public.submissions.userId,public.submissions.contestsId,public.submissions.status,public.submissions.score"
        }
      });
    } else {
      console.log("Debezium connector already exists.");
    }
  } catch (err) {
    console.error("Error fetching or registering connectors:", err);
  }
})();

const kafka = new Kafka({
  clientId: 'leaderboard-service',
  brokers: [process.env.KAFKA_BROKER_URL || 'kafka:9092'],
});

const consumer = kafka.consumer({
  groupId: 'leaderboard-group',
});

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'contests.public.submissions', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;

      // Parse the message
      const event = JSON.parse(message.value.toString());

      // Pretty-print the payload
      const payload = event.payload.after || event.payload;

      // Skip processing if status is PENDING
      if(event.payload.status === "PENDING") return;

      const { contestsId, userId, score } = payload;
      const leaderboardKey = `leaderboard:${contestsId}`;

      // Use ZINCRBY to update Redis
      const result = await redis.zincrby(leaderboardKey, Number(score), userId);
      console.log("Redis ZINCRBY result:", result);

      console.log("\n================= Debezium Event =================");
      console.log("Payload:");
      console.log(JSON.stringify(payload, null, 2));
      console.log("==================================================\n");
    },
  });
};

run().catch(err => {
  console.error('Kafka consumer error:', err);
});