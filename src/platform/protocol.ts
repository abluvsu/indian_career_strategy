import type { CandidateProfile, EmailMessage, Application, FitAssessment, JobOpportunity } from "../domain/models.js";
import type { RawJob } from "../core/normalize-job.js";

export const PROTOCOL_VERSION = "career-strategy.agent.v1";

export type AgentTask = "score_job" | "match_email";

export interface ScoreJobInput {
  job: RawJob | JobOpportunity;
  profile: CandidateProfile;
}

export interface MatchEmailInput {
  message: EmailMessage;
  applications: Application[];
}

export interface AgentRequest {
  schemaVersion: typeof PROTOCOL_VERSION;
  requestId: string;
  task: AgentTask;
  input: ScoreJobInput | MatchEmailInput;
  actor?: "user" | "agent" | "system";
  createdAt?: string;
}

export interface AgentError {
  code: "INVALID_REQUEST" | "UNSUPPORTED_TASK" | "EXECUTION_FAILED";
  message: string;
  field?: string;
}

export interface AgentResponse<T = unknown> {
  schemaVersion: typeof PROTOCOL_VERSION;
  requestId: string;
  ok: boolean;
  task?: AgentTask;
  result?: T;
  confidence?: number;
  requiresUserApproval: boolean;
  warnings: string[];
  errors: AgentError[];
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function success<T>(request: AgentRequest, result: T, confidence?: number, warnings: string[] = []): AgentResponse<T> {
  return {
    schemaVersion: PROTOCOL_VERSION,
    requestId: request.requestId,
    ok: true,
    task: request.task,
    result,
    confidence,
    requiresUserApproval: false,
    warnings,
    errors: [],
  };
}

export function failure(requestId: string, errors: AgentError[], task?: AgentTask): AgentResponse {
  return {
    schemaVersion: PROTOCOL_VERSION,
    requestId,
    ok: false,
    task,
    requiresUserApproval: false,
    warnings: [],
    errors,
  };
}
