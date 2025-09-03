import { Kafka } from 'kafkajs'; // From GitHub
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

(async () => {
  try {
    // Fetch existing connectors
    const response = await axios.get("http://localhost:8083/connectors");
    const connectors = response.data;

    // Register Connector if none exists
    if (connectors.length === 0) {
      console.log("No connectors found. Registering Debezium connector...");
      
      await axios.post("http://localhost:8083/connectors", {
        name: "submissions-debezium-connector",
        config: {
          "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
          "database.hostname": "postgres",
          "database.port": "5432",
          "database.user": "debezium",
          "database.password": "mdarkanurl",
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
          "column.include.list": "public.submissions.id,public.submissions.userId,public.submissions.problemsId,public.submissions.status,public.submissions.score"
        },
      });

      console.log("Connector registered successfully!");
    } else {
      console.log("Existing connectors:", connectors);
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
  maxBytesPerPartition: 50 * 1024 * 1024,
  maxBytes: 50 * 1024 * 1024,
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
      const opType = event.payload.op || 'unknown';

      console.log("\n================= Debezium Event =================");
      console.log(`Operation: ${opType}`);
      console.log("Payload:");
      console.log(JSON.stringify(payload, null, 2)); // Pretty JSON
      console.log("==================================================\n");
    },
  });
};

run().catch(err => {
  console.error('Kafka consumer error:', err);
});
