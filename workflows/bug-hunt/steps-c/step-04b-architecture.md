---
name: 'step-04b-architecture'
description: 'Architecture review after 3+ hypothesis failures - document findings and reset approach'

restartStepFile: './step-02-code-analysis.md'
stateFile: '{output_folder}/bug-hunt-{date}.state.md'
---

# Step 4b: Architecture Review

## STEP GOAL:

To critically review whether the architectural approach is fundamentally flawed, document all findings and failed attempts, establish a new direction, and restart the investigation with fresh perspective.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a systematic debugging partner questioning fundamentals
- ✅ 3+ fixes failed - this is NOT a failed hypothesis, it's a wrong architecture
- ✅ Be honest: is this pattern fundamentally sound?
- ✅ This is a collaborative discussion, not a unilateral decision

### Step-Specific Rules:

- 🎯 Focus on questioning ARCHITECTURE, not finding another fix
- 🚫 FORBIDDEN to propose "just one more fix attempt"
- 💬 Document everything before resetting
- 📝 This documentation is critical for the record

## EXECUTION PROTOCOLS:

- 🎯 Review all failed attempts systematically
- 💾 Document architecture review in state file AND story/bug report
- 📖 Reset escalation level for fresh restart
- 🚫 Must document before proceeding

## CONTEXT BOUNDARIES:

- 3+ hypotheses have failed across all escalation levels
- All previous evidence is in state file
- User must be involved in architecture discussion
- Documentation goes to story file or bug report (not just state)

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Load All Evidence

Read `{stateFile}` completely. Gather:
- All failed hypotheses with their evidence
- All escalation levels tried
- All findings from code analysis, debug logs, web search
- Debug logs currently in code

### 2. Present Failed Attempts Summary

"**Architecture review is needed.**

**Attempted hypotheses:**
1. [Level 1] [hypothesis] → Failed: [reason]
2. [Level 2] [hypothesis] → Failed: [reason]
3. [Level 3] [hypothesis] → Failed: [reason]

**Pattern analysis:**
- Are new problems appearing in different places each time?
- Is it getting more complex with each fix attempt?
- Does it look like a large-scale refactoring is needed?"

### 3. Question Architecture (Collaborative)

"**Fundamental questions:**

1. **Is this pattern fundamentally correct?**
   [analysis]

2. **Are we sticking with this approach out of inertia?**
   [honest assessment]

3. **Refactoring vs. continued fixing - which is more efficient?**
   [comparison]

4. **Is there a completely different approach?**
   [alternative proposal]

What do you think?"

**Wait for user input. This is a critical discussion point.**

### 4. Establish New Direction

Based on discussion:

"**New direction:**
- [agreed-upon approach]
- [specifically what will be done differently]
- [lessons learned from previous attempts]"

**Wait for user confirmation.**

### 5. Document Architecture Review

**Write to story file or bug report** (from documentationTarget in state):

```markdown
## Architecture Review [{date}]

### Failed Hypotheses
1. [Level 1] [hypothesis] → [result, reason]
2. [Level 2] [hypothesis] → [result, reason]
3. [Level 3] [hypothesis] → [result, reason]

### Discovered Architecture Issues
[issue description]

### Reset Direction
[new approach]

### Lessons Learned from Previous Attempts
[lessons]
```

### 6. Update State File

Update `{stateFile}`:
```yaml
lastEscalationLevel: 0  # Reset for fresh start
```

Add to `architectureReviews`:
```yaml
- date: '{date}'
  failedHypotheses: [list]
  architectureIssue: '[discovered issue]'
  newDirection: '[new direction]'
```

Update `stepsCompleted` to include `step-04b-architecture`.

Append to Investigation Log.

### 7. Present MENU OPTIONS

Display: "**Architecture review complete! Documented. Restarting from Level 1 (code analysis) with new direction.**

**Select:** [C] Continue - Restart from Step 02"

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- C restarts the investigation from Level 1 with new direction

#### Menu Handling Logic:

- IF C: Update state file, then load, read entire file, then execute {restartStepFile}
- IF Any other: help user, then redisplay menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All failed attempts reviewed and summarized
- Architecture questioned honestly
- New direction established collaboratively
- DOCUMENTED in story file or bug report (not just state!)
- Escalation level reset
- Ready for fresh investigation

### ❌ SYSTEM FAILURE:

- Proposing "just one more fix" instead of reviewing architecture
- Not documenting in story/bug report
- Skipping the collaborative discussion
- Not resetting escalation level

**Master Rule:** 3+ failures means architecture problem. Document, reset, restart. Do NOT try fix #4 without this step.
