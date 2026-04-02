---
name: 'step-01-init'
description: 'Select generation modes and collect required inputs for checklist generation'

nextStepFile: './step-02-execute.md'
skipToInteractive: './step-03-interactive.md'
outputFile: '{output_folder}/checklist-{project_name}.md'
templateFile: '../data/checklist-template.md'
analysisCategories: '../data/analysis-categories.md'
---

# Step 1: Initialize — Mode Selection and Input Collection

## STEP GOAL:

Select one or more checklist generation modes and collect required inputs for each selected mode.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step, ensure entire file is read
- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- You are a code review checklist expert
- You help users select the right generation modes for their needs
- You collect all necessary inputs efficiently without unnecessary questions

### Step-Specific Rules:

- Focus ONLY on mode selection and input collection
- FORBIDDEN to start generating checklist items in this step
- FORBIDDEN to proceed without at least 1 mode selected
- Ask about convention documents for all modes that analyze code

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Welcome and Mode Selection

"**Checklist for Code Review**

Generate a checklist for use with the code-review workflow.

**Select generation modes (multiple selections allowed):**

**[A]** Project Analysis — Generate checklist by analyzing the actual codebase
**[P]** PR Review Mining — Collect and synthesize human review comments from GitHub PRs
**[I]** Interactive — Build step-by-step through category-by-category conversation
**[U]** Universal — Generate universal checklist based on tech stack using AI knowledge + web search

e.g.: `A,U` (Project Analysis + Universal) or `A,P,I,U` (all)"

Wait for user input. Store selected modes.

### 2. Collect Mode-Specific Inputs

**IF mode A (Project Analysis) selected:**
- Ask for project root path (default: current directory)
- "Please provide the project root path. (Default: current directory)"

**IF mode P (PR Review Mining) selected:**
- Ask for GitHub repo info: "Please provide the GitHub repo info (e.g.: owner/repo)"
- Ask for PR range: "How far back should we look at PRs? (e.g.: last 20, last 3 months)"

**IF mode U (Universal) selected:**
- Ask for tech stack: "Please provide the tech stack (e.g.: React, TypeScript, Next.js, Tailwind)"

**IF mode I (Interactive) selected:**
- No input needed here — will be handled in step-03

### 3. Convention Document Discovery

**IF mode A or U selected:**

"**Do you have a conventions document?**

**[D]** Direct input — Provide the path
**[S]** Auto-scan — Automatically search the project
**[N]** None — Proceed without conventions document"

**IF D:** Ask for path, use Read tool to load the document
**IF S:** Search for common convention files:
- `CONVENTIONS.md`, `CONTRIBUTING.md`, `.eslintrc*`, `.prettierrc*`, `tsconfig.json`, `STYLEGUIDE.md`, `CODING_STANDARDS.md`
- Present found files: "Found these files: [list]. Which ones should we use?"
**IF N:** Skip convention loading

**IF convention document found, ask:**

"**Should the checklist be based on the conventions document, or actual code analysis?**

**[C]** Based on conventions document — Generate checklist from rules defined in the document
**[R]** Based on actual code — Generate from patterns actually used in the code
**[B]** Both — Reflect conventions document + actual code patterns"

### 4. Create Output File

- Copy {templateFile} to {outputFile}
- Fill in frontmatter: project name, tech stack, date, selected modes

### 5. Summarize and Auto-Proceed

"**Setup complete:**
- Selected modes: [selected modes]
- [mode-specific inputs summary]
- Conventions document: [status]

**Starting checklist generation...**"

#### Menu Handling Logic:

- IF any automatic mode (A/P/U) selected: load, read entire file, then execute {nextStepFile} (step-02-execute)
- IF only interactive mode (I) selected: skip step-02, load, read entire file, then execute {skipToInteractive} (step-03-interactive)

#### EXECUTION RULES:

- This is an auto-proceed step after all inputs are collected
- Route based on selected modes: automatic modes → step-02, interactive-only → step-03
- HALT only if user cannot provide required inputs for selected modes
- HALT if no modes are selected

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- At least 1 mode selected
- All required inputs for selected modes collected
- Convention document handled (found/skipped/loaded)
- Output file created from template
- Auto-proceeded to step-02

### FAILURE:

- Proceeding without any mode selected
- Starting checklist generation in this step
- Not asking about convention documents
- Missing required inputs for selected modes

**Master Rule:** All inputs must be collected before proceeding. No mode selected = HALT.
