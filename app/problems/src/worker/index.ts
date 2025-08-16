import express from "express";
import { consume } from "./queue/consume";
import { ProblemsTypes } from "../generated/prisma";
const app = express();
let ProblemsType: ProblemsTypes;

app.listen(3001, async () => {
  console.log(`🚀 Server running on port ${3001}`);
  for (ProblemsType in ProblemsTypes) {
    await consume(ProblemsType);
  }
});