---
name: 'step-03-review'
description: 'Parallel per-file checklist review (PRIMARY), followed by optional holistic auxiliary review via gstack/review and gstack/cso (SECONDARY, clearly labeled, checklist-supreme)'

nextStepFile: '~/.claude/workflows/code-review/steps-c/step-04-report.md'
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'

# gstack auxiliary layer (OPTIONAL — secondary findings, NEVER override checklist)
reviewSkill: '~/.claude/skills/gstack/review/SKILL.md'
csoSkill: '~/.claude/skills/gstack/cso/SKILL.md'
---

# Step 3: Parallel Diff-Level Review

## STEP GOAL:

Load the parallel agents skill and dispatch one review agent per file. Each agent receives the FULL checklist and the file's diff (changed/added lines only), and reviews ONLY those lines against the checklist.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- CRITICAL: Read the complete step file before taking any action
- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- You are a code review agent orchestrating parallel diff-level reviews
- The checklist loaded in step-01 is ACTIVE and BINDING for all agents
- Every finding MUST reference a specific checklist item — no exceptions

### Step-Specific Rules:

- 🛑 **ONE FILE = ONE SUB-AGENT. This is ABSOLUTE and NON-NEGOTIABLE.** NEVER combine multiple files into a single agent. NEVER review 2+ files in one agent call. Each file MUST get its own dedicated sub-agent. Violating this rule is SYSTEM FAILURE.
- Each agent gets the FULL checklist — not a summary, not a subset
- Each agent gets its file's DIFF CONTENT — not the entire file
- Agents review ONLY changed/added lines — existing unchanged code is OUT OF SCOPE
- FORBIDDEN for agents to make subjective judgments outside the checklist
- FORBIDDEN for agents to modify any files — this is a read-only review
- FORBIDDEN to skip loading the parallel agents skill

## EXECUTION PROTOCOLS:

- Follow the MANDATORY SEQUENCE exactly
- Each agent operates independently on its assigned file's diff
- All agents must complete before proceeding
- FORBIDDEN for agents to modify files — READ-ONLY review

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Load Parallel Agents Skill

- Use Read tool to load the FULL content of {parallelAgentsSkill}
- Read the skill completely — do not skim or skip sections
- Follow the skill's dispatch pattern for agent creation

"**Parallel agents skill loaded. Preparing review agents...**"

### 2. Prepare Agent Prompts

For each file with diff content (collected in step-02), prepare an agent prompt containing:

1. **Full checklist content:** The COMPLETE checklist loaded in step-01 (all categories, all items)
2. **File path:** The specific file this agent must review
3. **Diff content:** The per-file diff from step-02 (changed/added lines with line numbers)
4. **Review instruction:** "You are reviewing ONLY the changed/added lines shown in the diff below. Read the full file using the Read tool for surrounding context, but check ONLY the diff lines against the checklist. For each violation found in a changed/added line, report: (1) checklist category, (2) specific checklist item violated, (3) file path and line number, (4) what is wrong, (5) how to fix it. If a checklist item does not apply to these changes, skip it. Do NOT flag existing unchanged code — ONLY changed/added lines."
5. **Scope constraint:** "Review ONLY the assigned file's changed lines. Do NOT modify any files. Do NOT read or review other files."
6. **Expected output format:** "Return a structured list of findings. Each finding must reference a specific checklist item and a specific changed line. If no violations are found in the changed lines, return 'PASS - no checklist violations in changed lines of [file_path]'."

### 3. Dispatch Agents

- Dispatch one agent per file using the Agent tool
- Each agent reviews its file's diff independently and in isolation
- Do NOT batch multiple files into a single agent

"**{{agent_count}} review agents dispatched. Reviewing changed lines...**"

### 4. Collect Primary Checklist Results

When all per-file agents return:

- Collect all findings from every agent
- Group findings by checklist category
- Verify each finding references a changed/added line AND a specific checklist item (this is the AUTHORITATIVE primary layer)
- Note which files passed with no violations
- Store as `primary_findings` for the report step

### 4b. Auxiliary Structural & Security Review (OPTIONAL — gstack/review + gstack/cso)

> **🎖️ CHECKLIST SUPREMACY REMINDER:** The grr checklist is the **PRIMARY authority** for this workflow. Any findings from this auxiliary layer are **SECONDARY**, **informational**, and clearly separated in the report. If a gstack finding is not covered by a checklist item, it is NOT a checklist violation — it is auxiliary intelligence. The user decides in step-04 whether to act on auxiliary findings alongside primary. The checklist ALWAYS wins.

**IF `{reviewSkill}` exists (gstack installed):** Load the **FULL** file via Read tool. Apply its pre-landing review framework holistically to the FULL diff (not per-file this time). Focus on issues that are hard to express as line-by-line checklist items:

- SQL safety (injection, unsafe query construction)
- LLM trust boundary violations
- Conditional side effects spanning multiple files
- Structural issues (coupling, layering, dependency inversion)
- Scope drift vs the intended responsibility

Collect as `review_auxiliary_findings` — each labeled "🔗 Auxiliary (gstack/review) — NOT in checklist".

**IF `{csoSkill}` exists (gstack installed):** Load the **FULL** file via Read tool. Apply its Chief Security Officer framework holistically to the FULL diff:

- OWASP Top 10 relevant categories
- STRIDE threat modeling on the change
- Secrets archaeology (accidental token/key commits)
- Dependency supply chain risks
- LLM-specific security (prompt injection, tool trust boundaries)

Collect as `cso_auxiliary_findings` — each labeled "🔐 Auxiliary (gstack/cso) — NOT in checklist".

**IF both skills missing:** Skip this section silently. No warning needed — this is purely auxiliary. The primary checklist review is complete without them.

### 5. Auto-Proceed

"**All file reviews complete. Collecting results...**"

#### Menu Handling Logic:

- After all agent results are collected, immediately load, read entire file, then execute {nextStepFile}

#### EXECUTION RULES:

- This is an auto-proceed step — no user interaction required
- Wait for ALL agents to complete before proceeding
- Do NOT proceed with partial results

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN all dispatched agents have returned their results will you proceed to step-04-report.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Parallel agents skill loaded via Read tool
- One agent dispatched per file with FULL checklist and diff content
- Agents reviewed ONLY changed/added lines, not entire files
- All agents completed their reviews
- Every finding references a specific checklist item AND a changed line
- No files were modified by any agent
- Results collected and grouped for reporting
- Auto-proceeded to step-04

### FAILURE:

- Not loading the parallel agents skill
- Giving agents the full file instead of diff content for review scope
- Agents flagging unchanged/existing code not in the diff
- Giving agents a summary instead of the full checklist
- Agents making subjective judgments outside the checklist
- Agents modifying files during review
- Proceeding before all agents complete
- Findings that do not reference a specific checklist item

**Master Rule:** Review ONLY changed/added lines. Every finding MUST reference a specific checklist item AND a changed line from the diff. Flagging unchanged code is SYSTEM FAILURE.
