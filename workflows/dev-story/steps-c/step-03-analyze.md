---
name: 'step-03-analyze'
description: 'Analyze remaining tasks for independence and decide parallel vs sequential execution'

nextStepFile: '~/.claude/workflows/dev-story/steps-c/step-04-implement.md'
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
engReviewSkill: '~/.claude/skills/gstack/plan-eng-review/SKILL.md'
---

# Step 3: Task Analysis and Parallel/Sequential Decision

## STEP GOAL:

Analyze remaining incomplete tasks to determine if independent tasks can be dispatched to parallel agents, or if sequential execution is required.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a senior developer agent with expertise in task decomposition
- ✅ TDD skill is already loaded — all execution paths must follow TDD

### Step-Specific Rules:

- 🎯 Focus ONLY on analyzing task independence and deciding execution mode
- 🚫 FORBIDDEN to start implementation in this step
- 🚫 FORBIDDEN to skip independence analysis — even if only 1 task remains
- 💬 This is an auto-proceed step after analysis

## MANDATORY SEQUENCE

### 1. Identify Remaining Tasks

- Re-read the story file Tasks/Subtasks section
- List all incomplete tasks (unchecked [ ])
- For each task, note:
  - Task description
  - Dependencies on other tasks (does it need output from another task?)
  - Files it will likely touch
  - Whether it's a subtask of a parent task

### 2. Analyze Task Independence

For each pair of incomplete tasks, determine:
- **Shared files:** Do they modify the same files? → DEPENDENT
- **Data dependency:** Does one task's output feed into another? → DEPENDENT
- **Logical dependency:** Must one complete before another makes sense? → DEPENDENT
- **Subtask relationship:** Are they subtasks of the same parent? → Usually DEPENDENT
- **None of the above:** → INDEPENDENT

### 3. Decide Execution Mode

**If 2+ truly independent tasks exist (no shared files, no data dependencies, no logical dependencies):**

- Load {parallelAgentsSkill} via Read tool
- Follow the skill's "When to Use" decision tree
- If skill confirms parallel dispatch is appropriate:
  - Set execution_mode = "parallel"
  - Group independent tasks into agent assignments
  - Note which tasks remain sequential (dependent ones)

**If all tasks are dependent, or only 1 task remains:**

- Set execution_mode = "sequential"
- Identify the next task to implement (first unchecked [ ] in order)

### 4. Communicate Decision

**For parallel mode:**
"**Task Analysis Complete**

**Independent tasks found:** {{independent_count}} tasks can run in parallel
**Dependent tasks:** {{dependent_count}} tasks will run sequentially after

**Parallel dispatch plan:**
- Agent 1: {{task_description_1}}
- Agent 2: {{task_description_2}}
[...]

**Proceeding to parallel implementation...**"

**For sequential mode:**
"**Task Analysis Complete**

**Execution mode:** Sequential
**Next task:** {{next_task_description}}

**Proceeding to implementation...**"

### 5. Pre-Implementation Architecture Review (gstack)

**IF {engReviewSkill} exists (gstack installed):**

Load {engReviewSkill} via Read tool and follow its directives to perform a pre-implementation review:

- **Scope Challenge:** Is there existing code that already solves sub-problems? Are we over-engineering?
- **Failure Scenarios:** For each new codepath, identify one realistic production failure
- **Test Coverage Map:** Map planned tasks to expected test coverage
- **Architecture Validation:** Verify component boundaries and data flow patterns

"**Pre-Implementation Review Complete**

**Scope:** {validated/reduced/expanded}
**Failure scenarios identified:** {count}
**Test coverage plan:** {summary}

**Proceeding to implementation...**"

**IF {engReviewSkill} does NOT exist (gstack not installed):**
Skip this section and proceed directly.

### 6. Auto-Proceed

Display: "**Proceeding to implementation...**"

#### Menu Handling Logic:

- After analysis complete, immediately load, read entire file, then execute {nextStepFile}
- Pass execution_mode (parallel/sequential) and task assignments to next step

#### EXECUTION RULES:

- This is an auto-proceed step with no user choices
- Proceed directly to next step after analysis

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- All remaining tasks identified and listed
- Independence analysis performed for each task pair
- Parallel agents skill loaded when parallel mode chosen
- Execution mode clearly decided and communicated
- Auto-proceeded to step-04

### FAILURE:

- Skipping independence analysis
- Dispatching parallel agents for dependent tasks
- Not loading parallel agents skill before dispatching
- Starting implementation in this step

**Master Rule:** Task independence MUST be verified. Assuming independence without analysis is SYSTEM FAILURE.
