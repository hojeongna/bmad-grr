# Rubric — AC measurability

An acceptance criterion is **measurable** if a tester (or a Gherkin
scenario) can determine pass/fail from observable behavior alone, without
appealing to internal state or subjective judgment.

**Pass threshold: every AC must be YES.**

## Scoring procedure

1. Locate the artifact's AC section. Look for headers like
   "Acceptance Criteria", "ACs", "수락 기준", or numbered `AC-N` markers.
2. For each AC, apply the four checks below. If all four are YES,
   record `measurable: YES`. Otherwise `measurable: NO` and cite the
   failing check in `issue`.
3. Any AC with `measurable: NO` flips the rubric verdict to `REVISE`.

## Four checks per AC

1. **Clear actor / subject.** Who or what performs the action?
   - PASS: "사용자", "관리자", "시스템 A 컴포넌트", a named external service
   - FAIL: "the system" used as catch-all, no subject ("동작한다"
     without owner), passive voice that hides the actor

2. **Clear trigger / event.** What initiates the behavior?
   - PASS: "버튼 클릭 시", "5초 후", "GET /users/:id 요청 도착 시"
   - FAIL: "when appropriate", "if needed", "필요 시", trigger implied
     but not stated

3. **Measurable outcome.** What changes, and how is it measured?
   - PASS: a number, a state name, a value, an emitted event, an
     observable artifact ("DB row inserted with status='locked'")
   - FAIL: "동작한다", "처리한다" without specifying the change

4. **Outcome observable from outside.** Can a Gherkin Then-clause
   assert it without reading internal state?
   - PASS: "다음 GET 요청에 새 값 반환", "토스트 메시지에 'X' 표시"
   - FAIL: "내부 캐시 무효화" by itself (you cannot observe a cache
     state from outside); must include the external consequence

## Output format per AC

For each AC, append to `ac_measurability` array:

```json
{ "id": "AC-N", "measurable": "YES" }
```
or
```json
{
  "id": "AC-N",
  "measurable": "NO",
  "issue": "<which check failed and why, in one sentence>"
}
```

## Worked example

Artifact ACs:
- AC-1: 사용자가 잘못된 비밀번호를 5회 입력하면 계정이 10분간 잠긴다.
- AC-2: 로그인 페이지는 빠르게 로드된다.
- AC-3: 시스템은 안전하게 동작한다.

Evaluation:

| AC | Actor | Trigger | Outcome | Observable | Result |
|---|---|---|---|---|---|
| AC-1 | 사용자 ✓ | 5회 입력 ✓ | 10분 잠금 ✓ | 다음 로그인 거부 ✓ | YES |
| AC-2 | 로그인 페이지 ✓ | 없음 ✗ | "빠르게" 측정 불가 ✗ | n/a | NO |
| AC-3 | 시스템 ✗ | 없음 ✗ | "안전" 측정 불가 ✗ | n/a | NO |

Output:

```json
{
  "ac_measurability": [
    { "id": "AC-1", "measurable": "YES" },
    { "id": "AC-2", "measurable": "NO", "issue": "no trigger; '빠르게' has no measurable threshold (e.g. 'within 800ms first contentful paint')" },
    { "id": "AC-3", "measurable": "NO", "issue": "no actor named, no trigger, no measurable outcome — entire AC is filler" }
  ]
}
```

Two of three NO → REVISE.

## Common failure modes

- **Compound AC.** "AC-1: 사용자가 로그인하고 대시보드를 본다" combines two
  acceptance events. Recommend split into two ACs in revision pointer.
- **"And handles errors gracefully"** appended to a real AC. The error
  branch needs its own AC with concrete outcomes.
- **Implementation-as-AC.** "AC-2: useUserQuery 훅을 사용한다." — that's an
  implementation choice, not a user-observable acceptance criterion.
  Flag and suggest re-framing in user/observable terms.
