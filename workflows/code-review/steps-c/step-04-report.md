---
name: 'step-04-report'
description: 'Aggregate PRIMARY checklist findings + AUXILIARY (gstack review/cso) findings with clear separation, assign priorities, present a two-layer report, and route to fix or complete'

fixStepFile: '~/.claude/workflows/code-review/steps-c/step-05-fix.md'
completeStepFile: '~/.claude/workflows/code-review/steps-c/step-06-complete.md'
reviewSkill: '~/.claude/skills/gstack/review/SKILL.md'
csoSkill: '~/.claude/skills/gstack/cso/SKILL.md'
---

# Step 4: Report — Aggregate Results and Present Findings

## STEP GOAL:

Aggregate all review results from parallel agents, assign priorities to each finding, present a clear report, and ask the user whether to fix violations or skip.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step, ensure entire file is read
- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- You are a code review agent performing checklist-based reviews
- You follow the checklist EXACTLY — no subjective opinions allowed
- Every finding MUST reference a specific checklist item

### Step-Specific Rules:

- Focus ONLY on aggregation, prioritization, and report presentation
- 🎖️ **CHECKLIST SUPREMACY**: PRIMARY findings are the authoritative layer. Every primary finding MUST reference a specific checklist item.
- 🔗 **AUXILIARY SEPARATION**: gstack/review and gstack/cso findings from step-03 section 4b are the SECONDARY layer. They MUST be reported in clearly separated sections ("🔗 Auxiliary — NOT in checklist"). They do NOT count as checklist violations.
- FORBIDDEN to add PRIMARY findings not backed by a checklist item
- FORBIDDEN to merge auxiliary findings into the primary list
- FORBIDDEN to include subjective opinions or stylistic preferences in the primary layer
- FORBIDDEN to fix any code in this step — report only

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Aggregate Results (PRIMARY + AUXILIARY, clearly separated)

**Primary layer (checklist-based, from step-03 section 4):**

- Collect all `primary_findings` from parallel review agents
- Group by file
- Remove duplicates (same checklist item, same location)
- Retain the checklist category and item reference for each finding
- This is the AUTHORITATIVE layer — these are the real findings

**Auxiliary layer (from step-03 section 4b, only if gstack was available):**

- Collect `review_auxiliary_findings` from `gstack/review` (structural issues: SQL safety, LLM trust boundaries, conditional side effects, coupling/layering, scope drift)
- Collect `cso_auxiliary_findings` from `gstack/cso` (security: OWASP, STRIDE, secrets, supply chain, LLM security)
- Keep each group **clearly labeled and separate** from primary
- Do NOT merge auxiliary into primary under any circumstance
- If step-03 didn't produce auxiliary findings (gstack not installed), set auxiliary = empty and proceed

### 2. Assign Priority

For each finding, assign one priority level:

- **HIGH**: Incorrect behavior, wrong patterns, violations that could cause bugs (e.g., wrong data flow, cache reference violations)
- **MEDIUM**: Naming violations, structural issues, wrong file organization (e.g., type in wrong location, constants inside component)
- **LOW**: Style issues, minor naming inconsistencies

### 2b. Assign Scope

For each finding, assign scope:

- **SMALL**: Simple fixes — variable rename, import addition, single-line change, type annotation, etc.
- **LARGE**: Broad changes — file structure change, logic refactoring, multi-file impact, architectural change

### 3. Present Report (Two-Layer Format)

"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**
**Code Review Report**

**Total files:** {{file_count}}

## 🎖️ PRIMARY — Checklist Violations (Authoritative)

**Violations found:** {{primary_count}} (🔴 High: {{high}}, 🟡 Medium: {{med}}, 🟢 Low: {{low}})

---

**Results by file:**

For each file:
**📄 {{file_path}}** — {{status: PASS or FAIL}}
- 🔴/🟡/🟢 [Checklist category] Item: Description (line {{line}}) [SMALL/LARGE]

**Scope summary:** 🔧 Small: {{small_count}}, 🏗️ Large: {{large_count}}

---

## 🔗 AUXILIARY — Structural (gstack/review) — NOT in checklist

> ⚠️ These findings come from `gstack/review` and represent structural issues that are hard to express as line-by-line checklist items. They are **informational** and **separate** from primary findings. The checklist is the authoritative layer — these do NOT count as checklist violations.

{{if review_auxiliary_findings:}}
- 🔗 {{category}}: {{description}} ({{file_path}}:{{line}}) — *{{severity}}*
- 🔗 ... (one per finding)
{{else if gstack/review not installed:}}
_gstack/review 미설치 — structural layer skipped._
{{else:}}
_No auxiliary structural findings._

---

## 🔐 AUXILIARY — Security (gstack/cso) — NOT in checklist

> ⚠️ These findings come from `gstack/cso` (Chief Security Officer mode). They are **informational** security observations, separate from primary checklist findings. The checklist is the authoritative layer.

{{if cso_auxiliary_findings:}}
- 🔐 {{category}}: {{description}} ({{file_path}}:{{line}}) — *{{severity}}*
- 🔐 ... (one per finding)
{{else if gstack/cso not installed:}}
_gstack/cso 미설치 — security layer skipped._
{{else:}}
_No auxiliary security findings._

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**"

### 4. Handle No Violations

If zero violations found:

"**All Clear! All files passed the checklist.**"

Auto-proceed: immediately load, read entire file, then execute {completeStepFile}

### 5. Scope Drift Detection (gstack)

**IF {reviewSkill} exists (gstack installed) AND review_source == "story":**

Load {reviewSkill} via Read tool and follow its scope drift detection directives:

- Compare the git diff against the story's AC and Tasks — did we build exactly what was planned?
- Flag **scope drift**: features added beyond story scope, or AC items not fully addressed
- Flag **missing requirements**: planned items that don't appear in the diff
- Check for SQL safety, race conditions, LLM trust boundary violations if applicable

"**Scope Drift Analysis:**
- **Drift detected:** {none / list of drifts}
- **Missing from plan:** {none / list of gaps}
- **Safety concerns:** {none / list}"

**IF {reviewSkill} does NOT exist OR review_source != "story":** Skip this section.

### 6. Ask About Fixes (only if violations exist)

> **Checklist supremacy reminder**: Primary fixes are authoritative. Auxiliary findings are separate; the user decides whether to act on them.

"**Would you like to fix the findings?**

**Primary (Checklist) fixes:**
**[F]** Full — Fix all PRIMARY findings unconditionally
**[S]** Small — Apply only small-scope primary fixes
**[H]** High — Fix HIGH priority primary items only
**[X]** Skip primary fixes

**Auxiliary layer (optional — the checklist is the real gate):**
**[+A]** Also include auxiliary (gstack/review + gstack/cso) findings in the fix batch (only if any exist)
**[-A]** Primary only (default — auxiliary is informational)"

#### Menu Handling Logic:

- **IF F (+A optional):** Set `fixScope='ALL'`, `includeAuxiliary={true if +A else false}`, load, read entire file, then execute {fixStepFile}
- **IF S (+A optional):** Set `fixScope='SMALL'`, `includeAuxiliary={...}`, load, read entire file, then execute {fixStepFile}
- **IF H (+A optional):** Set `fixScope='HIGH'`, `includeAuxiliary={...}`, load, read entire file, then execute {fixStepFile}
- **IF X:** Load, read entire file, then execute {completeStepFile}
- **Default auxiliary:** If user doesn't explicitly say +A, treat as -A (primary only)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- Only proceed based on user selection
- Do NOT default to any option

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- PRIMARY findings collected from parallel agents (step-03 section 4)
- AUXILIARY findings (review + cso) collected from step-03 section 4b (if gstack was available)
- Primary and auxiliary kept in clearly separated groups — no merging
- Findings grouped by file with duplicates removed
- Priority (HIGH/MEDIUM/LOW) assigned to every PRIMARY finding
- Scope (SMALL/LARGE) assigned to every PRIMARY finding
- Two-layer report presented with primary first (authoritative) and auxiliary clearly labeled
- User prompted for fix scope selection including auxiliary toggle (or auto-proceeded if no violations)

### FAILURE:

- Merging auxiliary findings into the primary list
- Presenting a single unified list without the checklist-supremacy separation
- Missing files in report
- No priorities assigned to primary findings
- Subjective findings in the primary layer without checklist backing
- Proceeding without user input when violations exist
- PRIMARY findings without checklist item references

**Master Rule:** PRIMARY is the authority — every primary finding MUST reference a specific checklist item. AUXILIARY is informational — it lives in its own clearly-labeled section and NEVER overrides the checklist.
