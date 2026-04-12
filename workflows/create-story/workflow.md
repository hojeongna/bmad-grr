---
name: create-story
description: 'Create a comprehensive story file that gives the dev agent everything needed for flawless implementation. grr-enhanced fork of bmad-create-story — preserves original XML workflow + all BMad guardrails, adds gstack integration: learn for past story intelligence, dispatching-parallel-agents for parallel artifact analysis, plan-eng-review for architecture compliance, cso for security stories, test-driven-development for testing standards, plan-design-review for UI stories, systematic-debugging for fix stories.'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
main_config: '{project-root}/_bmad/bmm/config.yaml'
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
user_skill_level: "{config_source}:user_skill_level"
planning_artifacts: "{config_source}:planning_artifacts"
implementation_artifacts: "{config_source}:implementation_artifacts"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/create-story"
project_context: "**/project-context.md"

# REQUIRED gstack skills (FULL load when installed — applied via LLM judgment at each step)
learn_skill: '~/.claude/skills/gstack/learn/SKILL.md'
eng_review_skill: '~/.claude/skills/gstack/plan-eng-review/SKILL.md'

# REQUIRED superpowers skills (bundled with bmad-grr)
parallel_agents_skill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
tdd_skill: '~/.claude/skills/test-driven-development/SKILL.md'
systematic_debugging_skill: '~/.claude/skills/systematic-debugging/SKILL.md'

# CONDITIONAL gstack skills (LLM judgment — loaded when story content matches domain)
cso_skill: '~/.claude/skills/gstack/cso/SKILL.md'                          # security-sensitive stories
design_review_skill: '~/.claude/skills/gstack/plan-design-review/SKILL.md' # UI stories
devex_review_skill: '~/.claude/skills/gstack/plan-devex-review/SKILL.md'   # DX stories
investigate_skill: '~/.claude/skills/gstack/investigate/SKILL.md'          # fix/debug stories
health_skill: '~/.claude/skills/gstack/health/SKILL.md'                    # touched module health
---

# Create Story Workflow (grr-enhanced)

**Goal:** Create a comprehensive story file that gives the dev agent everything needed for flawless implementation, enriched with gstack skills for past learnings, parallel artifact analysis, architecture compliance, TDD-aware testing, and domain-specific reviews.

## gstack Skills Integration (grr-enhanced)

This workflow integrates gstack + superpowers skills at 3 key XML `<step>` positions:

- **Step 2 (Load artifacts)**: `learn` (past story intelligence) + `dispatching-parallel-agents` (parallel artifact analysis)
- **Step 3 (Architecture analysis)**: `plan-eng-review` (architecture compliance) + `cso` (if security-sensitive) + `learn` (architecture learnings)
- **Step 5 (Create story file)**: `test-driven-development` (testing standards) + `plan-design-review` (if UI story) + `plan-devex-review` (if DX story) + `systematic-debugging` (if fix story)

Each skill load follows the External Skill Loading Protocol:

1. Use Read tool to load the FULL skill file — no offset, no limit
2. Internalize the skill's framework, voice, decision patterns
3. Apply the skill's directives within the step's scope
4. **IF skill is missing**: Warn clearly ("⚠️ `{skill_name}` not installed — reduced quality for {purpose}") and continue gracefully
5. **CONDITIONAL skills**: Use LLM judgment based on actual story content, cite specific reasoning (NOT keyword matching)

**Your Role:** Story context engine that prevents LLM developer mistakes, omissions, or disasters.
- Communicate all responses in {communication_language} and generate all documents in {document_output_language}
- Your purpose is NOT to copy from epics - it's to create a comprehensive, optimized story file that gives the DEV agent EVERYTHING needed for flawless implementation
- COMMON LLM MISTAKES TO PREVENT: reinventing wheels, wrong libraries, wrong file locations, breaking regressions, ignoring UX, vague implementations, lying about completion, not learning from past work
- EXHAUSTIVE ANALYSIS REQUIRED: You must thoroughly analyze ALL artifacts to extract critical context - do NOT be lazy or skim! This is the most important function in the entire development process!
- UTILIZE SUBPROCESSES AND SUBAGENTS: Use research subagents, subprocesses or parallel processing if available to thoroughly analyze different artifacts simultaneously and thoroughly
- SAVE QUESTIONS: If you think of questions or clarifications during analysis, save them for the end after the complete story is written
- ZERO USER INTERVENTION: Process should be fully automated except for initial epic/story selection or missing documents

---

## INITIALIZATION

### Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `user_name`
- `communication_language`, `document_output_language`
- `user_skill_level`
- `planning_artifacts`, `implementation_artifacts`
- `date` as system-generated current datetime

### Paths

- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
- `epics_file` = `{planning_artifacts}/epics.md`
- `prd_file` = `{planning_artifacts}/prd.md`
- `architecture_file` = `{planning_artifacts}/architecture.md`
- `ux_file` = `{planning_artifacts}/*ux*.md`
- `story_title` = "" (will be elicited if not derivable)
- `project_context` = `**/project-context.md` (load if exists)
- `default_output_file` = `{implementation_artifacts}/{{story_key}}.md`

### Input Files

| Input | Description | Path Pattern(s) | Load Strategy |
|-------|-------------|------------------|---------------|
| prd | PRD (fallback - epics file should have most content) | whole: `{planning_artifacts}/*prd*.md`, sharded: `{planning_artifacts}/*prd*/*.md` | SELECTIVE_LOAD |
| architecture | Architecture (fallback - epics file should have relevant sections) | whole: `{planning_artifacts}/*architecture*.md`, sharded: `{planning_artifacts}/*architecture*/*.md` | SELECTIVE_LOAD |
| ux | UX design (fallback - epics file should have relevant sections) | whole: `{planning_artifacts}/*ux*.md`, sharded: `{planning_artifacts}/*ux*/*.md` | SELECTIVE_LOAD |
| epics | Enhanced epics+stories file with BDD and source hints | whole: `{planning_artifacts}/*epic*.md`, sharded: `{planning_artifacts}/*epic*/*.md` | SELECTIVE_LOAD |

---

## EXECUTION

<workflow>

<step n="1" goal="Determine target story">
  <check if="{{story_path}} is provided by user or user provided the epic and story number such as 2-4 or 1.6 or epic 1 story 5">
    <action>Parse user-provided story path: extract epic_num, story_num, story_title from format like "1-2-user-auth"</action>
    <action>Set {{epic_num}}, {{story_num}}, {{story_key}} from user input</action>
    <action>GOTO step 2a</action>
  </check>

  <action>Check if {{sprint_status}} file exists for auto discover</action>
  <check if="sprint status file does NOT exist">
    <output>🚫 No sprint status file found and no story specified</output>
    <output>
      **Required Options:**
      1. Run `sprint-planning` to initialize sprint tracking (recommended)
      2. Provide specific epic-story number to create (e.g., "1-2-user-auth")
      3. Provide path to story documents if sprint status doesn't exist yet
    </output>
    <ask>Choose option [1], provide epic-story number, path to story docs, or [q] to quit:</ask>

    <check if="user chooses 'q'">
      <action>HALT - No work needed</action>
    </check>

    <check if="user chooses '1'">
      <output>Run sprint-planning workflow first to create sprint-status.yaml</output>
      <action>HALT - User needs to run sprint-planning</action>
    </check>

    <check if="user provides epic-story number">
      <action>Parse user input: extract epic_num, story_num, story_title</action>
      <action>Set {{epic_num}}, {{story_num}}, {{story_key}} from user input</action>
      <action>GOTO step 2a</action>
    </check>

    <check if="user provides story docs path">
      <action>Use user-provided path for story documents</action>
      <action>GOTO step 2a</action>
    </check>
  </check>

  <!-- Auto-discover from sprint status only if no user input -->
  <check if="no user input provided">
    <critical>MUST read COMPLETE {sprint_status} file from start to end to preserve order</critical>
    <action>Load the FULL file: {{sprint_status}}</action>
    <action>Read ALL lines from beginning to end - do not skip any content</action>
    <action>Parse the development_status section completely</action>

    <action>Find the FIRST story (by reading in order from top to bottom) where:
      - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
      - NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
      - Status value equals "backlog"
    </action>

    <check if="no backlog story found">
      <output>📋 No backlog stories found in sprint-status.yaml

        All stories are either already created, in progress, or done.

        **Options:**
        1. Run sprint-planning to refresh story tracking
        2. Load PM agent and run correct-course to add more stories
        3. Check if current sprint is complete and run retrospective
      </output>
      <action>HALT</action>
    </check>

    <action>Extract from found story key (e.g., "1-2-user-authentication"):
      - epic_num: first number before dash (e.g., "1")
      - story_num: second number after first dash (e.g., "2")
      - story_title: remainder after second dash (e.g., "user-authentication")
    </action>
    <action>Set {{story_id}} = "{{epic_num}}.{{story_num}}"</action>
    <action>Store story_key for later use (e.g., "1-2-user-authentication")</action>

    <!-- Mark epic as in-progress if this is first story -->
    <action>Check if this is the first story in epic {{epic_num}} by looking for {{epic_num}}-1-* pattern</action>
    <check if="this is first story in epic {{epic_num}}">
      <action>Load {{sprint_status}} and check epic-{{epic_num}} status</action>
      <action>If epic status is "backlog" → update to "in-progress"</action>
      <action>If epic status is "contexted" (legacy status) → update to "in-progress" (backward compatibility)</action>
      <action>If epic status is "in-progress" → no change needed</action>
      <check if="epic status is 'done'">
        <output>🚫 ERROR: Cannot create story in completed epic</output>
        <output>Epic {{epic_num}} is marked as 'done'. All stories are complete.</output>
        <output>If you need to add more work, either:</output>
        <output>1. Manually change epic status back to 'in-progress' in sprint-status.yaml</output>
        <output>2. Create a new epic for additional work</output>
        <action>HALT - Cannot proceed</action>
      </check>
      <check if="epic status is not one of: backlog, contexted, in-progress, done">
        <output>🚫 ERROR: Invalid epic status '{{epic_status}}'</output>
        <output>Epic {{epic_num}} has invalid status. Expected: backlog, in-progress, or done</output>
        <output>Please fix sprint-status.yaml manually or run sprint-planning to regenerate</output>
        <action>HALT - Cannot proceed</action>
      </check>
      <output>📊 Epic {{epic_num}} status updated to in-progress</output>
    </check>

    <action>GOTO step 2a</action>
  </check>
  <action>Load the FULL file: {{sprint_status}}</action>
  <action>Read ALL lines from beginning to end - do not skip any content</action>
  <action>Parse the development_status section completely</action>

  <action>Find the FIRST story (by reading in order from top to bottom) where:
    - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
    - NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
    - Status value equals "backlog"
  </action>

  <check if="no backlog story found">
    <output>No backlog stories found in sprint-status.yaml

      All stories are either already created, in progress, or done.

      **Options:**
      1. Run sprint-planning to refresh story tracking
      2. Load PM agent and run correct-course to add more stories
      3. Check if current sprint is complete and run retrospective
    </output>
    <action>HALT</action>
  </check>

  <action>Extract from found story key (e.g., "1-2-user-authentication"):
    - epic_num: first number before dash (e.g., "1")
    - story_num: second number after first dash (e.g., "2")
    - story_title: remainder after second dash (e.g., "user-authentication")
  </action>
  <action>Set {{story_id}} = "{{epic_num}}.{{story_num}}"</action>
  <action>Store story_key for later use (e.g., "1-2-user-authentication")</action>

  <!-- Mark epic as in-progress if this is first story -->
  <action>Check if this is the first story in epic {{epic_num}} by looking for {{epic_num}}-1-* pattern</action>
  <check if="this is first story in epic {{epic_num}}">
    <action>Load {{sprint_status}} and check epic-{{epic_num}} status</action>
    <action>If epic status is "backlog" → update to "in-progress"</action>
    <action>If epic status is "contexted" (legacy status) → update to "in-progress" (backward compatibility)</action>
    <action>If epic status is "in-progress" → no change needed</action>
    <check if="epic status is 'done'">
      <output>ERROR: Cannot create story in completed epic</output>
      <output>Epic {{epic_num}} is marked as 'done'. All stories are complete.</output>
      <output>If you need to add more work, either:</output>
      <output>1. Manually change epic status back to 'in-progress' in sprint-status.yaml</output>
      <output>2. Create a new epic for additional work</output>
      <action>HALT - Cannot proceed</action>
    </check>
    <check if="epic status is not one of: backlog, contexted, in-progress, done">
      <output>ERROR: Invalid epic status '{{epic_status}}'</output>
      <output>Epic {{epic_num}} has invalid status. Expected: backlog, in-progress, or done</output>
      <output>Please fix sprint-status.yaml manually or run sprint-planning to regenerate</output>
      <action>HALT - Cannot proceed</action>
    </check>
    <output>Epic {{epic_num}} status updated to in-progress</output>
  </check>

  <action>GOTO step 2a</action>
</step>

<step n="2" goal="Load and analyze core artifacts">
  <critical>🔬 EXHAUSTIVE ARTIFACT ANALYSIS - This is where you prevent future developer mistakes!</critical>

  <!-- grr-enhanced: Load REQUIRED gstack skills BEFORE artifact analysis -->
  <action>**gstack learn integration**: IF `{learn_skill}` exists (gstack installed), load the FULL file via Read tool. Query past story learnings using keywords from the target story's `{epic_num}-{story_num}-{story_title}` and its domain (e.g., 'auth', 'payment', 'ui', 'api'). Focus on entries of type `architecture`, `pattern`, `pitfall`, `preference`. Capture as `prior_learnings` — these WILL be injected into the story's Dev Notes section later. If missing, warn: "⚠️ `gstack/learn` not installed — past story intelligence will not be available. Install gstack to enable."</action>

  <action>**superpowers parallel-agents integration**: IF `{parallel_agents_skill}` exists (bundled with bmad-grr), load the FULL file via Read tool. Internalize its parallel dispatch pattern. When Section 2 below instructs to analyze multiple artifacts (PRD, architecture, UX, epics, previous story), **dispatch parallel sub-agents** — one per artifact — for exhaustive parallel analysis. This makes artifact loading dramatically faster. Each sub-agent returns structured findings that the main thread aggregates. If missing, fall back to sequential analysis.</action>

  <!-- Load all available content through discovery protocol -->
  <action>Read fully and follow `./discover-inputs.md` to load all input files</action>
  <note>Available content: {epics_content}, {prd_content}, {architecture_content}, {ux_content},
  {project_context}</note>

  <!-- Analyze epics file for story foundation -->
  <action>From {epics_content}, extract Epic {{epic_num}} complete context:</action> **EPIC ANALYSIS:** - Epic
  objectives and business value - ALL stories in this epic for cross-story context - Our specific story's requirements, user story
  statement, acceptance criteria - Technical requirements and constraints - Dependencies on other stories/epics - Source hints pointing to
  original documents <!-- Extract specific story requirements -->
  <action>Extract our story ({{epic_num}}-{{story_num}}) details:</action> **STORY FOUNDATION:** - User story statement
  (As a, I want, so that) - Detailed acceptance criteria (already BDD formatted) - Technical requirements specific to this story -
  Business context and value - Success criteria <!-- Previous story analysis for context continuity -->
  <check if="story_num > 1">
    <action>Find {{previous_story_num}}: scan {implementation_artifacts} for the story file in epic {{epic_num}} with the highest story number less than {{story_num}}</action>
    <action>Load previous story file: {implementation_artifacts}/{{epic_num}}-{{previous_story_num}}-*.md</action> **PREVIOUS STORY INTELLIGENCE:** -
  Dev notes and learnings from previous story - Review feedback and corrections needed - Files that were created/modified and their
  patterns - Testing approaches that worked/didn't work - Problems encountered and solutions found - Code patterns established <action>Extract
  all learnings that could impact current story implementation</action>
  </check>

  <!-- Git intelligence for previous work patterns -->
  <check
    if="previous story exists AND git repository detected">
    <action>Get last 5 commit titles to understand recent work patterns</action>
    <action>Analyze 1-5 most recent commits for relevance to current story:
      - Files created/modified
      - Code patterns and conventions used
      - Library dependencies added/changed
      - Architecture decisions implemented
      - Testing approaches used
    </action>
    <action>Extract actionable insights for current story implementation</action>
  </check>
</step>

<step n="3" goal="Architecture analysis for developer guardrails">
  <critical>🏗️ ARCHITECTURE INTELLIGENCE - Extract everything the developer MUST follow!</critical>

  <!-- grr-enhanced: Load plan-eng-review + cso (conditional) before architecture extraction -->
  <action>**gstack plan-eng-review integration**: IF `{eng_review_skill}` exists (gstack installed), load the FULL file via Read tool. Internalize its Architecture review framework, Scope Challenge, Failure modes catalog, and Prior Learnings integration. Apply its lens when extracting architecture requirements in Section 2 below — cross-check that every extracted requirement has a clear technical approach, failure mode, and test strategy. Flag any architectural decisions in the current story that contradict the project's architecture.md. If missing, warn: "⚠️ `gstack/plan-eng-review` not installed — architecture analysis will proceed without structured framework." and continue.</action>

  <action>**gstack cso integration (CONDITIONAL)**: Read the target story's requirements and Dev Notes. IF the story touches authentication, authorization, secrets, data handling, network boundaries, user input, LLM trust boundaries, or any security-sensitive area — load `{cso_skill}` in FULL via Read tool. Apply its Chief Security Officer framework (OWASP Top 10, STRIDE, supply chain, LLM security) to extract security requirements that the developer MUST follow. Add these to the story's technical requirements. Cite the specific story content that triggered this (e.g., "AC #3 mentions JWT token refresh — loading cso for auth security framework"). If skill missing but security-relevant, warn clearly.</action>

  <action>**gstack learn architecture integration**: IF `{learn_skill}` was loaded in Step 2 and `prior_learnings` has `architecture`-type entries, cross-reference them with this story's architectural requirements. Surface any past architectural decisions that bind this story (e.g., "Team always uses Repository pattern for DB access — see learning `repository-pattern-always-used`"). These will appear in the story's Dev Notes as "Prior Architectural Learnings".</action>

  **ARCHITECTURE DOCUMENT ANALYSIS:** <action>Systematically
  analyze architecture content for story-relevant requirements:</action>

  <!-- Load architecture - single file or sharded -->
  <check if="architecture file is single file">
    <action>Load complete {architecture_content}</action>
  </check>
  <check if="architecture is sharded to folder">
    <action>Load architecture index and scan all architecture files</action>
  </check> **CRITICAL ARCHITECTURE EXTRACTION:** <action>For
  each architecture section, determine if relevant to this story:</action> - **Technical Stack:** Languages, frameworks, libraries with
  versions - **Code Structure:** Folder organization, naming conventions, file patterns - **API Patterns:** Service structure, endpoint
  patterns, data contracts - **Database Schemas:** Tables, relationships, constraints relevant to story - **Security Requirements:**
  Authentication patterns, authorization rules - **Performance Requirements:** Caching strategies, optimization patterns - **Testing
  Standards:** Testing frameworks, coverage expectations, test patterns - **Deployment Patterns:** Environment configurations, build
  processes - **Integration Patterns:** External service integrations, data flows <action>Extract any story-specific requirements that the
  developer MUST follow</action>
  <action>Identify any architectural decisions that override previous patterns</action>
</step>

<step n="4" goal="Web research for latest technical specifics">
  <critical>🌐 ENSURE LATEST TECH KNOWLEDGE - Prevent outdated implementations!</critical> **WEB INTELLIGENCE:** <action>Identify specific
  technical areas that require latest version knowledge:</action>

  <!-- Check for libraries/frameworks mentioned in architecture -->
  <action>From architecture analysis, identify specific libraries, APIs, or
  frameworks</action>
  <action>For each critical technology, research latest stable version and key changes:
    - Latest API documentation and breaking changes
    - Security vulnerabilities or updates
    - Performance improvements or deprecations
    - Best practices for current version
  </action>
  **EXTERNAL CONTEXT INCLUSION:** <action>Include in story any critical latest information the developer needs:
    - Specific library versions and why chosen
    - API endpoints with parameters and authentication
    - Recent security patches or considerations
    - Performance optimization techniques
    - Migration considerations if upgrading
  </action>
</step>

<step n="5" goal="Create comprehensive story file">
  <critical>📝 CREATE ULTIMATE STORY FILE - The developer's master implementation guide!</critical>

  <!-- grr-enhanced: Load REQUIRED + CONDITIONAL skills for story enrichment -->
  <action>**superpowers test-driven-development integration (REQUIRED)**: Load `{tdd_skill}` in FULL via Read tool. Internalize its RED-GREEN-REFACTOR cycle and testing anti-patterns guide. When writing the story's Testing Requirements section below, apply TDD principles: every function in Tasks/Subtasks must have a planned failing test first, anti-patterns (mocking real code, test-only methods, behavior testing) must be explicitly avoided. Add "TDD sequence" to the testing section. If missing, warn clearly.</action>

  <action>**gstack plan-design-review integration (CONDITIONAL — UI story)**: IF the current story touches user-facing UI (components, pages, interactions, forms, animations, visual elements), load `{design_review_skill}` in FULL via Read tool. Apply its design-review framework to enrich the story with UX Considerations: empty states, loading states, error states, responsive breakpoints, accessibility (keyboard, screen reader, contrast), motion/feedback, micro-copy. Add a "UX Considerations" subsection to Dev Notes. Cite specific story content that triggered this (e.g., "Tasks include `ProfileCard.tsx` — UI component, loading design-review").</action>

  <action>**gstack plan-devex-review integration (CONDITIONAL — DX story)**: IF the current story touches developer-facing surfaces (CLI, API, SDK, dev tools, error messages, docs, onboarding), load `{devex_review_skill}` in FULL via Read tool. Apply its framework to enrich the story with DX Considerations: friction points, golden path, error message quality, debugging support, local development ergonomics. Add a "DX Considerations" subsection to Dev Notes.</action>

  <action>**gstack cso integration (CONDITIONAL — security story)**: IF loaded in Step 3, apply its framework once more here to ensure every security requirement has explicit acceptance criteria in the story. Security ACs must be testable (e.g., "Given invalid JWT, When accessing /api/me, Then return 401 with no user data leakage").</action>

  <action>**superpowers systematic-debugging integration (CONDITIONAL — fix/bug story)**: IF the story is a bug fix or regression story, load `{systematic_debugging_skill}` in FULL via Read tool. Apply its 4-phase framework (investigate, analyze, hypothesize, implement) to enrich the story's Dev Notes with root cause hypothesis — the developer should know WHY this bug exists, not just HOW to fix it. If the root cause is unclear, document hypothesis and disproof criteria. Add a "Root Cause Analysis" subsection.</action>

  <action>**gstack learn save (at end of Step 6)**: After the story is fully written and saved in Step 6, if `{learn_skill}` exists, save 1-3 distinct learnings about story creation patterns encountered here (type `pattern`, source `create-story`). Bar: "Would knowing this save 5+ minutes in a future story?"</action>

  <action>Initialize from template.md:
  {default_output_file}</action>
  <template-output file="{default_output_file}">story_header</template-output>

  <!-- Story foundation from epics analysis -->
  <template-output
    file="{default_output_file}">story_requirements</template-output>

  <!-- Developer context section - MOST IMPORTANT PART -->
  <template-output file="{default_output_file}">
  developer_context_section</template-output> **DEV AGENT GUARDRAILS:** <template-output file="{default_output_file}">
  technical_requirements</template-output>
  <template-output file="{default_output_file}">architecture_compliance</template-output>
  <template-output
    file="{default_output_file}">library_framework_requirements</template-output>
  <template-output file="{default_output_file}">
  file_structure_requirements</template-output>
  <template-output file="{default_output_file}">testing_requirements</template-output>

  <!-- Previous story intelligence -->
  <check
    if="previous story learnings available">
    <template-output file="{default_output_file}">previous_story_intelligence</template-output>
  </check>

  <!-- Git intelligence -->
  <check
    if="git analysis completed">
    <template-output file="{default_output_file}">git_intelligence_summary</template-output>
  </check>

  <!-- Latest technical specifics -->
  <check if="web research completed">
    <template-output file="{default_output_file}">latest_tech_information</template-output>
  </check>

  <!-- Project context reference -->
  <template-output
    file="{default_output_file}">project_context_reference</template-output>

  <!-- Final status update -->
  <template-output file="{default_output_file}">
  story_completion_status</template-output>

  <!-- CRITICAL: Set status to ready-for-dev -->
  <action>Set story Status to: "ready-for-dev"</action>
  <action>Add completion note: "Ultimate
  context engine analysis completed - comprehensive developer guide created"</action>
</step>

<step n="6" goal="Update sprint status and finalize">
  <action>Validate the newly created story file {default_output_file} against `./checklist.md` and apply any required fixes before finalizing</action>
  <action>Save story document unconditionally</action>

  <!-- Update sprint status -->
  <check if="sprint status file exists">
    <action>Update {{sprint_status}}</action>
    <action>Load the FULL file and read all development_status entries</action>
    <action>Find development_status key matching {{story_key}}</action>
    <action>Verify current status is "backlog" (expected previous state)</action>
    <action>Update development_status[{{story_key}}] = "ready-for-dev"</action>
    <action>Update last_updated field to current date</action>
    <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>
  </check>

  <action>Report completion</action>
  <output>**🎯 ULTIMATE BMad Method STORY CONTEXT CREATED, {user_name}!**

    **Story Details:**
    - Story ID: {{story_id}}
    - Story Key: {{story_key}}
    - File: {{story_file}}
    - Status: ready-for-dev

    **Next Steps:**
    1. Review the comprehensive story in {{story_file}}
    2. Run dev agents `dev-story` for optimized implementation
    3. Run `code-review` when complete (auto-marks done)
    4. Optional: If Test Architect module installed, run `/bmad:tea:automate` after `dev-story` to generate guardrail tests

    **The developer now has everything needed for flawless implementation!**
  </output>
</step>

</workflow>
