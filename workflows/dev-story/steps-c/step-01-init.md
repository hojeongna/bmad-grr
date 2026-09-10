---
name: step-01-init
description: 'Find or resume story, load context, settle the story track, detect BDD runner, load TDD skill, mark in-progress'
nextStepFile: '~/.claude/workflows/dev-story/steps-c/step-02-analyze.md'
tddSkill: '~/.claude/skills/test-driven-development/SKILL.md'
---

# Step 1 — Init

## Outcome

A story is selected (or resumed), its full context is loaded, its track is settled, the project's BDD runner is known when the track needs one, the TDD skill is loaded into context, and the story is marked in-progress in sprint tracking.

## Approach

### Story selection

Check for an in-progress story first. If `{implementation_artifacts}` contains a story file with status `in-progress`, resume that one. Read it completely and settle its track (below) before routing — what counts as "step-02 done" depends on which track it is on. Then count what is finished against what is not, and route to whichever stage matches the story's actual state: step-02 if the ACs still have no verification path (Gherkin scenarios on the scenario track, named tests on the UI track), step-03 if they have one but not all of it is green, step-04 if all of it is green but not yet validated.

If no in-progress story exists:

- If the user passed a `{story_file}` argument, use it.
- Else if `{sprint_status}` exists, load the full file and pick the first entry whose key matches `<epic>-<story>-<slug>` (not an epic or retrospective entry) with status `ready-for-dev`.
- Else search `{implementation_artifacts}` for `*-*-*.md` files with status `ready-for-dev`.

If nothing is ready, surface the situation to the user (run `create-story`, or specify a path) and HALT.

### Context loading

Read the entire story file. Parse: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Change Log, Status. Load `{project_context}` if present. Extract any developer guidance from Dev Notes that constrains implementation.

If the story file is inaccessible, HALT — implementation cannot proceed without it.

### Story track

Read `change_type` from the story file's frontmatter. It decides how acceptance is verified for the rest of the workflow:

- `ui` — **UI track.** Acceptance rides on the project's own component / unit / integration tests. No Gherkin scenarios, no `.feature` files, no BDD runner.
- anything else (`feature`, `fix`, `refactor`, `chore`, `devex`) — **scenario track.** Acceptance rides on Gherkin scenarios under the project's BDD runner.

If the frontmatter has no `change_type` — the story came from `bmad-create-story`, `refine-story`, or a hand-written file rather than `quick-story` — ask the user once whether this story is UI work. Save the answer into the story file's frontmatter as `change_type` before going further, using `quick-story`'s vocabulary (`feature | fix | refactor | chore | ui | devex`): `ui` when the answer is yes, otherwise whichever of the rest fits, defaulting to `feature`. Writing it now is what keeps a resumed run from asking again. When the answer is ambiguous, take the scenario track — a backend story that gets scenarios costs less than a UI story that quietly skips acceptance.

The TDD inner loop is unaffected either way. Both tracks watch every unit test fail before writing the code that passes it.

### BDD runner detection

**Scenario track only** — on the UI track skip this section entirely; there is no runner to detect and nothing to persist.

Inspect the project to identify the BDD runner. Order of preference: explicit project config > package manifest signals > one-time user choice persisted to config.

Manifest signals to check:

- `package.json` dependencies — `@cucumber/cucumber`, `playwright-bdd`, `cypress-cucumber-preprocessor`
- `pyproject.toml` / `requirements*.txt` — `pytest-bdd`, `behave`
- `pom.xml` — `cucumber-jvm`, `cucumber-java`
- `go.mod` — `godog`
- `*.csproj` / `*.sln` — `Reqnroll`, `SpecFlow`
- `Cargo.toml` — `cucumber`

If none is found, ask the user once which runner to use (or whether to install one), and persist the choice to `{config_source}` under a `bdd_runner` key. Reasonable suggestions: `playwright-bdd` for web/JS-TS projects, `pytest-bdd` for Python backends, `godog` for Go, `Reqnroll` for .NET.

If the user has no preference and no scenarios can be executed, document the gap in Dev Notes and proceed in **dry-run mode** — scenarios will still be authored, but acceptance verification will rely on reasoning + unit tests until a runner is added.

### TDD skill load

Read the full content of `{tddSkill}` into context. The skill's RED-GREEN-REFACTOR cycle and Iron Law govern the inner loop in step-03. If context compacts, reload at the top of step-03.

### Sprint status

If `{sprint_status}` exists and the selected story's status is `ready-for-dev`, update it to `in-progress`. Preserve all comments and structure when saving. If the story is already `in-progress` (resumed), no change needed.

## Communicate

Briefly tell the user, in `{communication_language}`: which story was loaded, total ACs, which track it is on (and, on the scenario track, the BDD runner detected / chosen / dry-run), and that the TDD skill is loaded. One short paragraph.

## Next

Load and follow `{nextStepFile}`.
