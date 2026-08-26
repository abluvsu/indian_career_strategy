# Troubleshooting

## `node` or `npm` is not recognized

Install Node.js 22 or newer from [nodejs.org](https://nodejs.org/), close your terminal, open it again, and run:

```bash
node --version
npm --version
```

## `Cannot find module`

Install dependencies and build again:

```bash
npm install
npm run build
```

## A protocol request returns `INVALID_REQUEST`

Check these items:

- `schemaVersion` is exactly `career-strategy.agent.v1`.
- `requestId`, `task`, and `input` are present.
- `score_job` includes both `job` and `profile`.
- The profile contains all required arrays and `experienceYears`.
- `match_email` includes both `message` and `applications`.

Compare your file with `examples/score-request.example.json` or `examples/email-request.example.json`.

## The score seems too high or too low

Review the complete response. Hard filters, confidence, and reasons matter more than the number alone. Confirm that the job description is complete and the profile uses specific, honest skills.

## An email was not matched

Check that the application uses the exact company and role names. Add a known recruiter address when available. An uncertain match intentionally requires manual review.

## The agent claims it sent an email

The current package cannot send email. Treat that statement as incorrect. Ask the agent to show the command output and follow `AGENTS.md`.

## Tests fail

Run:

```bash
npm install
npm run check
```

If the failure continues, open a GitHub issue with the Node version, operating system, command, and error text. Remove personal data and credentials first.
