# Claude Integration

Use this repository as a local career-strategy tool.

1. Read `AGENTS.md` and `integrations/UNIVERSAL_WORKFLOW.md`.
2. Run `npm run check` and `npm run demo` for a new checkout.
3. Run `npm run protocol:describe` before using a new task.
4. Create a temporary JSON request using the v1 protocol.
5. Run `npm run dev -- run <request.json>`.
6. Preserve the response confidence, warnings, and approval flag when explaining the result.

Claude may explain results and draft user-facing text. It must not claim that an email was sent or an application was submitted. See `docs/PLATFORM_GUIDES.md` for a prompt users can paste directly.
