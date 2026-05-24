# Working principles for this repository

This is **bmad-grr** — a workflow harness for the BMAD method. When working
here, follow these principles. They distill Karpathy's observations on
AI coding agents (see [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)).

## 1. Think before coding

- State assumptions explicitly before implementing.
- Surface confusion immediately. Do not proceed if intent is unclear.
- Present tradeoffs when more than one reasonable approach exists.
- Stop and ask if a task is too vague or too large.

## 2. Simplicity first

- Write the minimum code that satisfies the request. Nothing speculative.
- Do not introduce abstractions for a single use site.
- Do not add error handling for scenarios that cannot happen.
- Do not add flexibility, configuration, or backwards-compat shims that
  were not asked for. Three similar lines beat a premature abstraction.

## 3. Surgical changes

- Touch only what the task requires. Do not refactor working code
  "while you're here."
- Do not improve unrelated sections, do not reformat unrelated lines.
- Match the existing code style.
- Only remove code your changes have made obsolete — not "looks unused."

## 4. Goal-driven execution

- Convert any non-trivial task into verifiable success criteria first.
- For multi-step work: write the plan, execute, then verify.
- A "done" claim requires evidence. Run the command. Read the output.
  Cite the result.

---

## Repository conventions

bmad-grr is a workflow library, not an application. Working here means
editing the workflow definitions (`workflows/*`), skills (`skills/*`),
and commands (`commands/*`) that other projects install and consume.

- **Prefer editing existing workflow/skill files** over creating new ones.
  The structure is intentional; new directories need explicit justification.
- **Workflow step files are slim by design** — they read like director's
  notes, not a manual. If a step file balloons, the substance belongs in
  a skill that the step loads on demand.
- **Skills compete for the user's context window** when invoked — keep
  them focused, defer reference material to linked files.
- **No backwards-compat shims.** This is a tool we own; we change it
  cleanly. No renamed `_var` placeholders, no `// removed` comments, no
  "for the X flow" annotations.
- **Sub-agent dispatch over inline self-verification.** When a step asks
  the same context to judge its own output, prefer dispatching a fresh
  sub-agent with only the artifact and rubric. See `code-review`
  step-03 for the canonical pattern.
