---
name: step-06-compose-prompt
description: 'Render the handoff prompt template FROM the UX/UI Guide document, present it as one copy-paste block, save it alongside the workflow output'
nextStepFile: './step-07-receive-and-verify.md'
promptTemplate: '{prompt_template}'
uxGuidePath: '{ux_guide_path}'
handoffOutputPath: '{handoff_output_path}'
---

# Step 6 — Compose the Handoff Prompt

## Outcome

One detailed, self-contained prompt exists — rendered from `{uxGuidePath}` (the UX/UI Guide built up across steps 2–5), plus the brownfield base when present — ready to paste directly into a claude.ai/design chat. It's shown to the user as a copy-paste block and saved to disk. The guide document itself remains as the durable artifact; the prompt is a disposable rendering of it.

## Approach

### Read the guide, then fill the template

Read `{uxGuidePath}` in full — it is the source of truth by this point, not scattered step-to-step memory. If something in it looks stale (the user corrected something verbally since it was written that never made it back into the file), update the guide first, then render from the corrected version.

Load `{promptTemplate}` and fill every slot from the guide's sections. Drop any section whose slot is empty rather than leaving a hollow heading. Be concrete, not a re-paste of the guide verbatim — summarize product context in the tool's voice, but keep the screen-by-screen spec and the `[ASSUMPTION]` list exact.

### Present and save

Show the fully composed prompt as one fenced block so it's a single copy action. Tell the user, in `{communication_language}`:

- Paste it into the claude.ai/design chat for `{claude_design_project.name}` (if one was confirmed/created in step-03) — this keeps the design system it produces attached to that project.
- If `converted_html_path` or `reference_image_path` exists, attach that file alongside the pasted prompt.
- If no Claude Design project was set up, paste it into a fresh claude.ai/design chat anyway — section 0 of the prompt handles that case.

Save the prompt to `{handoffOutputPath}/prompt-{date}.md` so it survives a session break. Mention `{uxGuidePath}` too — it's the editable, durable version of everything the prompt just summarized.

## Next

Load and follow `{nextStepFile}`.
