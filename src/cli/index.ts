import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { normalizeJob } from "../core/normalize-job.js";
import { scoreJob } from "../core/score-job.js";
import { matchEmail } from "../core/match-email.js";
import { executeRequest, protocolManifest } from "../platform/index.js";

async function json<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

const [command, first, second] = process.argv.slice(2);

if (command === "describe") {
  console.log(JSON.stringify(protocolManifest, null, 2));
} else if (command === "run" && first) {
  try {
    const request = first === "--stdin"
      ? JSON.parse(readFileSync(0, "utf8"))
      : await json(first);
    const response = executeRequest(request);
    console.log(JSON.stringify(response, null, 2));
    if (!response.ok) process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unable to execute request.");
    process.exitCode = 1;
  }
} else if (command === "score-job" && first && second) {
  const job = normalizeJob(await json(first));
  console.log(JSON.stringify(scoreJob(job, await json(second)), null, 2));
} else if (command === "match-email" && first && second) {
  console.log(JSON.stringify(matchEmail(await json(first), await json(second)), null, 2));
} else {
  console.log("Usage:");
  console.log("  career-strategy describe");
  console.log("  career-strategy run <request.json>");
  console.log("  career-strategy run --stdin");
  console.log("  career-strategy score-job <job.json> <profile.json>");
  console.log("  career-strategy match-email <email.json> <applications.json>");
}
