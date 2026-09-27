---
name: step-05b-branch-to-story
description: 'Documentation-first fork — fresh-judge the confirmed root cause, clean debug logs, then hand off to quick-story (new) or refine-story (existing) for structured implementation via dev-story instead of fixing inline'
stateFile: '{output_folder}/bug-hunt-{date}.state.md'
extendStepFile: './step-02-code-analysis.md'
wrapupStepFile: './step-06-wrapup.md'
freshJudgePrompt: '../data/fresh-judge-prompt.md'
quickStoryCommand: '~/.claude/commands/bmad-grr-quick-story.md'
refineStoryCommand: '~/.claude/commands/bmad-grr-refine-story.md'
---

# Step 5b — Branch to Story (Documentation-First)

## Outcome

A confirmed-but-unfixed root cause is converted into a structured story document instead of being patched inline. The reasoning is independently fresh-judged first, every tracked `[BUG-HUNT]` debug log is removed before leaving (the Iron Law holds across the handoff), and control passes to `quick-story` (no existing story) or `refine-story` (an existing story was bound at init) — which then route into `dev-story`. The bug-hunt session never resumes; `dev-story`'s own verification owns the fix.

This step is reached from the **success** menu of step-02 / 03 / 04 via `[Q]`. It is the right call for multi-file or recurrence-prone bugs that deserve a documented story; for a single-file, low-complexity fix, `[S]` Skip to Fix is the lighter path.

## Approach

### Read the session

Load `{stateFile}` completely: `bugDescription`, `hypotheses` (the last entry with `result: success` is the confirmed one), `documentationTarget`, `debugLogs`, the Investigation Log.

### Fresh-judge the reasoning (no fix yet)

The same context that ran the hunt anchors on its own hypothesis. Load `{freshJudgePrompt}`, build its packet **without** the `fix` line — there is no fix or diff on this path — and dispatch it as one fresh `Agent`. The synthesized root cause from that packet also seeds the handoff below.

Parse the JSON.

- **COHERENT** — proceed.
- **WEAK** — proceed, but carry `gaps` into the handoff so the story's Dev Notes record them.
- **INCOHERENT** — strong signal the root cause may not actually explain the bug. **Halt. Create no story.** Present the gaps and offer:
  - `[E]` Extend the hunt — load `{extendStepFile}` with the gaps as new questions. **Leave debug logs in place** so the resumed hunt stays instrumented.
  - `[X]` Discard — clean up debug logs (below), set `status: UNRESOLVED`, and load `{wrapupStepFile}` to document the unresolved investigation and close.

### Remove every tracked debug log (COHERENT / WEAK only)

The Iron Law: debug logs are forcibly cleaned up regardless of outcome, and `dev-story` is never responsible for bug-hunt's logs. For each entry in `debugLogs`, open the file and remove the tracked line; verify the surrounding code still parses. Then grep the codebase for `[BUG-HUNT]` to catch any drift, and for frontend bugs confirm via Chrome DevTools that no `[BUG-HUNT]` console output remains. Set `debugLogs: []` in state. (If `debugLogs` is already empty — resolved at Level 1 — note it and continue.)

### Compose the handoff block

```
HANDOFF: bug-hunt → story
change_type: fix
stateFile: {absolute path to this state file}
intent: 버그 수정 — {expected} 여야 하는데 {actual}. 근본 원인: {synthesized root cause, 1 line}
coherence: {COHERENT | WEAK}
gaps: {WEAK gaps, else none}
touchpoints: {files from the confirmed hypothesis's evidence + bugDescription.url}
existingStory: {documentationTarget.path if type == story and the file exists, else empty}
```

### Branch

- **Existing story** (`existingStory` set) — load and follow `{refineStoryCommand}`, passing the HANDOFF block and the story path. refine-story folds the fix into the existing story and routes onward to dev-story. Because the artifact already exists, set `status: HANDED_OFF` in this state file **now**, before handing off (no orphan risk), and append `step-05b-branch-to-story` to `stepsCompleted`.

- **New story** (`existingStory` empty) — load and follow `{quickStoryCommand}` with `$ARGUMENTS` set to the HANDOFF block. **Do not flip status here** — leave `status: IN_PROGRESS` so a `(D) 취소` inside quick-story leaves a resumable hunt, not a terminal pointer to nothing. quick-story back-fills `documentationTarget.path` and flips `status: HANDED_OFF` after it registers the story. End this workflow there.

## Communicate

Briefly, in `{communication_language}`: the confirmed root cause (one line), the coherence verdict, that debug logs were cleaned, and which story workflow control is passing to. Make clear bug-hunt will not resume — the fix is owned by dev-story.
