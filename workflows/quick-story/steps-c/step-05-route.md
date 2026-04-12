---
name: 'step-05-route'
description: 'Route to dev-story chaining, design-pass (UX) chaining, save-only exit, or optional quick QA via gstack'

devStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-dev-story.md'
designPassCommand: '{project-root}/bmad-grr/commands/bmad-grr-design-pass.md'
qaSkill: '~/.claude/skills/gstack/qa/SKILL.md'
---

# Step 5: Route to Next Action

## STEP GOAL:

Present a clear summary of the completed story and offer the user a meaningful routing choice — chain into `dev-story` immediately for implementation in the same session, save and exit for later pickup, or (if gstack is installed) run a quick QA on the current application state before deciding.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are wrapping up the quick-story workflow cleanly
- ✅ Clear summary + meaningful routing choice
- ✅ Do not force dev-story chaining — saving and resuming later is equally valid

### Step-Specific Rules:

- 🎯 Focus on summary + routing decision
- 🚫 FORBIDDEN to modify any documents in this step
- 🚫 FORBIDDEN to offer the Q (quick QA) option when `{qaSkill}` is not installed
- 💬 Present results and routing options clearly

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 This is the final step — no next step file
- 💾 Track: user routing choice

## CONTEXT BOUNDARIES:

- Available: Written story path, sprint-status state, gstack skills (optional)
- Focus: Routing decision only
- Limits: No more modifications to documents
- Dependencies: Completed story from step-04

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Present Final Summary

"**Quick Story 완성!** 🎉

| 항목 | 결과 |
|------|------|
| Story Key | `{story_key}` |
| 파일 | `{story_path}` |
| Complexity | {complexity} |
| Status | ready-for-dev ✓ |
| sprint-status | 등록 완료 ✓ |
| Mini PRD | 4 fields ✓ |
| Mini Architecture | 5 fields ✓ |
| Architecture Impact | {'4 points ✓' if impact_analysis else 'skipped (plan-eng-review 미설치)'} |

**수고하셨어요!** ✨"

### 2. Offer Next Steps

**Determine available options:**

- `D` (dev-story chaining) — always available
- `S` (save only) — always available
- `U` (design-pass Branch A) — always available — UX 관점 보강 (UI 관련 스토리에 특히 유용)
- `Q` (quick QA) — ONLY if `{qaSkill}` exists

"**다음 어떻게 하시겠어요?**

- **(D)** 바로 `dev-story` 실행 — 이 세션에서 TDD로 구현 시작! (컨텍스트가 살아있으니 추천 ⭐)
- **(S)** 여기서 끝내기 — 나중에 `/bmad-grr-dev-story` 돌리면 자동 픽업돼요
- **(U)** 🎨 design-pass Branch A 먼저 — UI/UX 관점을 스토리에 보강한 후 D/S 결정 (UI 관련 스토리에 추천)
{IF qaSkill exists:}
- **(Q)** Quick QA 먼저 — gstack `/qa`로 현재 상태 확인 후 D/S 결정"

**HALT and wait for user response.**

### 3. Handle User Choice

**IF D (dev-story 실행):**

"**dev-story 워크플로우를 로드할게요!** 🚀

방금 저장한 스토리 파일 `{story_path}` 를 기반으로 바로 구현에 들어갑니다. TDD 스킬이 자동으로 로드될 거예요."

Load, read entire file, then execute `{devStoryCommand}` — pass the `{story_path}` as the explicit story file so dev-story picks it up directly without re-scanning sprint-status.

**END this workflow.** (dev-story takes over.)

**IF S (끝내기):**

"**수고하셨어요!** 👏

**저장된 파일:**
- 📄 `{story_path}`
- 📊 sprint-status.yaml updated

나중에 `/bmad-grr-dev-story` 돌리시면 이 스토리가 `ready-for-dev` 상태로 자동 픽업돼요. 컨텍스트 필요하면 스토리 파일의 Mini Architecture / Architecture Impact 섹션을 다시 참고하면 됩니다.

감사합니다! ✨"

**END this workflow.**

**IF U (design-pass Branch A):**

"**design-pass Branch A 로드할게요!** 🎨

저장된 스토리 `{story_path}` 를 기반으로 UI/UX 관점을 보강한 후 돌아올게요. design-pass가 `plan-design-review` + `critique` + 상황에 맞는 UX 스킬들을 자동으로 선택해서 스토리 문서에 UX Considerations 섹션을 추가합니다."

Load, read entire file, then execute `{designPassCommand}` — pass the `{story_key}` or `{story_path}` as context so design-pass Branch A picks it up directly (branch auto-detected from story reference).

After design-pass completes, **return to section 2** and re-offer **D / S / Q** (U is consumed — do not offer it again). The story document will now have a "UX Considerations" section added.

**IF Q (Quick QA):**

**IF `{qaSkill}` exists:**

"**Quick QA를 먼저 돌려볼게요!** 🧪

gstack `/qa` 스킬을 로드해서 현재 애플리케이션 상태를 빠르게 확인한 후, 결과를 보고 D (dev-story)나 S (저장만) 중 다시 선택하시면 됩니다."

Load `{qaSkill}` via Read tool and follow its diff-aware QA methodology, targeting the touchpoint files/routes from step-02. Capture key findings.

After QA completes, **return to section 2** and re-offer **D / S / U** (Q is consumed — do not offer it again).

**IF `{qaSkill}` does NOT exist:**

Do not present this branch at all — section 2 should have already filtered out the Q option. If somehow reached, respond:

"gstack이 설치되어 있지 않아서 `/qa` 옵션을 쓸 수 없어요. D나 S 중에서 선택해주세요."

Redisplay section 2 menu with only D/S.

**IF Any other:**

Help user respond, then redisplay section 2 menu.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Clear final summary presented with all key metadata
- User given D/S/(Q) choice based on gstack availability
- IF D selected: dev-story loaded with explicit story path
- IF S selected: clear resume guidance with file path
- IF Q selected: qa skill loaded (if installed), then re-offered D/S

### FAILURE:

- Not presenting summary
- Not offering dev-story chaining
- Offering Q when qa skill is not installed
- Loading dev-story without user choosing D
- Not providing the story file path on S
- Getting stuck in Q → re-offer loop (Q should be consumed after one run)

**Master Rule:** Clear summary, meaningful choice, clean handoff. Both D and S are equally valid — no pressure to chain.
