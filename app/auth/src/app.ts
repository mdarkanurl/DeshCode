import app from "./index";
import dotenv from "dotenv";
import { connectWithRabbitMQ } from "./RabbitMQ";
dotenv.config();

const PORT = process.env.PORT || 3004;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  await connectWithRabbitMQ();
  console.log('✅ Connected to RabbitMQ');
});