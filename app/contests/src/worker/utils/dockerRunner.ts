import { spawnSync } from "child_process";

export function runDocker({
  image,
  command,
  mountDir,
  timeout = 10000,
}: {
  image: string;
  command: string[];
  mountDir: string;
  timeout?: number;
}) {
  return spawnSync(
    "docker",
    [
      "run", "--rm",
      "-v", `${mountDir}:/app`,
      "--memory", "100m",
      "--cpus", "0.5",
      image,
      ...command,
    ],
    {
      cwd: mountDir,
      timeout,
      encoding: "utf-8",
    }
  );
}
