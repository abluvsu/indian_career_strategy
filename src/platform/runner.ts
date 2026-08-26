import { matchEmail } from "../core/match-email.js";
import { normalizeJob } from "../core/normalize-job.js";
import { scoreJob } from "../core/score-job.js";
import { failure, isRecord, PROTOCOL_VERSION, success, type AgentRequest, type AgentResponse } from "./protocol.js";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function hasRequiredStringFields(value: Record<string, unknown>, fields: string[]): boolean {
  return fields.every((field) => typeof value[field] === "string" && value[field].length > 0);
}

function validRequest(value: unknown): value is AgentRequest {
  if (!isRecord(value)) return false;
  return value.schemaVersion === PROTOCOL_VERSION && typeof value.requestId === "string" && value.requestId.length > 0 && (value.task === "score_job" || value.task === "match_email") && isRecord(value.input);
}

function validScoreInput(input: Record<string, unknown>): boolean {
  if (!isRecord(input.job) || !isRecord(input.profile)) return false;
  const profile = input.profile;
  return hasRequiredStringFields(input.job, ["title", "company"]) &&
    isStringArray(profile.targetRoles) &&
    isStringArray(profile.locations) &&
    isStringArray(profile.workModes) &&
    isStringArray(profile.skills) &&
    typeof profile.experienceYears === "number" && profile.experienceYears >= 0;
}

function validEmailInput(input: Record<string, unknown>): boolean {
  if (!isRecord(input.message) || !Array.isArray(input.applications)) return false;
  return hasRequiredStringFields(input.message, ["id", "threadId", "from", "subject", "body"]) &&
    input.applications.every((application) => isRecord(application) && hasRequiredStringFields(application, ["id", "jobId", "company", "title", "status"]));
}

export function executeRequest(value: unknown): AgentResponse {
  const requestId = isRecord(value) && typeof value.requestId === "string" ? value.requestId : "unknown";
  if (!validRequest(value)) {
    return failure(requestId, [{ code: "INVALID_REQUEST", message: `Request must use schemaVersion ${PROTOCOL_VERSION} and a supported task.` }]);
  }

  const request = value;

  try {
    if (request.task === "score_job") {
      const input = request.input as { job?: unknown; profile?: unknown };
      if (!validScoreInput(input as Record<string, unknown>)) {
        return failure(request.requestId, [{ code: "INVALID_REQUEST", message: "score_job requires job title/company and a complete profile with arrays plus experienceYears.", field: "input" }], request.task);
      }
      const assessment = scoreJob(normalizeJob(input.job as never), input.profile as never);
      return success(request, assessment, assessment.confidence);
    }

    const input = request.input as { message?: unknown; applications?: unknown };
    if (!validEmailInput(input as Record<string, unknown>)) {
      return failure(request.requestId, [{ code: "INVALID_REQUEST", message: "match_email requires a complete message and application records.", field: "input" }], request.task);
    }
    const event = matchEmail(input.message as never, input.applications as never);
    return {
      ...success(request, event, event.confidence, event.needsReview ? ["Email matching is uncertain; review before changing application status."] : []),
      requiresUserApproval: event.needsReview,
    };
  } catch (error) {
    return failure(request.requestId, [{ code: "EXECUTION_FAILED", message: error instanceof Error ? error.message : "Task execution failed." }], request.task);
  }
}
