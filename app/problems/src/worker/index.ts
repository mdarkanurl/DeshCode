import { consume } from "./queue/consume";
import { ProblemsTypes } from "@prisma/client";
import { config } from "dotenv";
config();

let ProblemsType: ProblemsTypes;

(async () => {
  for (ProblemsType in ProblemsTypes) {
    await consume(ProblemsType);
  }
})();