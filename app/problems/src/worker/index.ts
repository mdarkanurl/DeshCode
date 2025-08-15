import express from "express";
import { consume } from "./queue/consume";
import { ProblemTypes } from "../generated/prisma";
const app = express();
let ProblemType: ProblemTypes;

app.listen(3001, async () => {
  console.log(`🚀 Server running on port ${3001}`);
  for (ProblemType in ProblemTypes) {
    await consume(ProblemType);
  }
});