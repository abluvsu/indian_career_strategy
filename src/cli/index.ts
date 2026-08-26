import { readFile } from "node:fs/promises";
import { normalizeJob } from "../core/normalize-job.js";
import { scoreJob } from "../core/score-job.js";
import { matchEmail } from "../core/match-email.js";

async function json<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

const [command, first, second] = process.argv.slice(2);

if (command === "score-job" && first && second) {
  const job = normalizeJob(await json(first));
  console.log(JSON.stringify(scoreJob(job, await json(second)), null, 2));
} else if (command === "match-email" && first && second) {
  console.log(JSON.stringify(matchEmail(await json(first), await json(second)), null, 2));
} else {
  console.log("Usage:");
  console.log("  career-strategy score-job <job.json> <profile.json>");
  console.log("  career-strategy match-email <email.json> <applications.json>");
}
