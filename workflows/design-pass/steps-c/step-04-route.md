---
name: 'step-04-route'
description: 'Final routing: save design pass learnings to gstack/learn, then route to dev-story chaining / refine-story delegation / save-only exit based on branch and save target type'

devStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-dev-story.md'
refineStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-refine-story.md'
learnSkill: '~/.claude/skills/gstack/learn/SKILL.md'
---

# Step 4: Route to Next Action

## STEP GOAL:

Present the final summary, save design pass learnings to gstack/learn (if available), and route to the appropriate next action based on the branch and save target type — dev-story chaining, refine-story delegation, or save-only exit.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are wrapping up the design pass workflow cleanly
- ✅ Clear summary + meaningful routing choice
- ✅ Save learnings so future design passes get smarter

### Step-Specific Rules:

- 🎯 Focus on summary + learnings save + routing decision
- 🚫 FORBIDDEN to modify any documents in this step (except learn storage)
- 💬 Present results and routing options clearly
- 🧠 ALWAYS offer learn save when gstack/learn is installed

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 This is the final step — no next step file (except chain to dev-story/refine-story if chosen)

## CONTEXT BOUNDARIES:

- Available: all prior step outputs, branch, save_target_type, gstack/learn (optional)
- Focus: Summary + learnings + routing
- Limits: No more modifications to story/improvement docs
- Dependencies: Completed Branch A (step-03a) or Branch B (step-03b)

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Present Final Summary

**IF Branch A:**

"**Design Pass 완료! (Pre-dev)** 🎨✨

| 항목 | 결과 |
|------|------|
| 대상 스토리 | `{story_ref}` |
| 적용된 스킬 | {n}개 ({list}) |
| 추가된 UX subsection | {n}개 |
| 스토리 파일 | `{story_path}` ✓ |

**강화된 내용:** UX Considerations 섹션이 스토리 문서에 추가됐어요. dev-story가 이 스토리를 픽업하면 구현 단계에서 UX 관점이 자동으로 반영됩니다."

**IF Branch B:**

"**Design Pass 완료! (Live-fix)** 🎨✨

| 항목 | 결과 |
|------|------|
| 대상 URL | `{url}` |
| Critique Overall | {score}/10 |
| 적용된 스킬 | {n}개 ({list}) |
| 개선 제안 | {total_count}개 (P0: {p0}, P1: {p1}, P2: {p2}) |
| Save target | {save_target_description} |
| 저장 위치 | `{story_path or 'staged for refine-story'}` |
| sprint-status | {updated ✓ / skipped / will be handled by refine-story} |

**수고하셨어요!** ✨"

### 2. Save Design Pass Learnings (gstack/learn — OPTIONAL)

**IF `{learnSkill}` exists (gstack installed):** This design pass surfaced UX insights — save them so future passes and dev-story cycles can benefit.

Load the FULL `{learnSkill}` file via Read tool, then save 1-3 distinct learning entries based on what this design pass revealed:

**Candidates for learning entries:**

- **UX pattern discovered** (type `pattern`) — e.g., "Upload flows need explicit file-size error UX with actionable message format"
- **Design system gap** (type `architecture`) — e.g., "Primary CTAs in this project should always use the `button-primary-xl` token, not inline sizing"
- **Recurring UX pitfall** (type `pitfall`) — e.g., "Empty states without guidance are perceived as broken UI"
- **Project UX preference** (type `preference`) — e.g., "Team prefers micro-animations on success moments over loading states"

Each entry:

- **key**: short kebab-case (e.g., `upload-error-message-format`)
- **insight**: one-sentence UX principle or rule
- **confidence**: 6-10
- **files**: touched story key + any source files referenced
- **source**: `design-pass`

Only log GENUINE reusable insights. "Would knowing this save a future design pass from rediscovering it?" is the bar.

"**Design pass learnings saved** ({n} entries) — 다음 design-pass / dev-story / quick-story에서 참조됩니다."

**IF `{learnSkill}` does NOT exist:** Silently skip.

### 3. Route to Next Action

**Branch A (Pre-dev) routing:**

"**다음 어떻게 하시겠어요?** 📋

- **[D]** 바로 `dev-story` 실행 — 강화된 `{story_ref}` 로 TDD 구현 시작! (컨텍스트 살아있으니 추천 ⭐)
- **[S]** 여기서 끝내기 — 나중에 `/bmad-grr-dev-story` 돌리면 강화된 스토리 자동 픽업"

**Branch B routing (based on save_target_type):**

**IF Branch B + save_target_type == 'N' (new story):**

"**다음 어떻게 하시겠어요?** 📋

- **[D]** 바로 `dev-story` 실행 — `{story_key}` 개선안으로 TDD 구현 시작! (추천 ⭐)
- **[S]** 여기서 끝내기 — 나중에 `/bmad-grr-dev-story` 돌리면 `{story_key}` 자동 픽업"

**IF Branch B + save_target_type == 'A' (append to existing):**

"**다음 어떻게 하시겠어요?** 📋

- **[R]** `refine-story` 위임 — 이 개선안을 기반으로 `{target_story_key}` 를 업데이트합니다 ⭐
- **[S]** 여기서 끝내기 — 개선안은 context에만 있고 저장되지 않았어요"

**IF Branch B + save_target_type == 'S' (file only):**

"**다음 어떻게 하시겠어요?** 📋

- **[D]** 지금 `dev-story` 실행 — `{story_key}` 로 바로 구현 시작 (sprint-status는 등록 안 됐지만 파일 경로로 직접 전달)
- **[S]** 여기서 끝내기 — 파일만 저장돼있어요. 나중에 수동으로 호출 필요"

**HALT and wait for user response.**

### 4. Handle User Choice

**IF D (dev-story 실행):**

"**dev-story 워크플로우를 로드할게요!** 🚀

{story_key or story_ref} 파일을 기반으로 TDD 구현에 들어갑니다. 강화된 UX Considerations (Branch A) 또는 개선 제안 (Branch B) 이 Dev Notes에 반영돼있어서 구현 시 참조됩니다."

Load, read entire file, then execute `{devStoryCommand}` — pass the story file path explicitly so dev-story picks it up directly.

**END this workflow** (dev-story takes over).

**IF R (refine-story 위임 — Branch B, save_target_type == 'A'):**

"**refine-story 워크플로우를 로드할게요!** 🔀

개선안을 `{target_story_key}` 에 반영하기 위해 refine-story에 넘길게요. refine-story가 gap 분석 후 AC/Tasks/Dev Notes를 업데이트합니다."

Load, read entire file, then execute `{refineStoryCommand}` — pass:
- The target story key
- The staged improvement doc (from step-03b) as the refinement context
- A note that this is a design-pass handoff, not a post-dev gap

**END this workflow** (refine-story takes over).

**IF S (끝내기):**

**Branch A:**

"**수고하셨어요!** 👏

**저장된 파일:**
- 📄 `{story_path}` (UX Considerations 섹션 추가됨)

나중에 `/bmad-grr-dev-story` 돌리시면 이 강화된 스토리를 자동으로 픽업합니다.

감사합니다! ✨"

**Branch B (new story or file only):**

"**수고하셨어요!** 👏

**저장된 파일:**
- 📄 `{story_path}`
- 📊 sprint-status: {updated / skipped}

{if save_target_type == 'N':}
나중에 `/bmad-grr-dev-story` 돌리시면 `{story_key}` 자동 픽업돼요.

{if save_target_type == 'S':}
파일만 저장돼있어서 sprint-status 등록은 안 됐어요. 직접 실행하시려면 `/bmad-grr-dev-story {story_key}` 해주세요.

{if save_target_type == 'A':}
개선안은 context에만 있었고 저장되지 않았어요. 다음에 refine-story를 통해 적용할 수 있어요.

감사합니다! ✨"

**END this workflow.**

**IF Any other:**

Help user respond, then redisplay the routing options from section 3.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Clear final summary presented with all key metadata
- Design pass learnings saved to gstack/learn (if available) with meaningful entries
- User given correct routing options based on branch + save_target_type
- IF D selected: dev-story loaded with correct story path
- IF R selected: refine-story loaded with improvement handoff
- IF S selected: clear resume guidance with file path
- Clean workflow termination

### FAILURE:

- Not presenting summary
- Offering wrong routing options (e.g., R for Branch A)
- Loading dev-story/refine-story without user choosing
- Not offering learn save when gstack/learn is available
- Saving generic/trivial learnings instead of real insights
- Silently skipping learn save without checking if it exists

**Master Rule:** Clear summary, meaningful routing based on branch/target, learnings for future. Respect user's choice.
