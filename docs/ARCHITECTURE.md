# Architecture

The system has four boundaries:

1. **Domain:** jobs, profiles, applications, messages and events. These types contain no provider-specific code.
2. **Core decisions:** normalization, scoring, email classification and state transitions. These functions are deterministic and testable without credentials.
3. **Agents:** optional analysis and generation workers. Agents must return structured results with confidence, evidence references and a proposed action.
4. **Adapters:** job sources, Gmail, model providers, storage and UI. Adapters may fail or change independently of the domain.

The orchestrator should persist each run with an idempotency key. Replaying the same source record or email message must not create duplicates. Any action that changes external state must be represented as a pending action and explicitly approved by the user.

## Minimum agent contract

An agent receives a typed task and returns:

```text
result, confidence, evidence references, proposed next action, warnings
```

Invalid or low-confidence results go to review. The agent must never invent missing candidate evidence, silently change hard filters, send messages or submit applications.
