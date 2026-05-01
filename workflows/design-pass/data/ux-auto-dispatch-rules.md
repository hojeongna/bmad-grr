---
title: 'UX Auto-Dispatch Reference'
type: 'reference-not-rules'
purpose: 'Hints for LLM to recognize common UX situations — NOT a mechanical lookup table'
---

# UX Auto-Dispatch — Pattern Reference

> ⚠️ **CRITICAL: This file is a REFERENCE, not a rules table.**
>
> The LLM reading this file MUST first read the full story document (Branch A) or observe the live screen (Branch B) and apply judgment. The patterns below are starting hints for recognizing common UX situations. They do NOT override the LLM's judgment from the actual content.

## Anti-Pattern to Avoid

❌ **BAD** — Keyword matching:
> "Story contains 'upload' → load harden"

✅ **GOOD** — Judgment with citation:
> "AC #3 specifies '5MB 초과 시 에러', but Dev Notes doesn't define how the error is communicated to the user. This is a UX gap. Loading `harden` for error resilience + `clarify` for message quality."

## How to Use This File

1. **First**: Read the full story (Branch A) or audit the live screen (Branch B)
2. **Then**: Identify UX risks from the ACTUAL content — what could go wrong from the user's perspective?
3. **For each risk**: Ask "which UX skill best addresses this?"
4. **Use patterns below** as a reference for common situations
5. **Explain your selection** with a specific quote or finding from the source
6. **If a situation doesn't match any pattern**, use your judgment — the patterns are not exhaustive

---

## Branch A (Pre-dev) Base Skills — ALWAYS Load

Always load these when entering Branch A, regardless of story content:

| Skill | Purpose |
|---|---|
| **`plan-design-review`** | Interactive design plan review (scores each dimension 0-10, identifies gaps) |
| **`critique`** | Quantitative UX evaluation of the plan (visual hierarchy, info architecture, cognitive load, emotional resonance) |

These provide the baseline scoring framework. Additional skills are selected by judgment based on the story content.

## Branch B (Live-fix) Base Skills — ALWAYS Load

Always load these when entering Branch B:

| Skill | Purpose |
|---|---|
| **`design-review`** | Live-site designer's eye QA (inconsistency, AI slop, spacing, hierarchy) |
| **`critique`** | Live UX quantitative evaluation |
| **`browse`** (or Chrome DevTools MCP) | Screenshot + console + network capture for evidence |

These give the audit baseline. Additional skills are selected based on what the audit finds + what the user cares about.

---

## Common UX Situations & Skill Patterns

### 🛡️ Situation: Errors, edge cases, recovery scenarios

**Common skills:** `harden`, `clarify`

**Why:** Error states need both resilience (harden) and clear communication (clarify).

**Recognition cues (examples, not rules):**
- AC mentions failure modes, timeout, limit exceeded, validation
- Tasks include error paths, retry logic
- Dev Notes lists edge cases but doesn't define error UX
- Live audit finds generic error messages like "Error: 500" or "Something went wrong"

### 🌱 Situation: First-time user, empty states, onboarding

**Common skills:** `onboard`, `delight`

**Why:** First impressions shape perception; empty states are opportunities, not gaps.

**Recognition cues:**
- Story describes first-time usage or activation
- AC mentions empty states
- Live audit shows blank page with no guidance
- The moment is the user's first encounter with the feature

### 💫 Situation: Interaction feels flat, static, lifeless

**Common skills:** `animate`, `delight`, `bolder`

**Why:** Motion and personality drive emotional engagement.

**Recognition cues:**
- User says "밋밋해" / "심심해" / "정적이야"
- No hover/focus/transition states defined
- Successful actions lack feedback moments
- Critique finds low emotional resonance score

### 📐 Situation: Visual hierarchy weak, scanning hard

**Common skills:** `arrange`, `typeset`, `polish`

**Why:** Spacing, rhythm, and typography establish hierarchy.

**Recognition cues:**
- critique score for visual hierarchy < 6/10
- All elements look equal weight
- Uniform spacing (monotonous)
- User says "어지러워" / "눈이 어디 가야 할지 모르겠어"

### 🏛️ Situation: Design drift, inconsistency with system

**Common skills:** `normalize`, `polish`

**Why:** Realign to tokens/patterns, polish residual drift.

**Recognition cues:**
- Multiple button/card/form styles on same page
- design-review finds spacing/color/token inconsistencies
- User says "일관성 없어" / "들쭉날쭉"

### 🧘 Situation: Content overwhelming, cluttered, noisy

**Common skills:** `distill`, `arrange`, `clarify`

**Why:** Reduce visual noise, improve rhythm, clarify copy.

**Recognition cues:**
- critique score for cognitive load > 7/10
- Too many elements competing for attention
- User says "복잡해" / "부담스러워" / "어지러워"

### 🔤 Situation: Typography weak or inconsistent

**Common skills:** `typeset`

**Why:** Type hierarchy, sizing, weight affect readability and intent.

**Recognition cues:**
- All text looks same weight
- Hierarchy not clear from typography alone
- User says "폰트 이상해" / "가독성 낮아"

### 🌈 Situation: Monotone, lacks color strategy

**Common skills:** `colorize`

**Why:** Strategic color adds warmth, hierarchy, semantic meaning.

**Recognition cues:**
- Everything grey/neutral
- No semantic color usage (success/error/warning look the same)
- User says "회색이야" / "생기 없어"

### 🕊️ Situation: Too intense, overwhelming visual

**Common skills:** `quieter`, `distill`

**Why:** Tone down visual aggression while preserving quality.

**Recognition cues:**
- Heavy shadows, saturated colors everywhere
- User says "과해" / "시끄러워"

### 📱 Situation: Mobile, cross-device, responsive concerns

**Common skills:** `adapt`

**Why:** Responsive breakpoints, fluid layouts, touch targets.

**Recognition cues:**
- Story touches user-facing UI across devices
- AC mentions mobile or responsive
- Dev Notes lacks breakpoint strategy
- Live audit on mobile viewport shows broken layout

### ✨ Situation: Final polish before ship, mid-quality

**Common skills:** `polish`, `normalize`

**Why:** Last-mile alignment, spacing, consistency fixes.

**Recognition cues:**
- User says "완성도 부족" / "뭔가 아쉬워"
- Minor alignment issues across screens
- Pre-launch moment

### 🚀 Situation: Want wow, memorable, stand-out

**Common skills:** `overdrive`, `delight`

**Why:** Push past conventional limits (shaders, spring physics, scroll-driven reveals).

**Recognition cues:**
- User says "와우하게" / "임팩트 있게"
- Landing/marketing/signature moment
- Hero sections, showcase features

### 💬 Situation: UX copy, labels, messages unclear

**Common skills:** `clarify`

**Why:** Text is UX too — clear copy reduces friction and confusion.

**Recognition cues:**
- Generic error messages
- Ambiguous labels
- User says "텍스트 어려워" / "라벨 이상해"

---

## Explanation Template — Always Use This Format

When presenting selected skills to the user, ALWAYS format the output like this:

```
📋 {target} 분석 결과

발견된 UX 리스크:
- {risk_1} ({specific reference to content: AC #N / screenshot / user concern})
- {risk_2} ({specific reference})

적용할 스킬 ({n}개):
🎨 plan-design-review — base (always loaded in Branch A)
📊 critique — base
🛡️ harden — {specific reasoning tied to the content}
💬 clarify — {specific reasoning}

진행할까요? [Y / M으로 조정]
```

**The critical element is the "specific reasoning" — it MUST reference the actual content (AC number, screenshot finding, user's exact words), NOT a keyword match.**

---

## What to Do When Patterns Don't Match

If the situation you've identified doesn't neatly fit any pattern above:

1. **Trust your judgment** — the patterns aren't exhaustive
2. **Still explain** your selection with a citation
3. **Default to the base skills** (plan-design-review + critique for Branch A, design-review + critique + browse for Branch B) and add whatever else seems relevant
4. **When unsure, ask the user** — better to ask one question than apply the wrong skill

## What to Do When Two or More Situations Overlap

Common case. Example: A story about "프로필 이미지 업로드" could hit:

- Errors (upload failure) → `harden` + `clarify`
- First-time moment (first upload) → `onboard`
- Celebration (successful upload) → `delight`

**Just load all relevant skills** — they compose well. Present them all to the user with separate reasoning for each. The user can trim in the confirmation step if they want a lighter pass.
