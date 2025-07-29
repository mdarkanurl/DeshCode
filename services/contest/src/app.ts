import app from "./index";
import dotenv from "dotenv";
dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 4004;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});