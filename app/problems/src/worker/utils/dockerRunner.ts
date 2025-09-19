import { spawn } from "child_process";
import { randomUUID } from "crypto";

export function runDockerAsync({
  image,
  command,
  mountDir,
  timeout = 10000,
}: {
  image: string;
  command: string[];
  mountDir: string;
  timeout?: number;
}): Promise<{ stdout: string; stderr: string; code: number | null }> {
  return new Promise((resolve, reject) => {
    const containerName = `sandbox-${randomUUID()}`;

    const docker = spawn(
      "docker",
      [
        "run", "--rm",
        "--name", containerName,
        "-v", `${mountDir}:/app`,
        "--memory", "100m",
        "--cpus", "0.5",
        image,
        ...command,
      ],
      { cwd: mountDir }
    );

    let stdout = "";
    let stderr = "";

    docker.stdout.on("data", (data) => (stdout += data.toString()));
    docker.stderr.on("data", (data) => (stderr += data.toString()));

    // Hard timeout
    const timer = setTimeout(() => {
      // Force remove container
      spawn("docker", ["rm", "-f", containerName]);
      docker.kill("SIGKILL"); // Kill docker CLI process
      reject(new Error(`Container ${containerName} timed out after ${timeout}ms`));
    }, timeout);

    docker.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, code });
    });

    docker.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}
