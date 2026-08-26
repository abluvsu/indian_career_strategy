# Codex Integration

Codex can use the package through the shell, without a vendor-specific connector.

```powershell
npm install
npm run build
npm run dev -- run request.json
```

Follow `AGENTS.md`. Use the JSON protocol for repeatable calls and keep all personal data in ignored local files. Review every response with `requiresUserApproval` before proposing any external action.
