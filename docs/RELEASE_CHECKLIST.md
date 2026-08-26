# Release Checklist

Before every public release:

- Run `npm run check` from a fresh checkout.
- Confirm the repository has no personal names, addresses, phone numbers, email addresses, employer history or private URLs.
- Scan for secrets, OAuth tokens, database files, generated documents and browser profiles.
- Confirm examples are fictional and contain no real contact data.
- Confirm all external actions require explicit user approval.
- Confirm every new connector has rate limits, retries, deduplication and a clear privacy note.
- Confirm README claims match implemented functionality.
- Review the staged file list before pushing.
