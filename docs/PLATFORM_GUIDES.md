# Agent Platform Guides

Every supported platform calls the same local engine. The platform handles conversation and presentation; this repository handles scoring, classification, and safety flags.

## Antigravity

1. Open the cloned repository as your workspace.
2. Ask the agent to read `AGENTS.md`, `ANTIGRAVITY.md`, and `integrations/UNIVERSAL_WORKFLOW.md`.
3. Keep your profile in the ignored local file `profile.json`.
4. Provide a job file or recruiter email record.

Suggested prompt:

```text
Read AGENTS.md, ANTIGRAVITY.md, and integrations/UNIVERSAL_WORKFLOW.md.
Use profile.json and my job file. Run the score_job workflow.
Explain hard filters, score, confidence, and warnings in plain language.
Do not send email or submit an application.
```

## Claude

1. Open the repository in Claude Code or another Claude environment with local file and terminal access.
2. Ask Claude to read `CLAUDE.md` and `AGENTS.md`.
3. Use the same local `profile.json` and job files.

Suggested prompt:

```text
Read CLAUDE.md and AGENTS.md. Run npm run demo to verify the project.
Then evaluate my job file with profile.json using the versioned protocol.
Preserve the response confidence, warnings, and approval flag.
```

## Codex

1. Open the repository as the Codex project.
2. Codex should automatically discover `AGENTS.md`; ask it to read `CODEX.md` as well.
3. Provide the local profile and target job path.

Suggested prompt:

```text
Read AGENTS.md and CODEX.md. Verify the repository with npm run check.
Use profile.json and my job file to run score_job.
Show the important result fields without changing the underlying output.
```

## Other agents and automation tools

Any host that can run a command can use the package:

```bash
npm run build
node dist/cli/index.js run request.json
```

For streamed JSON:

```bash
cat request.json | node dist/cli/index.js run --stdin
```

Use `schemas/agent-request.schema.json` and `schemas/agent-response.schema.json` to validate messages.

## Important boundary

Do not let a host agent silently replace, smooth, or reinterpret failed results. Preserve `ok`, `errors`, `warnings`, `confidence`, and `requiresUserApproval` when presenting the result.
