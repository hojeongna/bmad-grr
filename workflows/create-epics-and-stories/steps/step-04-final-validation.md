# Step 4: Final Validation

## STEP GOAL:

To validate complete coverage of all requirements and ensure stories are ready for development.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: Process validation sequentially without skipping
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a product strategist and technical specifications writer
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring validation expertise and quality assurance
- ✅ User brings their implementation priorities and final review

### Step-Specific Rules:

- 🎯 Focus ONLY on validating complete requirements coverage
- 🚫 FORBIDDEN to skip any validation checks
- 💬 Validate FR coverage, story completeness, and dependencies
- 🚪 ENSURE all stories are ready for development

## EXECUTION PROTOCOLS:

- 🎯 Validate every requirement has story coverage
- 💾 Check story dependencies and flow
- 📖 Verify architecture compliance
- 🚫 FORBIDDEN to approve incomplete coverage

## gstack Skills Integration (REQUIRED — grr-enhanced)

> **Final multi-lens validation** — the complete epics/stories breakdown gets pressure-tested through 4 independent review lenses before being marked ready for development.

**IF `{autoplan_skill}` exists (gstack installed):** Load the FULL file via Read tool. Internalize its 4-way review pipeline — CEO, design, eng, DX.

Apply the autoplan pipeline to the COMPLETE epics.md document:

**🎯 CEO Review pass**
- Do the epics collectively serve the PRD's actual premise?
- Is every epic earning its weight (meaningful value)?
- Is the epic order logical for delivering value incrementally?
- Are there epics that could be combined or cut?

**🎨 Design Review pass** (if applicable — user-facing systems)
- Does the story breakdown preserve UX coherence across epics?
- Are there UI stories without empty/error/loading states defined?
- Is accessibility addressed in UI stories?

**🔧 Eng Review pass**
- Is every story implementable with the chosen architecture?
- Are cross-story dependencies explicit and acyclic?
- Are there hidden technical debts introduced by the breakdown?
- Is test coverage planned at the story level?

**🛠️ DX Review pass** (if applicable — API/SDK/dev tool products)
- Are DX stories (docs, CLI, error messages, onboarding) included?
- Is there a golden path for developers?

**IF `{learn_skill}` exists:** After validation, save significant insights about epic sizing, breakdown patterns, and common pitfalls as `pattern`-type learnings so future projects can benefit.

**IF `{cso_skill}` exists:** Final security review — verify that security-affected epics have dedicated threat modeling stories.

**Present findings per-review separately** — do NOT merge. Keep reviews clearly labeled (🎯 CEO / 🎨 Design / 🔧 Eng / 🛠️ DX / 🔐 Security) so the user can address each perspective independently.

**IF `{autoplan_skill}` is missing but individual review skills are installed:** Run each plan-*-review individually.

**IF none of these skills exist:** Warn clearly and proceed with standard validation:

> ⚠️ `gstack/autoplan` and individual review skills not installed — final multi-lens validation will be skipped. Install gstack for comprehensive review.

## CONTEXT BOUNDARIES:

- Available context: Complete epic and story breakdown from previous steps
- Focus: Final validation of requirements coverage and story readiness
- Limits: Validation only, no new content creation
- Dependencies: Completed story generation from Step 3

## VALIDATION PROCESS:

### 1. FR Coverage Validation

Review the complete epic and story breakdown to ensure EVERY FR is covered:

**CRITICAL CHECK:**

- Go through each FR from the Requirements Inventory
- Verify it appears in at least one story
- Check that acceptance criteria fully address the FR
- No FRs should be left uncovered

### 2. Architecture Implementation Validation

**Check for Starter Template Setup:**

- Does Architecture document specify a starter template?
- If YES: Epic 1 Story 1 must be "Set up initial project from starter template"
- This includes cloning, installing dependencies, initial configuration

**Database/Entity Creation Validation:**

- Are database tables/entities created ONLY when needed by stories?
- ❌ WRONG: Epic 1 creates all tables upfront
- ✅ RIGHT: Tables created as part of the first story that needs them
- Each story should create/modify ONLY what it needs

### 3. Story Quality Validation

**Each story must:**

- Be completable by a single dev agent
- Have clear acceptance criteria
- Reference specific FRs it implements
- Include necessary technical details
- **Not have forward dependencies** (can only depend on PREVIOUS stories)
- Be implementable without waiting for future stories

### 4. Epic Structure Validation

**Check that:**

- Epics deliver user value, not technical milestones
- Dependencies flow naturally
- Foundation stories only setup what's needed
- No big upfront technical work

### 5. Dependency Validation (CRITICAL)

**Epic Independence Check:**

- Does each epic deliver COMPLETE functionality for its domain?
- Can Epic 2 function without Epic 3 being implemented?
- Can Epic 3 function standalone using Epic 1 & 2 outputs?
- ❌ WRONG: Epic 2 requires Epic 3 features to work
- ✅ RIGHT: Each epic is independently valuable

**Within-Epic Story Dependency Check:**
For each epic, review stories in order:

- Can Story N.1 be completed without Stories N.2, N.3, etc.?
- Can Story N.2 be completed using only Story N.1 output?
- Can Story N.3 be completed using only Stories N.1 & N.2 outputs?
- ❌ WRONG: "This story depends on a future story"
- ❌ WRONG: Story references features not yet implemented
- ✅ RIGHT: Each story builds only on previous stories

### 6. Complete and Save

If all validations pass:

- Update any remaining placeholders in the document
- Ensure proper formatting
- Save the final epics.md

**Present Final Menu:**
**All validations complete!** [C] Complete Workflow

HALT — wait for user input before proceeding.

When C is selected, the workflow is complete and the epics.md is ready for development.

Epics and Stories complete. Invoke the `bmad-help` skill.

Upon Completion of task output: offer to answer any questions about the Epics and Stories.
