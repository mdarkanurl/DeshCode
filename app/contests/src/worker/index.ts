import { consume } from "./queue/consume";
import { ProblemsTypes } from "../generated/prisma";
let ProblemType: ProblemsTypes;

const worker = async () => {
  try {
    console.log(`🚀 Server running on port ${3010}`);
    for (ProblemType in ProblemsTypes) {
      await consume(ProblemType);
    }
  } catch (error) {
    console.log("Error from worker", error);
  }
}

// Call the function
worker();

export {
  worker
};