---
story_key: '{story_key or "n/a"}'
date: '{date}'
author: '{user_name}'
mode: '{P | L}'
mockup_source: '{where the mockup came from — design-handoff auto-draft / converted / user-supplied}'
target: '{story path (P) | app base URL (L)}'
screens: {n}
status: '{open | fixed | routed}'
---

# 목업 충실도 리포트 — {date}

## 1. 대상

| | |
|---|---|
| 모드 | {P 개발 전 문서 대조 / L 개발 후 실행 화면 대조} |
| 목업 | {paths} |
| 비교 대상 | {story path / app URL} |
| 화면 매핑 | {n}개 매핑 / {n}개 미매핑 |
| 스펙 아티팩트 | `{spec_dir}/` |
| 브라우저 | {mockup side} / {live side} |

미매핑 화면이 있으면 여기 이름을 적는다. 조용히 빠지면 커버된 것처럼 보인다.

## 2. 요약

| 심각도 | 건수 | 라우팅 |
|---|---|---|
| F0 누락 기능 | {n} | quick-story |
| F1 구조 불일치 | {n} | quick-story |
| F2 토큰 드리프트 | {n} | 즉시수정 {n} / quick-story {n} |
| F3 카피 불일치 | {n} | 즉시수정 {n} / quick-story {n} |
| F4 허용범위 | {n} | 보고만 |

`[ADDED]` {n}건 · 목업 자체 문제 {n}건 · 미확정 {n}건

## 3. 화면별 findings

### {screen slug}

| 심각도 | 섹션 | Finding | 목업 | 구현 | 라우팅 | 대상 파일 |
|---|---|---|---|---|---|---|
| F2 | S3 | 기본 버튼 배경색 | `#2563eb` | `#3b82f6` | 즉시수정 | `src/…` |

증거는 재현 가능한 수준으로 적는다. "대충 다름"이 아니라 무엇을 눌러서 무엇을 봤는지.

깨끗한 화면도 `이상 없음 ✅` 으로 남긴다 — 검증했다는 사실 자체가 결과다.

## 4. 근본 원인 그룹

여러 finding이 한 원인에서 나오면 여기서 한 번만 이름 붙인다. 토큰 정의 한 곳이 틀려서 아홉 군데가 어긋난 것은 finding 아홉 개가 아니라 하나다.

- **{root cause}** → 증상 {n}건 ({finding ids}) → {단일 수정 지점}

## 5. `[ADDED]` — 구현에만 있는 것

목업에 없다고 자동으로 지우지 않는다. 실제 구현은 정적 시안이 안 그린 것을 정당하게 갖는다 (로딩 인디케이터, 검증 메시지, 포커스 링).

| 항목 | 섹션 | 판단 필요 |
|---|---|---|

## 6. 목업 자체 문제

구현 탓이 아닌 것. `design-handoff` 로 돌려보낼 항목.

| 항목 | 무엇이 문제인가 |
|---|---|

## 7. 조치

### 즉시 수정함

| Finding | 파일 | 변경 | 재검증 |
|---|---|---|---|

재검증 열은 수정 후 해당 화면 스펙을 다시 뽑아 그 finding이 사라졌는지 확인한 결과다. 비어 있으면 수정은 미확인 상태다.

### quick-story 로 넘김

| Finding | 이유 | 스토리 key |
|---|---|---|

### Mode P — 문서 반영

| 추가 위치 | 내용 | 스펙 앵커 |
|---|---|---|
| AC #{n} | Given … When … Then … | S5 / … |
| Task {n}.{n} | … | S5 / … |
| Dev Notes | … | S3 / … |

## 8. 미확정

재검증에서 확정도 반증도 안 된 것. 깔끔해 보이려고 확정으로 올리지 않는다.

| 항목 | 왜 미확정인가 | 확인하려면 |
|---|---|---|
