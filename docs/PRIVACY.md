# Privacy

This project processes sensitive career and email data. Treat the local data directory, profile files, OAuth tokens, generated documents and logs as private.

- Never commit a real profile, resume, proof bank, email export, database or credential.
- Use fictional examples for tests and documentation.
- Request the minimum connector permissions required.
- Keep email synchronization read-only until the user explicitly approves a draft.
- Redact message bodies, addresses and tokens from logs.
- Provide export and deletion before adding hosted multi-user support.
- Do not add telemetry without clear opt-in and documentation.
