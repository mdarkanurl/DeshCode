import express from "express";
import { sendMessage } from "./queue/sendMessage";
const app = express();

app.listen(3001, async () => {
  console.log(`🚀 Server running on port ${3001}`);
  await sendMessage();
});