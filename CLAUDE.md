# Claude Integration

Use this repository as a local career-strategy tool provider.

1. Read `AGENTS.md` and `integrations/UNIVERSAL_WORKFLOW.md`.
2. Run `npm run protocol:describe` before using a new task.
3. Create a temporary JSON request using the v1 protocol.
4. Run `npm run dev -- run <request.json>`.
5. Parse the JSON response and preserve its confidence, warnings and approval flags.

Claude may explain results and draft user-facing text, but it must not claim that an email was sent or an application was submitted.
