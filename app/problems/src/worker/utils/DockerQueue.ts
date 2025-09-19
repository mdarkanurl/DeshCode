// dockerQueue.ts
import PQueue from "p-queue";
import { runDockerAsync } from "./dockerRunner";

export const dockerQueue = new PQueue({ concurrency: 5 }); // max 5 containers at once

export function runWithQueue(job: Parameters<typeof runDockerAsync>[0]) {
  return dockerQueue.add(() => runDockerAsync(job));
}
