import { PROTOCOL_VERSION } from "./protocol.js";

export const protocolManifest = {
  protocol: PROTOCOL_VERSION,
  name: "Indian Career Strategy",
  description: "Local-first job fit and recruiter email intelligence for any agent host.",
  transport: "json-over-cli",
  commands: ["career-strategy run <request.json>", "career-strategy run --stdin"],
  tasks: [
    {
      name: "score_job",
      description: "Normalize a job and return explainable fit scoring against a user profile.",
      input: "{ job: RawJob, profile: CandidateProfile }",
      externalSideEffects: false,
    },
    {
      name: "match_email",
      description: "Classify and match a recruiter email to known applications.",
      input: "{ message: EmailMessage, applications: Application[] }",
      externalSideEffects: false,
      reviewOnLowConfidence: true,
    },
  ],
  safety: {
    autoSendEmail: false,
    autoSubmitApplications: false,
    userApprovalRequiredForExternalActions: true,
    dataStorage: "caller-controlled",
  },
} as const;
