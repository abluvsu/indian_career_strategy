# How to Prepare Your Inputs

The tool can only evaluate the information you provide. Complete, honest input produces the most useful result.

## Candidate profile

Start with `examples/profile.example.json`.

| Field | What to enter | Example |
| --- | --- | --- |
| `targetRoles` | Job titles you genuinely want | `Product Analyst` |
| `locations` | Cities or regions you can work in | `Mumbai`, `Remote` |
| `workModes` | `remote`, `hybrid`, or `onsite` | `hybrid` |
| `skills` | Skills you can demonstrate | `SQL`, `experimentation` |
| `experienceYears` | Total relevant years | `3` |
| `minimumSalaryInr` | Minimum annual salary in rupees | `1200000` |
| `excludedCompanies` | Companies you do not want scored | `Example Company` |

Use specific skill names. Write `SQL`, `Power BI`, or `stakeholder management` instead of broad labels such as `technology` or `business`.

## Job record

Include the complete description whenever possible. At minimum, provide:

- Job title
- Company
- Location
- Work mode, when known
- Full responsibilities and requirements
- Required skills
- Minimum experience
- Published salary range, when available
- Source and application URL

Do not improve or rewrite the job description before scoring it. The original wording provides useful evidence.

## Email record

Use `examples/sample-email.json` as the structure. Include only the message needed for classification:

- Message ID and thread ID
- Sender address
- Subject
- Relevant message body
- Received date

Remove signatures, quoted history, tracking links, and unrelated personal information when they are not needed.

## Applications list

The matcher works best when every application has:

- A stable application ID
- Job ID
- Exact company name
- Exact job title
- Current status
- Known recruiter addresses, when available

## Reading the result

- `hardFilters` explain non-negotiable checks.
- `score` summarizes title, skill, and work-mode alignment.
- `confidence` describes the quality of the available evidence.
- `warnings` identify results that need human review.
- `requiresUserApproval` means the agent must pause before continuing.

Never treat the score as a hiring prediction. Use it to prioritize research and applications.
