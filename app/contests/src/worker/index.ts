import express from "express";
import { consume } from "./queue/consume";
import { ProblemTypes } from "../generated/prisma";
const app = express();
let ProblemType: ProblemTypes;

app.listen(3010, async () => {
  console.log(`🚀 Server running on port ${3010}`);
  for (ProblemType in ProblemTypes) {
    await consume(ProblemType);
  }
});