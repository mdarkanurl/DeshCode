import express from "express";
import { consume } from "./queue/consume";
import { ProblemsTypes } from "@prisma/client";
import { config } from "dotenv";
config();
const app = express();
let ProblemsType: ProblemsTypes;

app.listen(process.env.WORKER_PORT || 4000, async () => {
  console.log(`🚀 Server running on port ${process.env.WORKER_PORT || 4000}`);
  for (ProblemsType in ProblemsTypes) {
    await consume(ProblemsType);
  }
});