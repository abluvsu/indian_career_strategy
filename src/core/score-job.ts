import type { CandidateProfile, FitAssessment, JobOpportunity } from "../domain/models.js";

const STOP_WORDS = new Set(["and", "the", "for", "with", "from", "lead", "senior", "junior", "manager"]);

function terms(value: string): Set<string> {
  return new Set(value.toLowerCase().split(/[^a-z0-9+#]+/).filter((term) => term.length > 2 && !STOP_WORDS.has(term)));
}

function overlap(left: Set<string>, right: Set<string>): number {
  if (right.size === 0) return 0;
  let matches = 0;
  for (const value of right) if (left.has(value)) matches += 1;
  return matches / right.size;
}

export function scoreJob(job: JobOpportunity, profile: CandidateProfile): FitAssessment {
  const hardFilters: FitAssessment["hardFilters"] = [];
  const locationText = job.location.toLowerCase();
  const locationPassed = profile.locations.length === 0 || profile.locations.some((value) => locationText.includes(value.toLowerCase())) || job.workMode === "remote";
  hardFilters.push({ name: "location", passed: locationPassed, reason: locationPassed ? "Location or remote preference matches." : "No configured location or remote match." });

  const experiencePassed = job.experienceMinYears === undefined || profile.experienceYears >= job.experienceMinYears;
  hardFilters.push({ name: "experience", passed: experiencePassed, reason: experiencePassed ? "Experience requirement is compatible." : "Job asks for more experience than configured." });

  const salaryPassed = profile.minimumSalaryInr === undefined || job.salaryMaxInr === undefined || job.salaryMaxInr >= profile.minimumSalaryInr;
  hardFilters.push({ name: "salary", passed: salaryPassed, reason: salaryPassed ? "Salary is compatible or undisclosed." : "Published salary is below the configured minimum." });

  const excluded = profile.excludedCompanies?.some((value) => job.company.toLowerCase() === value.toLowerCase()) ?? false;
  hardFilters.push({ name: "company", passed: !excluded, reason: excluded ? "Company is explicitly excluded." : "Company is not excluded." });

  const hardPassed = hardFilters.every((filter) => filter.passed);
  const titleFit = overlap(terms(job.title), new Set(profile.targetRoles.flatMap((role) => [...terms(role)])));
  const skillFit = overlap(terms(`${job.description} ${job.skills.join(" ")}`), new Set(profile.skills.flatMap((skill) => [...terms(skill)])));
  const modeFit = profile.workModes.length === 0 || job.workMode === "unknown" || profile.workModes.includes(job.workMode) ? 1 : 0;
  const score = Math.round((titleFit * 0.4 + skillFit * 0.45 + modeFit * 0.15) * 100);
  const confidence = Math.round(Math.min(1, 0.45 + (job.description.length > 120 ? 0.25 : 0) + (job.skills.length > 0 ? 0.2 : 0) + (job.location !== "Unspecified" ? 0.1 : 0)) * 100) / 100;
  const decision = !hardPassed ? "skip" : score >= 65 && confidence >= 0.7 ? "shortlist" : score >= 35 ? "review" : "skip";

  return {
    jobId: job.id,
    score: hardPassed ? score : Math.min(score, 34),
    decision,
    confidence,
    hardFilters,
    reasons: [
      `Title alignment: ${Math.round(titleFit * 100)}%.`,
      `Skill alignment: ${Math.round(skillFit * 100)}%.`,
      modeFit === 1 ? "Work mode is compatible or undisclosed." : "Work mode does not match the configured preference.",
    ],
  };
}
