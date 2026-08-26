import { createHash } from "node:crypto";
import type { JobOpportunity, WorkMode } from "../domain/models.js";

export interface RawJob {
  stableExternalId?: string;
  title: string;
  company: string;
  location?: string;
  workMode?: string;
  description?: string;
  skills?: string[];
  experienceMinYears?: number;
  salaryMinInr?: number;
  salaryMaxInr?: number;
  source?: string;
  applyUrl?: string;
  canonicalUrl?: string;
  postedAt?: string;
}

function clean(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function workMode(value: string | undefined, text: string): WorkMode {
  const normalized = `${value ?? ""} ${text}`.toLowerCase();
  if (normalized.includes("remote") || normalized.includes("work from home")) return "remote";
  if (normalized.includes("hybrid")) return "hybrid";
  if (normalized.includes("onsite") || normalized.includes("on-site") || normalized.includes("office")) return "onsite";
  return "unknown";
}

export function normalizeJob(raw: RawJob): JobOpportunity {
  const title = clean(raw.title);
  const company = clean(raw.company);
  const location = clean(raw.location) || "Unspecified";
  const description = clean(raw.description);
  const canonicalUrl = clean(raw.canonicalUrl ?? raw.applyUrl) || undefined;
  const identity = raw.stableExternalId
    ? `${clean(raw.source) || "manual"}|${raw.stableExternalId}`
    : [title.toLowerCase(), company.toLowerCase(), location.toLowerCase(), canonicalUrl ?? ""].join("|");
  const id = createHash("sha256").update(identity).digest("hex").slice(0, 16);

  return {
    id,
    stableExternalId: clean(raw.stableExternalId) || undefined,
    canonicalUrl,
    title,
    company,
    location,
    workMode: workMode(raw.workMode, `${location} ${description}`),
    description,
    skills: [...new Set((raw.skills ?? []).map(clean).filter(Boolean))],
    experienceMinYears: raw.experienceMinYears,
    salaryMinInr: raw.salaryMinInr,
    salaryMaxInr: raw.salaryMaxInr,
    source: clean(raw.source) || "manual",
    applyUrl: clean(raw.applyUrl) || canonicalUrl,
    postedAt: raw.postedAt,
    rawText: description,
    rawSnapshotHash: createHash("sha256").update(description).digest("hex"),
  };
}
