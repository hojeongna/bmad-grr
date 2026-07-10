---
name: step-06c-auto-claude-design
description: 'The [A] delivery path — drive claude.ai/design end-to-end via browser automation instead of a human copy-paste round trip: submit the composed prompt (with any converted screen/reference files attached), poll until generation completes, extract the resulting code, and save it locally so step-07 can verify it exactly as if a human had pasted it back'
nextStepFile: './step-07-receive-and-verify.md'
handoffOutputPath: '{handoff_output_path}'
convertedScreensDir: '{converted_screens_dir}'
---

# Step 6c — Automated Claude Design Delivery

This is the `[A]` path from step-06 — same destination as `[D]` (a Claude Design draft for step-07 to verify), but the submit-and-collect round trip is done by browser automation instead of the user pasting things by hand.

## Outcome

The composed handoff prompt from step-06 (plus any converted screen files or reference images) has been submitted to claude.ai/design via browser automation, a completed generation has been retrieved, and the resulting code has been saved to local files under `{handoffOutputPath}/auto-draft/`. The saved paths are recorded as `auto_draft_paths` — ready to hand to step-07 exactly as if a human had pasted them back manually. If automation fails at any point, this step falls back to the manual `[D]` flow rather than silently giving up or fabricating a result.

## Approach

### A deliberate first-party navigation, not a clicked link

claude.ai/design is being navigated to directly by this workflow, not opened from a link in an email, message, or other untrusted source — the usual suspicious-link caution doesn't apply here. It does still require a real, logged-in Claude Design session; browser automation cannot authenticate on the user's behalf, so an auth wall (see below) is expected to halt this step, not a reason to distrust the destination.

### Load the browser tools

Tool names for the claude-in-chrome MCP weren't hardcoded into this workflow at authoring time and may shift — use ToolSearch to discover the actual tools needed (navigation, tab creation, element-finding, reading page content, typing/clicking, file upload) before calling anything, the same way step-05 confirms Mobbin MCP's real tool names before use.

### Find or open the right destination

If `{claude_design_project}` was confirmed or created in step-03, navigate to claude.ai/design and locate that project on the page (by name / `projectId`) rather than guessing a URL pattern — read the page back to confirm you've actually landed on the right project before proceeding. If no project was set up in step-03, or the target project can't be confirmed on the page, open a fresh claude.ai/design chat instead — this mirrors what step-06 already tells the user to do by hand in the no-project case.

If what loads is a login prompt instead of the expected design workspace, that's an auth wall, not something to work around: halt and ask the user to log in once, the same way this workflow already halts when Mobbin MCP access is missing (step-05) — don't attempt to guess credentials or proceed past it.

### Submit the prompt and any screen files

Type or paste the composed prompt — the one step-06 just rendered and saved to `{handoffOutputPath}/prompt-{date}.md` — into the chat input. If `converted_html_path`/`reference_image_path` (single screen) or per-screen files under `{convertedScreensDir}` (multi-screen) exist, attach them to the message before submitting, same as step-06 already tells the user to do for the manual path — just performed by the automation here instead.

### Wait for generation, then extract the result

Submit, then poll the page for completion rather than sleeping a fixed duration — generation time varies and a fixed wait either stalls or clips early. Use a sane timeout; if it's exceeded without the generation finishing, treat that as an automation failure (see below), not a reason to keep polling indefinitely.

Once the generation is complete, read the resulting code / file tree back from the response page and save each file locally under `{handoffOutputPath}/auto-draft/`. Record the full list of saved file paths as `auto_draft_paths`.

### Critical: fail gracefully, never fabricate

This is browser automation against a real product UI that can change or fail unpredictably — a selector that no longer matches, an unexpected redirect, a generation that errors out, a response layout the automation can't parse into files. If navigation, element-finding, submission, or extraction fails at any point, do not silently give up and do not fabricate a result.

Instead, fall back to the manual `[D]` flow: show the composed prompt again (it's already saved at `{handoffOutputPath}/prompt-{date}.md`), tell the user plainly that automation didn't complete, and ask them to paste it into claude.ai/design themselves and bring back the result the way step-07 already expects (file path(s), or inline pasted code). In this fallback case, leave `auto_draft_paths` empty so step-07 knows to ask for the files manually instead of trusting a partial or empty automated result.

## Next

Load and follow `{nextStepFile}`.
