import type { Application, EmailEvent, EmailEventType, EmailMessage } from "../domain/models.js";

function classify(subject: string, body: string): { type: EmailEventType; confidence: number; action: string } {
  const text = `${subject} ${body}`.toLowerCase();
  if (/offer|compensation|congratulations.*selected/.test(text)) return { type: "offer", confidence: 0.98, action: "Review the offer and prepare negotiation questions." };
  if (/rejected|regret to inform|not moving forward|unsuccessful/.test(text)) return { type: "rejection", confidence: 0.97, action: "Record the outcome and decide whether to request feedback." };
  if (/interview|calendar invite|schedule.*call|meeting.*invite/.test(text)) return { type: "interview_scheduled", confidence: 0.93, action: "Confirm the interview and prepare for the role." };
  if (/assessment|take-home|coding test|case study|assignment/.test(text)) return { type: "assessment_request", confidence: 0.91, action: "Check the deadline and add the assessment to the action queue." };
  if (/screening|phone screen|initial call|availability/.test(text)) return { type: "screening_request", confidence: 0.88, action: "Reply with availability and prepare a concise role fit summary." };
  if (/application|recruit|hiring|talent|resume|cv/.test(text)) return { type: "recruiter_reply", confidence: 0.72, action: "Review the message and draft a response." };
  return { type: "unknown", confidence: 0.35, action: "Review this message manually." };
}

function compact(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function senderDomain(address: string): string {
  return address.toLowerCase().split("@")[1]?.split(">")[0] ?? "";
}

function matchApplication(message: EmailMessage, applications: Application[]): { application?: Application; confidence: number } {
  const text = `${message.from} ${message.subject} ${message.body}`.toLowerCase();
  const domain = compact(senderDomain(message.from).split(".")[0] ?? "");
  const ranked = applications.map((application) => {
    const company = application.company.toLowerCase();
    const title = application.title.toLowerCase();
    const companyMatch = text.includes(company) || (domain.length > 3 && domain.includes(compact(company))) ? 0.65 : 0;
    const titleMatch = text.includes(title) ? 0.25 : 0;
    const recruiterMatch = application.recruiterEmails?.some((email) => message.from.toLowerCase().includes(email.toLowerCase())) ? 0.3 : 0;
    return { application, confidence: Math.min(1, companyMatch + titleMatch + recruiterMatch) };
  }).sort((a, b) => b.confidence - a.confidence);
  return ranked[0] && ranked[0].confidence >= 0.65 ? ranked[0] : { confidence: 0 };
}

export function matchEmail(message: EmailMessage, applications: Application[]): EmailEvent {
  const classification = classify(message.subject, message.body);
  const match = matchApplication(message, applications);
  return {
    messageId: message.id,
    threadId: message.threadId,
    type: classification.type,
    confidence: Math.round(classification.confidence * (match.application ? 1 : 0.8) * 100) / 100,
    matchedApplicationId: match.application?.id,
    needsReview: classification.confidence < 0.8 || !match.application,
    suggestedAction: match.application ? classification.action : `${classification.action} Match this thread to an application before changing status.`,
  };
}
