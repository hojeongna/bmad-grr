---
title: 'UX Considerations Checklist for Pre-dev Enhancement'
type: 'thinking-prompt'
purpose: 'Prompt LLM to consider UX dimensions when enhancing a pre-dev story document — used in Branch A'
---

# UX Considerations Checklist (Branch A)

> This checklist is a **thinking prompt** used when enhancing a story document with UX perspectives BEFORE implementation. The LLM uses it as a framework for reasoning, not as a mechanical tick-list.

## How to use

1. Read the full story document (Mini PRD, Mini Architecture, Story, AC, Tasks, Dev Notes)
2. For each dimension below, ask "does this story need guidance on X?"
3. If yes, generate specific guidance for THIS story (not generic best practices)
4. Cite the story AC/Tasks/Dev Notes that triggered the guidance

## Core UX Dimensions

### 1. Empty States

- What does the user see the FIRST time they visit this feature? (no data yet)
- What copy helps them understand what to do next?
- Is there a visual element that invites action?
- Is the empty state an opportunity for onboarding?

### 2. Loading States

- Is loading quick enough to not need indication? (~ < 200ms)
- If longer, what loading UX is appropriate — skeleton, spinner, progress bar, optimistic UI?
- Is the loading state meaningful (shows what's coming) or generic?
- Are there multiple loading stages to indicate?

### 3. Error States

- For EACH way this flow can fail, what does the user see?
- Is the error message actionable (tells user what to do, not just what broke)?
- Is there recovery/retry/fallback?
- Is sensitive info leaked? (stack traces, internal IDs, debug messages)
- Are errors localized for the user's language?

### 4. Edge Cases

- **Large input**: huge name, 500-item list, 5MB upload, long text
- **Small input**: empty, single character, zero items
- **Boundary values**: max/min, exactly at limit
- **Unexpected input**: wrong format, special characters, null/undefined

### 5. Success States

- Is success visible and celebrated?
- Does the user know what just happened?
- Is there a clear "what's next" path?
- Any celebratory micro-moments worth adding?

### 6. Responsive / Cross-Device

- **Mobile (< 640px)**: touch targets ≥ 44px? layout reflows? scrollable?
- **Tablet (640-1024px)**: balanced layout, not stretched?
- **Desktop (> 1024px)**: uses space meaningfully, not monotonous?
- **Orientation changes** handled?
- **Offline / low bandwidth**: graceful degradation?

### 7. Accessibility (a11y)

- **Keyboard navigation**: all interactions reachable?
- **Screen reader**: can describe the flow? proper ARIA?
- **Color contrast**: ≥ WCAG AA (4.5:1 for normal text, 3:1 for large)?
- **Focus indicators**: visible on all interactive elements?
- **Motion**: respects `prefers-reduced-motion`?
- **Text alternatives**: images have alt text?

### 8. Copy / Microcopy

- Is every label clear to a first-time user?
- Are error messages actionable (not just "Error occurred")?
- Is the tone consistent with the product voice?
- Is it localizable (no hardcoded strings, no embedded concatenation)?
- Is CTA copy action-oriented ("Save" vs "OK")?

### 9. Motion / Feedback

- Does the UI respond to every interaction (hover, click, focus, press)?
- Are transitions purposeful (not jittery or excessive)?
- Is motion reduced-motion-respecting?
- Are state changes (loading → success, error → retry) animated appropriately?

### 10. Performance Perception

- Does the UI feel fast? (perceived performance > actual sometimes)
- Are large lists virtualized?
- Optimistic UI where applicable (e.g., show success before server confirms)?
- Are animations 60fps?

---

## Output Format — Enhanced Story's "UX Considerations" Section

When writing the UX enhancement into the story, append this section to the Dev Notes:

```markdown
## 🎨 UX Considerations (from design-pass)

**Enhancement date:** {{date}}
**Skills applied:** {{list of skills the LLM selected}}
**Reasoning source:** {{which AC/Tasks/Dev Notes/Risks triggered the analysis}}

### Empty States
- {{specific guidance for THIS story, citing AC/Tasks where relevant}}

### Loading States
- {{specific guidance}}

### Error States
- {{specific error scenarios from the story, with UX handling}}

### Edge Cases
- {{specific edge cases from the story's Risks section}}

### Success States
- {{specific success UX}}

### Responsive / Cross-Device
- {{specific breakpoints and device considerations}}

### Accessibility
- {{specific a11y requirements}}

### Copy Guidelines
- {{specific copy notes for this flow}}

### Motion / Feedback
- {{specific interaction feedback}}

### Performance Perception
- {{specific performance UX notes}}

### Reasoning Trail
- **Why `plan-design-review`**: {{base skill}}
- **Why `critique`**: {{base skill}}
- **Why `{skill_N}`**: {{specific reference to the story content}}
- ... (one line per additional skill)
```

Only include the subsections that are RELEVANT to this story. If the story has no cross-device concerns, skip the "Responsive" subsection. Don't pad with generic platitudes.
