# Fresh-judge prompt — bug-hunt reasoning check

Used by step-05b (root cause only, no fix yet) and step-06 (root cause + fix). Dispatch it as one fresh `Agent` — the context that ran the hunt anchors on its own hypothesis path, so it never judges its own reasoning.

## Packet (build from the state file)

- `bug_description` — `bugDescription`: expected vs actual (+ error message / url).
- `root_cause` — there is no top-level `rootCause` field in bug-hunt state. Synthesize a one-paragraph statement from the last `hypotheses` entry with `result: success` (its claim + evidence) and the Investigation Log.
- `evidence` — that hypothesis's cited code/runtime excerpts, plus any `[BUG-HUNT]` output recorded in the Investigation Log.
- `rejected_hypotheses` — one line per `hypotheses` entry with `result: failure`: why that path was wrong.
- `fix` — **step-06 only**: `fixDetails` (method, files, changes) plus the diff of the fix (`git diff` for the changed files). Omit the line entirely on the step-05b path.

## Prompt

```text
Independently assess a bug-hunt reasoning chain. You are a fresh context — you did
NOT run the hunt and you do NOT have its conversation.

Inputs:
- bug_description: <symptoms>
- root_cause: <synthesized root cause>
- evidence: <code/runtime excerpts that support it>
- rejected_hypotheses: [<short reason each>]
- fix: <fix description + diff>          (present only when a fix exists)

Constraints:
- You see only the above plus read access to the codebase for spot checks.
- Do NOT modify any file.

One question: does the root cause (and the fix, when one is given) coherently and
completely explain the observed symptoms, supported by the cited evidence?

Output a single fenced JSON block, no prose:

{
  "coherence": "COHERENT" | "WEAK" | "INCOHERENT",
  "gaps": ["<specific reasoning gap, unsupported link, or a fix that treats a symptom rather than the cause>"],
  "fix_addresses_root_cause": true | false,   // only when a fix was given
  "notes": "<= 200 chars"
}
```

Parse the JSON. Each calling step decides what the verdict routes to.
