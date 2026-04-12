---
name: 'step-02-test-plan'
description: 'Create comprehensive QA test specification document — enumerate every scenario, every edge case, every error path before testing begins'

nextStepFile: './step-03-execute-and-fix.md'
stateFile: '{output_folder}/qa-test-{date}.state.md'
qaTestSpecTemplate: '../data/qa-test-spec-template.md'
qaReportTemplate: '../data/qa-report-template.md'
parallel_agents_skill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
implementation_artifacts: '{config_source}:implementation_artifacts'
---

# Step 2: Create QA Test Specification

## STEP GOAL:

Produce a professional QA Test Specification document BEFORE any testing begins. This document is the single source of truth for the entire QA session — it lists every possible scenario, every edge case, every error path, every navigation flow, every regression check. Like a real QA spec sheet that a human tester would follow line by line.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 🤝 You facilitate DECISIONS (present options, wait for user choices). You execute TASKS autonomously within approved scope — spec generation IS an execution task.
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a tool you do not have access to, achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a senior QA engineer writing the test spec that junior testers will follow
- ✅ Every scenario must be concrete — specific inputs, specific clicks, specific expected outputs
- ✅ If a tester reads your spec and still wonders "but what if...?" — you missed a case
- ✅ You think about what the developer DIDN'T think about

### Step-Specific Rules:

- 🎯 Focus ONLY on creating the QA spec document — no browser testing yet
- 🚫 FORBIDDEN to open Chrome DevTools in this step
- 🧠 Think like a paranoid user: "what happens if I do THIS instead?"
- 📋 Every test case must have exact steps a machine can follow — no ambiguity
- 📄 The spec document is saved as a file — it persists beyond this session

## EXECUTION PROTOCOLS:

- 🎯 Read the FULL story document before writing a single test case
- 🔍 Read the actual source code for affected pages/components to understand implementation details
- 💾 Write spec to file progressively
- 🚫 This step produces the document — execution is step-03

## CONTEXT BOUNDARIES:

- State file has story list and current story index
- Story document contains ACs, tasks, and implementation context
- The spec must go far beyond the story — think about everything the user could possibly do

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Load Context

Read `{stateFile}` to get:
- Current story index and path
- App URL
- Prior learnings (if any)

Read the current story document COMPLETELY. Extract:
- All acceptance criteria (exact wording)
- All tasks and subtasks
- Referenced pages, components, routes
- Any noted edge cases or constraints
- Related stories or features mentioned

### 2. Read Implementation Code (Subagent Delegation)

The story describes INTENT, but the code reveals what's actually possible to test.

**IF `{parallel_agents_skill}` exists:** Load it via Read tool. Dispatch a subagent to read the source code for affected pages/components and return a compact JSON summary covering:
- Route definitions (URLs)
- Interactive elements (buttons, forms, links)
- Form validation rules
- API endpoints called
- Shared state affected

This keeps the parent context lean while capturing implementation details.

**IF subagents unavailable:** Read source code directly, focusing on route definitions and interactive elements. Avoid loading entire files — scan for the specific information needed.

### 3. Map All Affected Areas

Build a complete map of the blast radius:

**Direct impact:**
- Pages/routes this story adds or modifies
- Components created or changed
- API endpoints called

**Indirect impact:**
- Other pages that use the same components
- Features that depend on the same data/state
- Navigation paths that pass through affected pages
- Shared layouts, headers, sidebars that might shift

### 4. Create QA Test Specification Document

Read `{qaTestSpecTemplate}` for the document structure.

Create the spec file at:
`{implementation_artifacts}/qa/qa-spec-{story-or-epic-id}-{date}.md`

Fill every section systematically:

#### 4a. Test Scenarios (TS-NNN)

Group test cases by feature/page/flow. For EACH acceptance criterion, create a scenario group containing:

**Functional test cases (TC-NNN-NN):**
- The exact happy path described in the AC
- Variations of the happy path (different valid inputs, different user paths to same goal)

**Edge cases (TC-NNN-ENN):**
For every input field, every button, every interaction point — ask:
- What if the input is empty?
- What if the input is at minimum length? Maximum length?
- What if special characters are used? (`<script>`, emojis, Unicode, RTL text)
- What if the user double-clicks instead of single-click?
- What if the user clicks while data is still loading?
- What if the user pastes instead of typing?
- What if there are 0 items? 1 item? 1000 items?
- What if the user has no permissions for this action?
- What if the session expires mid-action?

**Error cases (TC-NNN-RNN):**
For every action that can fail:
- Invalid input → what error message appears? Where? Does it clear on retry?
- Server error → what does the user see? Can they retry?
- Network timeout → is there feedback? Does the UI recover?
- Validation failure → are all invalid fields highlighted? Is the message helpful?

#### 4b. Navigation & Flow Tests (NAV-NN)

For every page transition in the feature:
- Back button after completing an action — where does it go? Is state preserved?
- Back button mid-flow — what happens to unsaved data?
- Browser refresh at every distinct state — does the page recover correctly?
- Direct URL access to every route — does it work without navigating from the home page?
- Breadcrumb clicks — do they go to the right place?
- Opening the same page in a new tab — does it work independently?
- Browser forward button after going back — correct behavior?

#### 4c. Cross-Feature Regression Tests (REG-NN)

For every existing feature in the affected area:
- Does feature X still work exactly as before?
- Did the layout shift affect other elements?
- Do shared components still render correctly in OTHER pages?
- Does the global navigation still work?
- Do other forms/buttons on the same page still function?

#### 4d. Accessibility Tests (A11Y-NN)

- Keyboard navigation — can every interactive element be reached and activated via Tab/Enter/Space?
- Focus management — is focus visible? Does it move logically after actions?
- ARIA attributes — do dynamic elements have appropriate roles and labels?
- Color contrast — is text readable against its background?
- Screen reader — do images have alt text? Do forms have labels?

#### 4e. Responsive Tests (RSP-NN)

Use Chrome DevTools emulate capability to test at key viewports:
- Mobile (375px) — does the layout adapt? Are touch targets large enough?
- Tablet (768px) — does the layout use available space?
- Desktop (1280px) — is this the primary tested viewport?
- Overflow — does very long text or many items break the layout?

#### 4f. UI/Visual Tests (UI-NN)

- Layout integrity — no unexpected shifts, overlaps, or gaps
- Loading states — spinners/skeletons appear during data fetch
- Empty states — appropriate message when no data exists
- Console check — no new errors or warnings in DevTools console
- Network check — no failed API calls, no unexpected requests
- Performance — page loads within acceptable time, no heavy re-renders

### 5. Count and Summarize

Run `python3 {installed_path}/scripts/qa-spec-stats.py {spec-file-path}` to get accurate counts. Fill the Test Case Summary table at the end of the spec:

| Category | P0 | P1 | P2 | Total |
|----------|----|----|-----|-------|
| Functional | N | N | N | N |
| Edge Cases | N | N | N | N |
| Error Cases | N | N | N | N |
| Navigation | N | N | N | N |
| Regression | N | N | N | N |
| Accessibility | N | N | N | N |
| Responsive | N | N | N | N |
| UI/Visual | N | N | N | N |
| **Total** | **N** | **N** | **N** | **N** |

### 6. Present Spec to User

"**QA Test Specification created for: {story title}**
📄 Spec saved: `{spec-file-path}`

**{total} test cases across {scenario-group-count} scenario groups:**

| Category | P0 | P1 | P2 | Total |
|----------|----|----|-----|-------|
[summary table]

**Scenario groups:**
1. TS-001: {name} — {N} cases
2. TS-002: {name} — {N} cases
...
+ Navigation: {N} cases
+ Regression: {N} cases
+ UI/Visual: {N} cases

**Review the spec and let me know:**
- **[Y]** Approve — start testing
- **[+]** Add more cases — tell me what scenarios to add
- **[-]** Remove cases — tell me which ones to skip
- **[M]** Modify — tell me what to change"

**HALT and wait for user response.**

- If user adds/modifies/removes: update spec document and re-display summary
- If user approves: proceed

### 7. Initialize QA Report

Also read `{qaReportTemplate}` and create the execution report file at:
`{implementation_artifacts}/qa/qa-report-{story-or-epic-id}-{date}.md`

This report will be filled progressively during step-03 as tests are executed. Link it to the spec document.

### 8. Update State File

Run:
```bash
uv run {installed_path}/scripts/qa-state.py update --state-file "{stateFile}" \
  --updates '{"addStep":"step-02-test-plan","qaSpecPath":"{spec-file-path}","qaReportPath":"{report-file-path}","logEntry":"Test plan created with {N} test cases"}'
```

### 9. Auto-Proceed to Next Step

After user approves the spec, immediately load, read entire file, then execute `{nextStepFile}` to begin browser testing.

---

## SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Story document AND implementation code both read
- Blast radius mapped (direct + indirect impact)
- QA spec document created as a file with the template structure
- Every AC has corresponding functional, edge, AND error test cases
- Navigation tests cover back/refresh/direct-URL for every page transition
- Regression tests cover every existing feature in the affected area
- Accessibility tests cover keyboard nav, focus, ARIA, contrast
- Responsive tests cover mobile/tablet/desktop viewports
- Each test case has exact steps (specific clicks, specific inputs, specific expected outcomes)
- No vague test cases — a machine could execute every case without asking clarification
- User reviewed and approved the spec
- QA report file initialized for execution tracking

### ❌ SYSTEM FAILURE:

- Opening the browser in this step
- Generating only happy-path tests
- Missing ACs without corresponding test cases
- Vague steps ("check if it works", "verify the page", "ensure correct behavior")
- Not reading the implementation code
- Not considering existing feature regression
- Not creating the spec as a persistent file
- Not waiting for user approval
