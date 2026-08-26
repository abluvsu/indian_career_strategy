export type WorkMode = "remote" | "hybrid" | "onsite" | "unknown";

export interface CandidateProfile {
  targetRoles: string[];
  locations: string[];
  workModes: WorkMode[];
  skills: string[];
  experienceYears: number;
  minimumSalaryInr?: number;
  excludedCompanies?: string[];
}

export interface JobOpportunity {
  id: string;
  stableExternalId?: string;
  canonicalUrl?: string;
  title: string;
  company: string;
  location: string;
  workMode: WorkMode;
  description: string;
  skills: string[];
  experienceMinYears?: number;
  salaryMinInr?: number;
  salaryMaxInr?: number;
  source: string;
  applyUrl?: string;
  postedAt?: string;
  rawText?: string;
  rawSnapshotHash?: string;
}

export interface FitAssessment {
  jobId: string;
  score: number;
  decision: "shortlist" | "review" | "skip";
  confidence: number;
  hardFilters: Array<{ name: string; passed: boolean; reason: string }>;
  reasons: string[];
}

export type ApplicationStatus =
  | "discovered"
  | "shortlisted"
  | "preparing"
  | "ready_for_review"
  | "applied"
  | "screening"
  | "interviewing"
  | "offer"
  | "rejected"
  | "archived";

export interface Application {
  id: string;
  jobId: string;
  company: string;
  title: string;
  status: ApplicationStatus;
  appliedAt?: string;
  recruiterEmails?: string[];
  notes?: string;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  receivedAt: string;
}

export type EmailEventType =
  | "recruiter_reply"
  | "screening_request"
  | "assessment_request"
  | "interview_scheduled"
  | "offer"
  | "rejection"
  | "unknown";

export interface EmailEvent {
  messageId: string;
  threadId: string;
  type: EmailEventType;
  confidence: number;
  matchedApplicationId?: string;
  needsReview: boolean;
  suggestedAction: string;
}
