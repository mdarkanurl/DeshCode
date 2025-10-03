import app from "./index";
import dotenv from "dotenv";
import { connect } from "./utils/RabbitMQ";
import { worker } from "./worker";
dotenv.config();

const PORT = process.env.PROBLEMS_PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  await connect();
  worker();
  console.log('RabbitMQ connected');
});