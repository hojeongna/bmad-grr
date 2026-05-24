# Rubric — Ambiguity score

A specification is ambiguous when a reasonable implementer could read it
and produce two different implementations that both seem correct. This
rubric scores ambiguity from **0.0** (every claim measurable, every
actor named, every threshold specified) to **1.0** (pervasive vagueness).

**Pass threshold: ≤ 0.2.**

## Scoring procedure

1. Read the artifact end-to-end.
2. List every phrase that signals vagueness — these become
   `ambiguity_offenders` in the output.
3. Count offenders per 100 lines of artifact (round up).
4. Apply the score band below. Adjust within the band by severity:
   a single high-severity offender (e.g. an AC with no measurable
   outcome) pushes the score toward the top of its band.
5. If any AC fails the `measurable outcome` check, score cannot be
   below 0.2 regardless of count.

## What counts as a vagueness offender

| Category | Example phrase | Why it's vague |
|---|---|---|
| Vague modifier | "appropriately", "efficiently", "user-friendly", "performant", "fast", "clean", "적절히", "충분히", "친절하게" | No measurable bound |
| Unbounded condition | "when needed", "if necessary", "where appropriate", "필요 시", "적절한 경우" | Trigger condition undefined |
| Subjective standard | "good UX", "intuitive", "obvious", "clean code", "직관적", "자연스럽게" | Different readers disagree |
| Underspecified actor | "the system handles", "we should", "it must", "처리한다", "동작한다" (subject elided) | Who/what performs the action? |
| Missing threshold | "many", "fast", "reliable", "soon", "많은", "빠른", "안정적인" | No number |
| Optimistic shorthand | "robust error handling", "comprehensive validation", "탄탄한 예외 처리" | Hides actual requirements |

Direct numeric specs are NEVER vague: "responds within 200ms",
"supports 10k concurrent users", "matches /^\\d{4}-\\d{2}-\\d{2}$/".

## Score band

| Offenders per 100 lines | Score range |
|---|---|
| 0 | 0.00 |
| 1–2 | 0.05–0.15 |
| 3–5 | 0.15–0.30 |
| 6–10 | 0.30–0.55 |
| 11–20 | 0.55–0.80 |
| 21+ | 0.80–1.00 |

## Worked example

Artifact (40 lines):
> AC-1: 사용자가 로그인 시도 시 적절한 에러를 표시한다.
> AC-2: 응답 시간은 충분히 빨라야 한다.
> AC-3: 잘못된 입력은 친절한 메시지로 안내한다.

Offenders:
- "적절한 에러" (AC-1) — vague modifier, no error class specified
- "충분히 빨라야" (AC-2) — missing threshold
- "친절한 메시지" (AC-3) — subjective standard

3 offenders in 40 lines → 7.5 per 100 lines → score band 0.30–0.55.
Severity is high (all three are in ACs and remove measurability) →
score lands at the top of the band: **0.50**.

Verdict: REVISE. Output includes:

```json
{
  "ambiguity_score": 0.50,
  "ambiguity_offenders": [
    { "phrase": "적절한 에러", "location": "AC-1", "suggestion": "specify the error class or message format" },
    { "phrase": "충분히 빨라야", "location": "AC-2", "suggestion": "specify a numeric threshold, e.g. 'within 800ms'" },
    { "phrase": "친절한 메시지", "location": "AC-3", "suggestion": "define what the message must contain (field + cause + suggested fix)" }
  ],
  "revision_pointers": [
    "Replace soft modifiers in AC-1/2/3 with measurable thresholds — error class, response time in ms, message field requirements."
  ]
}
```
