# Universal Agent Workflow

This workflow is intentionally compatible with Antigravity, Claude, Codex and other agent hosts.

## User session

1. Ask the user to create a local profile from `examples/profile.example.json`.
2. Receive or import a job description.
3. Build a `score_job` request and run the local CLI.
4. Present the score, hard-filter results, reasons and confidence.
5. Ask the user before creating application artifacts or changing a tracker state.
6. For an email export or connector result, build a `match_email` request.
7. Present the classified event and suggested action.
8. Require confirmation before any future connector performs an external action.

## Shared request example

```json
{
  "schemaVersion": "career-strategy.agent.v1",
  "requestId": "session-job-001",
  "task": "score_job",
  "actor": "agent",
  "input": {
    "job": {
      "title": "Product Analyst",
      "company": "Example Technologies",
      "location": "Bengaluru",
      "description": "Build SQL models and run product experiments.",
      "skills": ["SQL", "experimentation"]
    },
    "profile": {
      "targetRoles": ["Product Analyst"],
      "locations": ["Bengaluru", "Remote"],
      "workModes": ["hybrid", "remote"],
      "skills": ["SQL", "analytics"],
      "experienceYears": 3
    }
  }
}
```

## Host boundary

The host owns conversation history, user consent, scheduling, credentials and presentation. The package owns normalization, scoring, classification and safety flags. Never merge these responsibilities implicitly.

For a streaming host, pipe one complete JSON request to `node dist/cli/index.js run --stdin` after `npm run build`. The process writes one JSON response to stdout and keeps diagnostics out of the response envelope.
