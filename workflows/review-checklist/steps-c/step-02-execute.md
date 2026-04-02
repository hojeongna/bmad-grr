---
name: 'step-02-execute'
description: 'Dispatch parallel agents for selected automatic modes and collect results'

nextStepFile: './step-03-interactive.md'
skipToIntegrate: './step-04-integrate.md'
outputFile: '{output_folder}/checklist-{project_name}.md'
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
analysisCategories: '../data/analysis-categories.md'
---

# Step 2: Execute — Parallel Mode Dispatch

## STEP GOAL:

Dispatch parallel agents for each selected automatic mode (project analysis, PR review mining, universal) and collect their checklist draft results.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step, ensure entire file is read
- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- You are a code review checklist expert orchestrating parallel analysis
- The analysis categories from {analysisCategories} guide what to analyze
- Every generated checklist item must be specific and verifiable

### Step-Specific Rules:

- Focus ONLY on dispatching agents and collecting results
- FORBIDDEN to manually generate checklist items — agents do the work
- FORBIDDEN to modify any project files — this is READ-ONLY analysis
- Use Pattern 4 (Parallel Execution) for agent dispatch
- Each agent returns structured checklist items, NOT raw analysis data
- If subprocess/Agent tool unavailable, perform analysis sequentially in main thread

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Load Parallel Agents Skill

- Use Read tool to load the FULL content of {parallelAgentsSkill}
- Use Read tool to load {analysisCategories} for analysis guidance
- Read both completely before proceeding

"**Parallel agent skill loaded. Preparing agents...**"

### 2. Prepare Agent Prompts

For each selected automatic mode, prepare a focused agent prompt:

**Agent A — Project Analysis (IF mode A selected):**

Prompt must include:
1. Project root path (from step-01)
2. Convention document content (if loaded in step-01)
3. Convention strategy (convention-based / code-based / both)
4. Full analysis categories from {analysisCategories}
5. Instruction: "Analyze the project codebase systematically. For each analysis category, examine actual code files using Read, Glob, and Grep tools. Identify patterns, conventions, and rules the project follows. Generate specific, verifiable checklist items in this format:

For each category, output:
```
## [Category Name]
- [ ] [Specific verifiable checklist item]
- [ ] [Specific verifiable checklist item]
```

Rules:
- Every item must be objectively verifiable (pass/fail determinable by reading code)
- Include the ACTUAL pattern found (e.g., 'Components use PascalCase' not 'Follow naming convention')
- If a pattern is inconsistent across the codebase, note it and pick the majority pattern
- Skip categories that don't apply to this project
- Do NOT modify any files — READ-ONLY analysis
- Return ONLY the structured checklist items"

**Agent P — PR Review Mining (IF mode P selected):**

Prompt must include:
1. GitHub repo info (owner/repo from step-01)
2. PR range (from step-01)
3. Instruction: "Use gh CLI to collect human reviewer comments from pull requests.

Steps:
1. Run `gh pr list --repo {owner/repo} --state merged --limit {pr_count} --json number,title`
2. For each PR, run `gh pr view {number} --repo {owner/repo} --json reviews,comments` and `gh api repos/{owner/repo}/pulls/{number}/comments`
3. Filter for HUMAN reviewer comments only (ignore bot comments)
4. Categorize recurring review themes (what do reviewers commonly point out?)
5. Generate checklist items based on patterns found

Output format:
```
## [Category derived from review themes]
- [ ] [Checklist item based on common review feedback]
```

Rules:
- Focus on RECURRING themes, not one-off comments
- Each item should prevent the kind of issue reviewers commonly flag
- Include the frequency/importance of each theme
- Return ONLY the structured checklist items"

**Agent U — Universal Best Practices (IF mode U selected):**

Prompt must include:
1. Tech stack (from step-01)
2. Instruction: "Generate a comprehensive code review checklist based on universal best practices for the given tech stack.

Use your knowledge and WebSearch/WebFetch tools to find current best practices for: {tech_stack}

Cover these areas:
- Language-specific conventions and idioms
- Framework-specific patterns and anti-patterns
- Common pitfalls and security concerns
- Performance best practices
- Accessibility requirements (if applicable)
- Testing conventions

Output format:
```
## [Category Name]
- [ ] [Specific verifiable checklist item]
```

Rules:
- Items must be specific to the tech stack, not generic
- Every item must be objectively verifiable
- Prioritize items that catch real bugs over style preferences
- Return ONLY the structured checklist items"

### 3. Dispatch Agents

- Dispatch agents using the Agent tool — one agent per selected automatic mode
- All agents run in parallel (independent, no shared state)
- Do NOT batch multiple modes into a single agent

"**{agent_count} agents dispatched. Analysis in progress...**"

### 4. Collect Results

When all agents return:
- Collect all checklist draft results from every agent
- Store results grouped by mode (A/P/U) for the integration step
- Note any agents that returned empty or error results

"**All agent analysis complete. Collecting results...**"

### 5. Route to Next Step

**IF interactive mode (I) was selected:**
- "**Automatic mode analysis complete. Proceeding to interactive mode...**"
- Load, read entire file, then execute {nextStepFile} (step-03-interactive)

**IF interactive mode was NOT selected:**
- "**All mode analysis complete. Proceeding to result integration...**"
- Load, read entire file, then execute {skipToIntegrate} (step-04-integrate)

#### Menu Handling Logic:

- IF interactive mode selected: auto-proceed to {nextStepFile}
- IF interactive mode NOT selected: auto-proceed to {skipToIntegrate}

#### EXECUTION RULES:

- This is an auto-proceed step — no user interaction required
- Wait for ALL agents to complete before proceeding
- Do NOT proceed with partial results

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Parallel agents skill loaded via Read tool
- One agent dispatched per selected automatic mode with proper prompt
- All agents completed their analysis
- Every checklist item is specific and verifiable
- No project files were modified
- Results collected and stored for integration
- Correctly routed to step-03 (if interactive) or step-04 (if not)

### FAILURE:

- Not loading the parallel agents skill
- Dispatching agents without analysis categories
- Agents returning raw analysis instead of structured checklist items
- Agents modifying project files
- Proceeding before all agents complete
- Routing to wrong next step

**Master Rule:** Each agent produces structured checklist items, NOT raw analysis. Items must be specific and verifiable. Violating this is SYSTEM FAILURE.
