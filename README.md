# Indian Career Strategy

[![CI status](https://github.com/abluvsu/indian_career_strategy/actions/workflows/ci.yml/badge.svg)](https://github.com/abluvsu/indian_career_strategy/actions/workflows/ci.yml)

A free, local-first toolkit that helps you decide which jobs to pursue and understand recruiter emails. It works from Antigravity, Claude, Codex, or a regular terminal.

Your career data stays on your computer. You do not need an AI API key to use the current features.

## What you can do today

- Compare a job with your target roles, skills, location, work mode, experience, and salary preferences.
- Get a fit score with clear reasons and hard-filter results.
- Classify recruiter emails as screening, assessment, interview, offer, rejection, or general reply.
- Match an email to a known application when the evidence is strong enough.
- Use the same structured request from Antigravity, Claude, Codex, or your own script.
- Keep email sending and application submission behind human approval.

## Feature status

| Capability | Status |
| --- | --- |
| Manual job import and fit scoring | Ready |
| Recruiter email classification from JSON | Ready |
| Email-to-application matching | Ready |
| Cross-platform agent protocol | Ready |
| Application state rules | Ready |
| Live Gmail synchronization | Planned |
| SQLite application history | Planned |
| Live job-board connectors | Planned |
| Resume and outreach generation | Planned |
| Dashboard | Planned |

The project does not currently send email, submit applications, or connect directly to Gmail or job boards.

## Five-minute start

You need [Node.js 22 or newer](https://nodejs.org/) and Git.

```bash
git clone https://github.com/abluvsu/indian_career_strategy.git
cd indian_career_strategy
npm install
npm run check
npm run demo
```

The demo prints a JSON result containing:

- `score`: job-fit score from 0 to 100
- `decision`: `shortlist`, `review`, or `skip`
- `confidence`: confidence from 0 to 1
- `hardFilters`: location, experience, salary, and company checks
- `reasons`: a plain-language explanation of the score

For Windows, macOS, Linux, and first-profile instructions, read [Getting Started](docs/GETTING_STARTED.md).

## Use your own profile

1. Copy `examples/profile.example.json` to `profile.json`.
2. Replace the example values with your preferences and skills.
3. Keep `profile.json` local. Git already ignores it.
4. Save a job description as JSON using `examples/sample-job.json` as the guide.
5. Run the scoring command.

```bash
npm run dev -- score-job path/to/job.json profile.json
```

Better input produces better output. Include the complete job description, honest skills, realistic experience, preferred locations, and salary constraints. See [How to Prepare Your Inputs](docs/INPUT_GUIDE.md).

## Use it from an agent platform

| Platform | Instructions |
| --- | --- |
| Antigravity | Read `AGENTS.md` and `ANTIGRAVITY.md` |
| Claude | Read `CLAUDE.md` |
| Codex | Read `AGENTS.md` and `CODEX.md` |
| Other agents or scripts | Read `integrations/UNIVERSAL_WORKFLOW.md` |

Paste this into your agent after opening the repository:

```text
Read AGENTS.md and integrations/UNIVERSAL_WORKFLOW.md.
Use my local profile.json and the job file I provide.
Run the score_job workflow, preserve confidence and warnings,
and explain the result in plain language. Do not send emails or submit applications.
```

Detailed platform walkthroughs are in [Agent Platform Guides](docs/PLATFORM_GUIDES.md).

## Use the shared agent protocol

The package accepts a versioned JSON request. A JSON protocol is a predictable input and output format that any agent can call.

```bash
npm run protocol:describe
npm run dev -- run examples/score-request.example.json
```

Streaming hosts can send one request through standard input:

```bash
npm run build
cat examples/score-request.example.json | node dist/cli/index.js run --stdin
```

PowerShell equivalent:

```powershell
Get-Content examples/score-request.example.json | node dist/cli/index.js run --stdin
```

Request and response definitions are in `schemas/agent-request.schema.json` and `schemas/agent-response.schema.json`.

## Track a recruiter email

Try the included fictional example:

```bash
npm run demo:email
```

For your own data:

```bash
npm run dev -- match-email path/to/email.json path/to/applications.json
```

Only use email data you are authorized to process. Remove unnecessary personal information before sharing logs or bug reports.

## Safety and privacy

- Personal profiles, databases, tokens, and `.env` files are ignored by Git.
- The current tools do not send email or submit applications.
- Low-confidence email matches require review.
- Missing profile data causes an error instead of a guessed result.
- Examples are fictional and safe to publish.

Read [Privacy](docs/PRIVACY.md) and [Security Policy](SECURITY.md) before adding a connector.

## Documentation

| Guide | Use it for |
| --- | --- |
| [Getting Started](docs/GETTING_STARTED.md) | Installation and your first successful run |
| [Input Guide](docs/INPUT_GUIDE.md) | Preparing a strong profile, job, and email record |
| [Platform Guides](docs/PLATFORM_GUIDES.md) | Antigravity, Claude, Codex, and other agents |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common errors and fixes |
| [Architecture](docs/ARCHITECTURE.md) | System boundaries and extension points |
| [Universal Workflow](integrations/UNIVERSAL_WORKFLOW.md) | Shared agent behavior |
| [Contributing](CONTRIBUTING.md) | Tests and contribution rules |

## Commands

```text
npm run demo                 Run the job-scoring example
npm run demo:email           Run the email-matching example
npm run check                Build and run all tests
npm run protocol:describe    Print supported agent tasks
npm run dev -- score-job     Score a job against a profile
npm run dev -- match-email   Match an email to applications
npm run dev -- run           Execute a protocol request
```

## License

MIT. You may use, modify, and distribute this project. See [LICENSE](LICENSE).
