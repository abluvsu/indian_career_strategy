import { describe, expect, it } from "vitest";
import { normalizeJob } from "../src/core/normalize-job.js";
import { scoreJob } from "../src/core/score-job.js";
import { matchEmail } from "../src/core/match-email.js";
import { transitionApplication } from "../src/core/workflow.js";
import { executeRequest } from "../src/platform/runner.js";

const profile = {
  targetRoles: ["Product Analyst"],
  locations: ["Bengaluru"],
  workModes: ["hybrid" as const],
  skills: ["SQL", "analytics", "experimentation"],
  experienceYears: 3,
  minimumSalaryInr: 1000000,
};

describe("career strategy core", () => {
  it("normalizes a job with a stable identity", () => {
    const raw = { title: " Product Analyst ", company: "Example Co", location: "Bengaluru", description: "SQL analytics" };
    expect(normalizeJob(raw).id).toBe(normalizeJob(raw).id);
    expect(normalizeJob(raw).workMode).toBe("unknown");
  });

  it("scores a compatible job and exposes reasons", () => {
    const job = normalizeJob({ title: "Product Analyst", company: "Example Co", location: "Bengaluru", workMode: "hybrid", description: "SQL analytics experimentation", skills: ["SQL", "analytics"] });
    const assessment = scoreJob(job, profile);
    expect(assessment.decision).toBe("shortlist");
    expect(assessment.hardFilters.every((filter) => filter.passed)).toBe(true);
    expect(assessment.reasons.length).toBeGreaterThan(0);
  });

  it("does not silently match an unrelated email", () => {
    const event = matchEmail({ id: "m1", threadId: "t1", from: "unknown@example.com", to: [], subject: "Hello", body: "Just checking in", receivedAt: "2026-08-26T00:00:00Z" }, []);
    expect(event.matchedApplicationId).toBeUndefined();
    expect(event.needsReview).toBe(true);
  });

  it("matches a recruiter domain and role with high confidence", () => {
    const event = matchEmail(
      { id: "m2", threadId: "t2", from: "recruiting@exampletechnologies.com", to: [], subject: "Next steps for Product Analyst", body: "We would like to schedule an interview.", receivedAt: "2026-08-26T00:00:00Z" },
      [{ id: "a2", jobId: "j2", company: "Example Technologies", title: "Product Analyst", status: "applied", recruiterEmails: ["recruiting@exampletechnologies.com"] }],
    );
    expect(event.matchedApplicationId).toBe("a2");
    expect(event.needsReview).toBe(false);
  });

  it("enforces application state transitions", () => {
    const application = { id: "a1", jobId: "j1", company: "Example Co", title: "Product Analyst", status: "applied" as const };
    expect(transitionApplication(application, "interviewing").status).toBe("interviewing");
    expect(() => transitionApplication(application, "shortlisted")).toThrow("Invalid application transition");
  });

  it("executes the platform-neutral score request envelope", () => {
    const response = executeRequest({
      schemaVersion: "career-strategy.agent.v1",
      requestId: "request-1",
      task: "score_job",
      input: {
        job: { title: "Product Analyst", company: "Example Co", location: "Bengaluru", description: "SQL analytics", skills: ["SQL"] },
        profile,
      },
    });
    expect(response.ok).toBe(true);
    expect(response.requestId).toBe("request-1");
    expect(response.schemaVersion).toBe("career-strategy.agent.v1");
  });

  it("fails closed for an invalid platform request", () => {
    const response = executeRequest({ schemaVersion: "wrong", requestId: "request-2", task: "score_job", input: {} });
    expect(response.ok).toBe(false);
    expect(response.errors[0]?.code).toBe("INVALID_REQUEST");
  });

  it("rejects incomplete profile input instead of guessing", () => {
    const response = executeRequest({
      schemaVersion: "career-strategy.agent.v1",
      requestId: "request-3",
      task: "score_job",
      input: { job: { title: "Product Analyst", company: "Example Co" }, profile: {} },
    });
    expect(response.ok).toBe(false);
    expect(response.errors[0]?.code).toBe("INVALID_REQUEST");
  });
});
