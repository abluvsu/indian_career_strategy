# Indian Career Strategy

An India-first, local-first career agent for job discovery, explainable job fit, application tracking and recruiter email intelligence.

The product loop is:

```text
Find jobs -> score fit -> prepare application -> user approves -> track email -> take the next action
```

## What works in this release

This first public release contains the provider-independent core:

- Normalizes imported job descriptions into a stable job record.
- Applies configurable location, work-mode, experience, salary and company filters.
- Produces an explainable fit score with confidence and reasons.
- Classifies recruiter messages into interview, screening, assessment, offer and rejection events.
- Matches email events to applications only when confidence is sufficient.
- Enforces a typed application state machine.
- Keeps external actions behind human approval boundaries.

The core works without an AI API key. Live job-source connectors, Gmail OAuth and generated application documents are planned adapters and are not falsely presented as complete in v0.1.

## Use it with any agent host

The package exposes a versioned JSON protocol instead of a vendor-specific prompt or memory system. This makes it usable from Antigravity, Claude, Codex, a local script or another orchestration layer.

```bash
npm run protocol:describe
npm run dev -- run request.json
# Or stream a request from another host
npm run build
cat request.json | node dist/cli/index.js run --stdin
```

The protocol supports `score_job` and `match_email`. Each response preserves the request ID, confidence, warnings and approval flag. See [AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md), [CODEX.md](CODEX.md), [schemas/agent-request.schema.json](schemas/agent-request.schema.json) and [integrations/UNIVERSAL_WORKFLOW.md](integrations/UNIVERSAL_WORKFLOW.md).

The host platform owns conversation history, credentials, scheduling, consent and presentation. This package owns deterministic career decisions and must not send email or submit applications.

## Quick start

```bash
npm install
npm run check
npm run dev -- score-job examples/sample-job.json examples/profile.example.json
npm run dev -- match-email examples/sample-email.json examples/applications.example.json
```

Use `profile.example.json` as a template. Create your own local `profile.json`; it is ignored by Git.

## Design principles

- Local-first storage for personal career data.
- Human approval before sending email, submitting an application, changing application status or publishing an artifact.
- Evidence-backed writing with no invented claims.
- Deterministic filters and state transitions around optional AI agents.
- Confidence-aware automation: uncertain decisions enter a review queue.
- Provider adapters instead of hardcoded portals or model vendors.

## Roadmap

1. Add SQLite persistence and an interactive CLI.
2. Add manual job inbox and public ATS adapters.
3. Add Gmail read-only synchronization with encrypted local tokens.
4. Add resume, outreach and interview artifact generators.
5. Add the dashboard and outcome analytics.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/PRIVACY.md](docs/PRIVACY.md) and [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md).
