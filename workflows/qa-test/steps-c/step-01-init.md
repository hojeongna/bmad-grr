---
name: 'step-01-init'
description: 'Initialize QA session: find story/epic, load context, determine scope, identify app URL'

nextStepFile: './step-02-test-plan.md'
continueFile: './step-01b-continue.md'
stateFile: '{output_folder}/qa-test-{date}.state.md'
learn_skill: '~/.claude/skills/gstack/learn/SKILL.md'
implementation_artifacts: '{config_source}:implementation_artifacts'
sprint_status: '{implementation_artifacts}/sprint-status.yaml'
---

# Step 1: Initialize QA Test Session

## STEP GOAL:

Determine the QA scope (single story or full epic), load story documents, identify the target application URL, and create the state tracking file for this QA session.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 🤝 You facilitate DECISIONS (present options, wait for user choices). You execute TASKS autonomously within approved scope.
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a tool you do not have access to, achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a meticulous QA engineer who tests like a real user
- ✅ Browser evidence is the only proof — code alone means nothing
- ✅ Fix immediately when possible, document thoroughly when not

### Step-Specific Rules:

- 🎯 Focus ONLY on gathering scope and setting up the session
- 🚫 FORBIDDEN to start testing anything
- 🚫 FORBIDDEN to open the browser yet
- 💬 Collect story/epic reference and app URL

## EXECUTION PROTOCOLS:

- 🎯 Check for existing state file FIRST (continuation detection)
- 💾 Create state file with QA scope info
- 🚫 This is init — set up everything, test nothing

## CONTEXT BOUNDARIES:

- This is the first step — no prior context exists
- User may provide a story path, epic reference, or just say "test this"
- Must determine: QA scope (story vs epic), story files, app URL
- No testing happens here — that's step-03

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Check for Existing Session

Run: `uv run {installed_path}/scripts/qa-state.py find-active --directory {output_folder}`

- **If active sessions found:** Load and execute `{continueFile}` to resume.
- **If none found:** Continue to step 2 below.

### 2. Internalize Core Principle

The verification skill will be loaded in step-03 when browser testing begins. For now, internalize the core QA principle:

```
NO CLAIM WITHOUT EVIDENCE. Run it. See it. Screenshot it.
```

### 3. Determine QA Scope

Parse $ARGUMENTS if provided. If not sufficient, ask:

"**QA Test session started!**

What are we testing today?

- **[S]** Single story — provide story file path
- **[E]** Full epic — provide epic identifier or path

Also, what's the **app URL**? (e.g., http://localhost:3000)"

**Wait for user response.**

### 3b. Resolve Story Files

**If Single Story mode:**
- Verify the story file exists at the given path
- Read the story file to extract: title, acceptance criteria count, task count
- Store as `stories: [{ path, title, status: 'pending' }]`

**If Epic mode:**
- Read the epic document or sprint status at `{sprint_status}`
- Identify ALL stories belonging to the epic
- Sort stories by dependency order (if specified) or document order
- Store as `stories: [{ path, title, status: 'pending' }, ...]`
- Display the full story list to the user:

"**Epic QA scope — {N} stories to test:**

| # | Story | Status |
|---|-------|--------|
| 1 | [story title] | pending |
| 2 | [story title] | pending |
| ... | ... | ... |

We'll test each story in order, completing one before moving to the next."

### 4. Query Prior QA Learnings (gstack/learn)

**IF `{learn_skill}` exists (gstack installed):**

Load the FULL `{learn_skill}` file via Read tool. Search for prior QA learnings using keywords from the story/epic (feature names, page names, component names).

Focus on entries where `type` is:
- `pitfall` — known QA traps
- `pattern` — recurring test failure patterns
- `architecture` — constraints that affect testing

**If matches found:** Present to user and note in state file as `prior_learnings`.
**If no matches or skill missing:** Silently skip.

### 5. Confirm App URL and Environment

Verify the app URL is accessible (but do NOT start testing yet):

"**Session ready!**

- **Scope:** [single story / epic with N stories]
- **Target:** [story title or epic name]
- **App URL:** [URL]
- **Stories to test:** [count]

Ready to generate the test plan for the first story?"

**Wait for user confirmation.**

### 6. Create State File

Run:
```bash
uv run {installed_path}/scripts/qa-state.py create \
  --output "{output_folder}/qa-test-{date}.state.md" \
  --scope [story|epic] \
  --app-url "[app URL]" \
  --epic-id "[epic id or omit]" \
  --stories "path1|title1" "path2|title2" ...
```

### 7. Auto-Proceed to Next Step

This is an init step with no menu choices at the end.

After state file created and scope confirmed, immediately load, read entire file, then execute `{nextStepFile}` to begin test plan generation for the first story.

---

## SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Continuation check performed
- QA scope determined (story vs epic)
- All story files identified and verified
- App URL collected
- State file created with complete scope info

### ❌ SYSTEM FAILURE:

- Starting any testing in this step
- Opening the browser in this step
- Not verifying story files exist
- Not collecting app URL
- Skipping continuation check
