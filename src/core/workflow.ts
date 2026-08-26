import type { Application, ApplicationStatus } from "../domain/models.js";

const transitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  discovered: ["shortlisted", "archived"],
  shortlisted: ["preparing", "archived"],
  preparing: ["ready_for_review", "archived"],
  ready_for_review: ["applied", "archived"],
  applied: ["screening", "interviewing", "offer", "rejected", "archived"],
  screening: ["interviewing", "offer", "rejected", "archived"],
  interviewing: ["offer", "rejected", "archived"],
  offer: ["archived"],
  rejected: ["archived"],
  archived: [],
};

export function transitionApplication(application: Application, next: ApplicationStatus): Application {
  if (!transitions[application.status].includes(next)) {
    throw new Error(`Invalid application transition: ${application.status} -> ${next}`);
  }
  return { ...application, status: next, appliedAt: next === "applied" ? application.appliedAt ?? new Date().toISOString() : application.appliedAt };
}

export function requiresHumanApproval(action: "send_email" | "submit_application" | "change_status" | "generate_artifact"): boolean {
  return action === "send_email" || action === "submit_application" || action === "change_status" || action === "generate_artifact";
}
