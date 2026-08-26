# Getting Started

This guide takes you from a fresh computer to your first job-fit result.

## What you need

- Git
- Node.js 22 or newer
- npm, which is included with Node.js
- A terminal: PowerShell, Command Prompt, Terminal, or a terminal inside your agent platform

Check your installation:

```bash
node --version
npm --version
git --version
```

## Install the project

These commands work in PowerShell, Command Prompt, macOS, and Linux:

```bash
git clone https://github.com/abluvsu/indian_career_strategy.git
cd indian_career_strategy
npm install
npm run check
```

`npm run check` should finish with all tests passing. It does not use your email account or send data anywhere.

## Run the safe demo

```bash
npm run demo
```

Look for these fields in the output:

```json
{
  "ok": true,
  "task": "score_job",
  "result": {
    "score": 100,
    "decision": "shortlist",
    "confidence": 0.75
  }
}
```

The exact job ID may differ if you change the example. The request should remain successful.

## Create your profile

### Windows PowerShell

```powershell
Copy-Item examples/profile.example.json profile.json
notepad profile.json
```

### macOS or Linux

```bash
cp examples/profile.example.json profile.json
${EDITOR:-nano} profile.json
```

Replace the fictional values with your own preferences. Do not add passwords, email tokens, identity documents, or information you do not want stored locally.

## Score your first job

Copy `examples/sample-job.json` to a new local file, replace its contents with the real job details, then run:

```bash
npm run dev -- score-job my-job.json profile.json
```

Use the result as decision support. A high score does not guarantee an interview, and a low score does not prevent you from applying.

## Next steps

- Improve your inputs with [Input Guide](INPUT_GUIDE.md).
- Connect your agent with [Platform Guides](PLATFORM_GUIDES.md).
- Fix common problems with [Troubleshooting](TROUBLESHOOTING.md).
