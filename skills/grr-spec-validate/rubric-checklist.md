# Rubric — Checklist conformance

This rubric checks the artifact (typically a story with planned
implementation tasks) against a **project-supplied codebase-convention
checklist**. The checklist path is provided by the main session as a
dispatch input — the sub-agent reads it and applies it.

**Pass threshold: zero HIGH-severity violations.** MEDIUM and LOW are
reported but do not block.

## Scoring procedure

1. Read the file at `checklist_path`.
2. **Parse rules.** Look for:
   - Markdown checkboxes: `- [ ] 규칙 내용`
   - Table rows with a "Rule" / "규칙" / "항목" column
   - Bullet lists under sections like "Naming", "Banned patterns",
     "금지 사항"
3. **For each rule, scan the artifact** (story tasks, AC list,
   implementation notes) for content that would VIOLATE the rule when
   the implementation proceeds as described.
4. **Classify severity** (table below).
5. **Output** every detected violation in `checklist_violations`.
6. Verdict contribution: any HIGH → `REVISE`.

## Severity scale

| Severity | Meaning | Example |
|---|---|---|
| HIGH | Explicit contradiction. The artifact tells the implementer to do something the checklist forbids. | Task says "queryFn 안에서 response 변환" while checklist forbids this exact pattern. |
| MEDIUM | Strong implication. The artifact's wording strongly suggests a violation path even if not stated outright. | "공통 hook 만들지 말고 컴포넌트 안에 작성" against a "공유 hook은 `hooks/` 에 둔다" rule. |
| LOW | Possible / uncertain violation. Worth raising but not blocking. | A task mentions "공통 컴포넌트 직접 구현" without confirming whether `shared` was checked first. |

When uncertain between HIGH and MEDIUM, pick MEDIUM. When uncertain
between MEDIUM and LOW, pick LOW. **Conservatism is correct:** the rubric
should not block borderline cases; it should surface them.

## Output format per violation

```json
{
  "rule": "<exact rule text from the checklist>",
  "location": "<where in the artifact, e.g. 'Task 3' or 'AC-2'>",
  "quote": "<the exact phrase in the artifact that triggered the flag>",
  "severity": "HIGH"
}
```

`severity` is one of `"HIGH"`, `"MEDIUM"`, `"LOW"`.

## What the rubric does NOT do

- Does NOT run code or check actual implementations — no code exists yet
  at spec time.
- Does NOT enforce style on the story document itself (markdown
  formatting, etc.). The checklist applies to the **implementation that
  the story plans**, not to the story doc as text.
- Does NOT invent rules. If the checklist file is missing or empty,
  return `checklist_violations: []` and add a revision pointer
  `"checklist_path empty or unreadable: <path>"`.

## Worked example

Checklist file excerpt:

> - [ ] queryFn 안에서 응답 데이터를 변환하지 않았는가? (변환은 select 또는 전용 훅으로)
> - [ ] 컴포넌트에서 queryClient.setQueryData 직접 호출하지 않았는가?
> - [ ] 파일이 500줄 이상인가? → 분리 필요 여부 검토

Artifact (story Task list):

> Task 2: BottomSheet 컴포넌트에서 직접 queryClient.setQueryData 로 optimistic update 처리.
> Task 3: useDailyView 훅에서 queryFn 으로 fetch 한 후 받은 데이터를 그 안에서 BottomSheet 표시용 모델로 변환한다.

Result:

```json
{
  "checklist_violations": [
    {
      "rule": "queryFn 안에서 응답 데이터를 변환하지 않았는가",
      "location": "Task 3",
      "quote": "queryFn 으로 fetch 한 후 받은 데이터를 그 안에서 ... 변환한다",
      "severity": "HIGH"
    },
    {
      "rule": "컴포넌트에서 queryClient.setQueryData 직접 호출하지 않았는가",
      "location": "Task 2",
      "quote": "BottomSheet 컴포넌트에서 직접 queryClient.setQueryData 로 optimistic update 처리",
      "severity": "HIGH"
    }
  ],
  "revision_pointers": [
    "Task 3 violates checklist rule about queryFn transformation; move the transformation to React Query `select` or a dedicated derivation hook.",
    "Task 2 violates checklist rule about queryClient.setQueryData; encapsulate the optimistic update inside a mutation hook's onMutate/onError/onSettled."
  ]
}
```

Two HIGH violations → REVISE.

## Common failure modes

- **Checklist file not found.** Return empty violations with the
  revision pointer noted above; do NOT block.
- **Checklist contains aspirational text, not enforceable rules.**
  Skip those items silently; record nothing.
- **Story refers to a rule the checklist allows, not forbids.** Do not
  flag — only forbid-style rules generate violations.
