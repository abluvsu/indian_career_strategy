# Career Strategy Agent Contract

This repository is platform-neutral. Antigravity, Codex, Claude, and other agent hosts use the same local command and JSON protocol.

## Invocation

Run these commands before handling user data:

```bash
npm run build
npm run protocol:describe
npm run dev -- run request.json
```

Streaming hosts can pipe one complete JSON request to `node dist/cli/index.js run --stdin` after the build.

The request must use `schemaVersion: "career-strategy.agent.v1"`. Store personal profiles, applications, messages, tokens and generated artifacts outside Git or in ignored local files.

## Agent rules

- Use `score_job` for job fit and `match_email` for recruiter email intelligence.
- Preserve the response envelope and request ID.
- Treat `requiresUserApproval: true` as a hard stop.
- Never send email, submit an application or change external state from these tools.
- Do not invent candidate evidence or silently fill missing profile data.
- Surface warnings and low-confidence results to the user.

The host agent may add presentation, memory, or scheduling around this contract. It must not rewrite domain results or hide failures. User-facing setup and examples are in `README.md` and `docs/PLATFORM_GUIDES.md`.
