import express from "express";
import { consume } from "./queue/consume";
import { ProblemsTypes } from "../generated/prisma";
const app = express();
let ProblemType: ProblemsTypes;

app.listen(3010, async () => {
  console.log(`🚀 Server running on port ${3010}`);
  for (ProblemType in ProblemsTypes) {
    await consume(ProblemType);
  }
});