---
name: 'step-02-analyze'
description: 'Load REQUIRED skills (learn, health, dispatching-parallel-agents), gather project context, discover touchpoints with parallel analysis'

nextStepFile: './step-03-architect.md'

# REQUIRED skills (load FULL when installed)
learnSkill: '~/.claude/skills/gstack/learn/SKILL.md'
healthSkill: '~/.claude/skills/gstack/health/SKILL.md'
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Step 2: Pattern Analysis

## STEP GOAL:

Build lightweight context about how the existing codebase handles the area the user wants to change — by reading `project-context.md`, querying `gstack/learn` for prior architecture learnings, discovering 3-5 touchpoint files, and optionally running a health check on the affected module.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a pragmatic dev analyst gathering thorough context to inform a mini architecture
- ✅ Compact output, thorough process — use parallel agents for multi-file analysis, let judgment decide file count
- ✅ Prefer learnings and context docs over raw code scanning when both are available
- ✅ Report what was found, not what to do with it (design is step-03's job)

### Step-Specific Rules:

- 🎯 Focus ONLY on gathering context — no architecture drafting yet
- 🎯 Use Grep/Glob for broad discovery; use Read for files actually in the blast radius — judgment decides the count
- 🎯 When 2+ independent files need deep analysis, follow `dispatching-parallel-agents` skill patterns (loaded in section 3)
- 🔧 Load all REQUIRED skills in FULL (learn, health, dispatching-parallel-agents) when installed — emit clear warning if missing
- 🚫 FORBIDDEN to propose architecture or design decisions in this step
- 💬 If a REQUIRED skill is missing, warn the user and continue — never fail, never silently skip

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Track: `project_patterns`, `prior_learnings`, `touchpoint_files`, `health_score` (if run)
- 📖 Load `project-context.md` before anything else
- 🚫 FORBIDDEN to proceed without at least one context source gathered

## CONTEXT BOUNDARIES:

- Available: User intent from step-01, project-context.md, sprint-status.yaml, codebase (Glob/Grep/Read), REQUIRED gstack + superpowers skills (loaded in full)
- Focus: Context gathering — patterns, learnings, touchpoint identification
- Limits: Read targeted files in blast radius; Grep/Glob for discovery; delegate multi-file deep analysis to parallel agents
- Dependencies: Intent + change_type from step-01

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Load Project Context

- Use Glob to search for `project-context.md` in the project (from `{project_context}` pattern)
- IF found: Read the complete file
- Extract for later use:
  - Coding standards and conventions
  - Architectural patterns (layered / clean / hexagonal / DDD / etc.)
  - Domain rules and invariants
  - Tech stack notes
- IF NOT found: Note `project_context_status = "not found — relying on /learn + code scan"`

### 2. Query Prior Learnings (REQUIRED — gstack/learn)

**IF `{learnSkill}` exists:** Load the **FULL** file via Read tool. Internalize its Project Learnings Manager framework and command set, then invoke its search capability to retrieve entries relevant to the user's intent and touchpoint hints.

Focus on entries where `type` is one of:

- `architecture` — prior architectural decisions that bind this project
- `pattern` — reusable patterns the team has settled on
- `pitfall` — known traps to avoid

These represent prior decisions made on this project that you **MUST** respect when designing the mini architecture in step-03. Capture the most relevant entries as `prior_learnings` — however many are genuinely relevant.

**IF `{learnSkill}` does NOT exist:** Emit warning:

> ⚠️ `gstack/learn` not installed — prior architecture decisions will not be consulted. Install gstack to enable full quality.

Continue with `prior_learnings = []`.

### 3. Discover Touchpoint Files (REQUIRED — dispatching-parallel-agents)

**IF `{parallelAgentsSkill}` exists:** Load the **FULL** file via Read tool. Internalize its parallel dispatch patterns before scanning the codebase.

Based on `intent` and `touchpoint_hints` from step-01:

- Use **Glob** to find candidate files matching hinted paths or feature area
- Use **Grep** to find files containing keywords from the intent (semantic keywords, not just literal strings)
- Narrow candidates to the files actually in the blast radius — trust your judgment on "how many is enough"
- **For deep analysis of 2+ independent files**, follow the `dispatching-parallel-agents` skill pattern: dispatch parallel sub-agents (one per file or logical group), each returning a structured summary. Aggregate in main thread.
- **For small/obvious files**, Read directly in main context

For each touchpoint, capture:

- `path`
- `one-line purpose` (inferred from content or filename)
- `relevant existing patterns` (imports, structure, conventions observed)
- `blast radius` (what else changes if we modify this)

**IF `{parallelAgentsSkill}` does NOT exist:** Emit warning:

> ⚠️ `dispatching-parallel-agents` not installed (bundled with bmad-grr — run `bash install.sh`). Falling back to sequential Read.

Continue with sequential reads.

### 4. Module Health Check (REQUIRED — gstack/health)

**IF `{healthSkill}` exists:** Load the **FULL** file via Read tool. Internalize its multi-tool pipeline (type checker, linter, test runner, dead code detector, shell linting).

Run its health check scoped to the touchpoint files/module — use the scoped health command if the skill supports it, otherwise run the full check and filter results to the touchpoint area. Capture:

- Composite score (0-10)
- Per-tool findings in the blast radius
- HIGH-severity issues that must influence the mini architecture (e.g., existing type errors to preserve or fix alongside the change, dead code to avoid touching, lint rules the change must honor)

Store as `health_findings`.

**IF `{healthSkill}` does NOT exist:** Emit warning:

> ⚠️ `gstack/health` not installed — current module quality state will not be measured. Install gstack to enable.

Continue with `health_findings = null`.

### 5. Present Context Summary

"**분석 완료!** 📊

**프로젝트 컨텍스트:** {project_context_status}

**과거 학습 (gstack/learn):**
{relevant_learnings_bullets or '⚠️ gstack/learn 미설치 또는 관련 항목 없음'}

**터치포인트 후보 파일:**
- `{path1}` — {purpose} ({blast_radius})
- `{path2}` — {purpose} ({blast_radius})
- ... ({analyzed via parallel-agents / sequential})

**관찰된 기존 패턴:**
- {pattern_1}
- {pattern_2}

**코드 건강도 (gstack/health):** {score}/10 — {key_issues}
{IF health missing: '⚠️ gstack/health 미설치 — 건강도 측정 생략'}

**누락된 REQUIRED 스킬:** {list or '없음'}

**다음 단계: 이 정보로 mini architecture를 짜볼게요...** 🏗️"

### 6. Auto-Proceed

#### Menu Handling Logic:

- After context is gathered, immediately load, read entire file, then execute `{nextStepFile}`

#### EXECUTION RULES:

- This is an auto-proceed analysis step
- Only halt if user must confirm the health check offer
- After section 5 runs, proceed directly to next step

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN at least one context source (project-context OR prior learnings OR file scan) has been gathered will you proceed to step-03-architect.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- `project-context.md` loaded (if exists)
- `gstack/learn` loaded in FULL and queried for relevant entries (if installed)
- `gstack/health` loaded in FULL and health check run on touchpoint area (if installed)
- `dispatching-parallel-agents` loaded and applied to multi-file analysis (if installed and 2+ files)
- Touchpoint files discovered with pattern + blast-radius context
- Clear warnings emitted for any missing REQUIRED skills
- Context summary communicated
- Auto-proceeded to step-03

### FAILURE:

- Partial loading of REQUIRED skills (section-selecting instead of FULL load)
- Silently skipping missing REQUIRED skills without user warning
- Starting architecture drafting in this step
- Proceeding without any context source
- Using sequential Read when parallel-agents is available and 2+ files need deep analysis

**Master Rule:** Load ALL REQUIRED skills in full. Gather context thoroughly with parallel agents when multiple files are involved. Compact output, thorough process.
