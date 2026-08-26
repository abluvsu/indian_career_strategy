# Antigravity Integration

Use Indian Career Strategy as a local tool inside an Antigravity workspace.

## First run

```bash
npm install
npm run check
npm run demo
```

## Agent workflow

1. Read `AGENTS.md` and `integrations/UNIVERSAL_WORKFLOW.md`.
2. Ask the user for a local profile and a complete job description.
3. Create a `career-strategy.agent.v1` request.
4. Run `npm run dev -- run <request.json>`.
5. Present the score, reasons, hard filters, confidence, and warnings.
6. Stop for user approval before any external action.

Do not store personal career information in shared memory or tracked files. Do not claim an email or application was sent.
