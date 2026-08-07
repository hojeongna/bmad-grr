---
name: step-06-compose-prompt
description: 'Render the handoff prompt — from the redesign spec when step-05b produced one, otherwise from the flat UX/UI Guide template — present it as one copy-paste block, save it, then route to whichever delivery path the user actually needs'
nextStepFile: './step-07-receive-and-verify.md'
nextStepDirect: './step-07b-direct-implementation.md'
nextStepReport: './step-06b-stakeholder-report.md'
nextStepAuto: './step-06c-auto-claude-design.md'
promptTemplate: '{prompt_template}'
redesignSpecPath: '{redesign_spec_path}'
uxGuidePath: '{ux_guide_path}'
handoffOutputPath: '{handoff_output_path}'
convertedScreensDir: '{converted_screens_dir}'
---

# Step 6 — Compose the Handoff Prompt

## Outcome

One detailed, self-contained prompt exists — rendered from `{redesignSpecPath}` when step-05b produced one (the common case), otherwise from `{uxGuidePath}` directly via `{promptTemplate}` — ready to paste into a claude.ai/design chat. It's shown to the user as a copy-paste block and saved to disk. Whichever source document was used remains the durable artifact; the prompt is a disposable rendering of it. The user is then routed to whichever delivery path fits: Claude Design generation, direct implementation against a scaffold they already have, and/or a plain-language stakeholder report.

## Approach

### Read the source, then fill the template

Check whether `{redesignSpecPath}` exists. If it does, read it in full and render the prompt from it — it already contains reference-backed, buildable prescriptions per screen; don't re-derive them from the guide from scratch. If it doesn't (this run skipped step-05b), read `{uxGuidePath}` in full instead and fall back to the original flat rendering. Either way, this source is the source of truth by this point, not scattered step-to-step memory — if something looks stale (the user corrected something verbally since it was written that never made it back into the file), update the source document first, then render from the corrected version.

Load `{promptTemplate}` (or, when rendering from the redesign spec, follow that document's own section structure directly — it's already shaped as a paste-ready spec) and fill every slot. Drop any section whose slot is empty rather than leaving a hollow heading. Be concrete, not a re-paste of the source verbatim — summarize product context in the tool's voice, but keep the screen-by-screen prescriptions and the open-questions list exact.

The SEED norms section (3a / 4a) is the one exception to "summarize in the tool's voice": carry it through at the detail step-03b harvested, tables intact. A rule compressed to a bullet is a rule a downstream builder skips, and the whole point of that section is that it supplies the numbers nobody wrote down. Keep the precedence line and the conflict table with it — without them the norms read as a competing design system rather than a fallback layer.

### Present and save

Show the fully composed prompt as one fenced block so it's a single copy action. Tell the user, in `{communication_language}`:

- Paste it into the claude.ai/design chat for `{claude_design_project.name}` (if one was confirmed/created in step-03) — this keeps the design system it produces attached to that project.
- If `converted_html_path`/`reference_image_path` (single screen) or per-screen files under `{convertedScreensDir}` (multi-screen) exist, attach the relevant file(s) alongside the pasted prompt.
- If no Claude Design project was set up, paste it into a fresh claude.ai/design chat anyway — section 0 of the prompt handles that case.

Save the prompt to `{handoffOutputPath}/prompt-{date}.md` so it survives a session break. Mention the source document too (`{redesignSpecPath}` or `{uxGuidePath}`) — it's the editable, durable version of everything the prompt just summarized.

### Ask which delivery path actually applies

Don't assume Claude Design is the only route — ask once:

```
구현을 어떻게 진행할까요?

[D] Claude Design에 붙여넣어 생성 (지금 저장한 프롬프트 그대로 사용)
[A] Claude Design 자동 진행 (브라우저 자동화로 프롬프트 제출부터 결과 수집까지 대신 처리)
[C] 이미 코드 스캐폴드가 있어요 — 직접(또는 저와 함께) 그 코드를 고쳐나갈게요
[S] 지금은 여기까지 — 문서만 저장

보고용 문서도 따로 필요하면 아무 때나 말씀해 주세요 (별도로 만들어 드려요).
```

Halt for input.

## Next

- `[D]` → load and follow `{nextStepFile}` (step-07, the Claude-Design-draft verification path).
- `[A]` → load and follow `{nextStepAuto}`.
- `[C]` → load and follow `{nextStepDirect}` (step-07b, direct implementation against the user's own scaffold) — skip step-07 entirely, there's no external draft to receive.
- `[S]` → stop here; the saved prompt/spec is enough to resume from later.
- If the user separately asks for a stakeholder-facing report at any point (now or later), load and follow `{nextStepReport}` — it's independent of the D/C/S choice above and can run alongside or after either path.
