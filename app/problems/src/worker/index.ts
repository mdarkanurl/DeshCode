import { consume } from "./queue/consume";
import { ProblemsTypes } from "../generated/prisma";
let ProblemType: ProblemsTypes;
import { config } from "dotenv";
config();

const worker = async () => {
  try {
    for (ProblemType in ProblemsTypes) {
      await consume(ProblemType);
    }
  } catch (error) {
    console.log("Error from worker", error);
  }
};

// Call the function
worker();

export {
  worker
};