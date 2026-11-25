# 코드 리뷰 체크리스트

## 규칙 요약

| 항목 | 규칙 |
|------|------|
| 파일 규모 | 단일 파일 500줄 이상이면 분리 검토 (컴포넌트/훅/유틸로 역할 분리) |
| 타입 | 공유 시 `types/` 폴더에 정의, 단일 파일 전용은 해당 파일 내부에 |
| 상수 | 항상 컴포넌트 외부(파일 상단)에 정의, **함수는 constants에 금지** |
| 유틸 | 공유 시 `utils/` 폴더에 정의, 단일 파일 전용은 해당 파일 내부에 |
| 훅 위치 | 컴포넌트에서 추출한 훅은 `hooks/` 폴더에 배치 (`views/` 내부 X) |
| 비동기 스타일 | `.then()/.catch()` 대신 `async/await` 사용 (일관성, 가독성) |
| 데이터 변환 | 항상 훅에서 처리 (서비스 X) |
| 참조 무결성 | React Query 캐시 데이터 직접 참조 지양, 필요 시 파라미터로 전달 |
| 경고 메시지 | 확인 필요 → 모달(ConfirmModal), 단순 알림 → 토스트(Toast) |
| 주석 | story, epic, AC 등 내부 문서 참조 금지 |
| 모바일일 경우일때만 공통 컴포넌트 | `@org/shared` 먼저 확인 후 직접 구현 |
| 테스트 위치 | 테스트는 소스와 같은 폴더의 `__tests__/` 하위에 배치 (소스 옆 흩뿌림 X) |
| 전역 변경 | 전역 CSS·설정 파일을 고치면 **그 규칙이 닿는 다른 화면을 먼저 열거**하고, 선택자는 기능 스코프로 감싼다 |

| 네이밍 대상 | 스타일 | 예시 |
|------------|--------|------|
| 컴포넌트 파일 | PascalCase | `StudentItem.tsx` |
| 훅/유틸 파일 | camelCase | `useScheduleCreation.ts` |
| 폴더 | kebab-case | `schedule-board/` |
| 상수 변수 | UPPER_SNAKE_CASE | `MIN_HEIGHT` |
| 이벤트 핸들러 | handle + 동작 | `handleClick` |
| 불리언 | is/has/can + 의미 | `isLoading` |

---

## 체크리스트

### 파일 규모
- [ ] 파일이 **500줄 이상**인가? → 분리 필요 여부 검토
- [ ] 하나의 파일이 너무 많은 역할(컴포넌트 + 훅 로직 + 유틸 등)을 하고 있지 않은가?
- [ ] 분리한다면 컴포넌트 / 커스텀 훅 / 유틸 중 어디로 빼는 게 적절한가?

> 💡 **판단 기준**: "이 파일에서 독립적으로 꺼내도 되는 덩어리가 있나?" — 있으면 분리 검토

### 테스트 파일 위치
- [ ] 테스트 파일을 소스와 같은 폴더의 `__tests__/` 하위에 두었는가? (소스 파일 옆에 흩뿌리지 않기)
- [ ] 같은 폴더에 이미 `__tests__/`가 있다면 새 테스트도 동일 위치에 두었는가? (co-locate / `__tests__` 혼재 방지)

> ⚠️ **잘못된 예시**: `utils/schedule-board/common/scheduleConverter.test.ts` (소스 옆 co-locate)
> ✅ **권장**: `utils/schedule-board/common/__tests__/scheduleConverter.test.ts`
> 💡 이동 시 import 경로 `./module` → `../module` 보정, `git mv` 로 히스토리 보존.

### 타입
- [ ] 공유 타입은 `types/[feature].ts`에 정의했는가?
- [ ] 단일 파일 전용 타입은 해당 파일 내부에 정의했는가? (불필요한 분리 지양)
- [ ] 공통 타입 폴더에 이미 정의된 타입을 중복 정의하지 않았는가?
- [ ] 서비스/유틸 파일 내부에 공유 타입을 정의하지 않았는가?

### 상수
- [ ] 상수는 컴포넌트 함수 외부에 정의했는가?
- [ ] 매직 넘버 대신 의미 있는 상수명을 사용했는가?
- [ ] **constants 파일에 함수를 정의하지 않았는가?** (함수는 `utils/`로 분리)

### 유틸
- [ ] 공유 유틸은 `utils/[feature].ts`에 정의했는가?
- [ ] 단일 파일 전용 유틸은 해당 파일 내부에 정의했는가? (불필요한 분리 지양)
- [ ] 공통 utils 폴더에 이미 정의된 함수를 중복 구현하지 않았는가?
- [ ] constants 파일에 있던 함수를 utils로 분리했는가?
- [ ] **2개 이상 파일에서 같은 동작의 함수를 정의하지 않았는가?** (한 번이라도 중복하면 `utils/` 로 추출)

> ❌ 잘못된 예시 — 두 파일에 거의 동일한 hex `#` 제거 함수
> ```ts
> // file A
> const stripHashPrefix = (color: string) => color.startsWith('#') ? color.slice(1) : color
>
> // file B
> const stripHash = (color: string): string => color.startsWith('#') ? color.slice(1) : color
> ```
>
> ✅ 권장 — 공유 유틸 1개
> ```ts
> // utils/colorHex.ts
> export const stripHashPrefix = (color: string): string =>
>   color.startsWith('#') ? color.slice(1) : color
>
> // file A, B 모두 import 해 사용
> ```

### 서비스 / 훅
- [ ] 서비스는 순수 API 호출만 하는가?
- [ ] 데이터 변환은 훅의 `select` 옵션에서 처리하는가?
- [ ] 컴포넌트에서 추출한 커스텀 훅은 `hooks/` 폴더에 배치했는가? (`views/` 내부에 훅 파일 금지)
- [ ] 비동기 처리에 `.then()/.catch()` 대신 `async/await`를 사용했는가?
- [ ] **`queryFn` 안에서 응답 데이터를 변환하지 않았는가?** (변환은 `select` 옵션 또는 전용 훅으로)
- [ ] **mutation 호출 + 옵티미스틱 캐시 변환 + 롤백 로직을 컴포넌트 콜백에 인라인으로 작성하지 않았는가?** (전용 훅으로 추출, 컴포넌트는 호출만)

> ❌ 잘못된 예시 — `queryFn` 안 변환
> ```tsx
> useQueries({
>   queries: items.map(item => ({
>     queryKey: [KEY, item.id],
>     queryFn: async () => {
>       const raw = await fetchData(item.id)
>       return adaptListResponse<Item>(raw)  // ❌ 변환 인라인
>     }
>   }))
> })
> ```
>
> ✅ 권장
> ```tsx
> useQueries({
>   queries: items.map(item => ({
>     queryKey: [KEY, item.id],
>     queryFn: () => fetchData(item.id),
>     select: (raw) => adaptListResponse<Item>(raw)  // ✅ select 로 분리
>   }))
> })
> ```

### 참조 무결성
- [ ] 다른 Query 훅의 캐시 데이터를 직접 참조하지 않았는가?
- [ ] 부모 컴포넌트에서 필요한 데이터를 props/파라미터로 전달받고 있는가?
- [ ] 연관 데이터 변경 시 자동 갱신되는 구조인가? (invalidateQueries 활용)
- [ ] **컴포넌트에서 `queryClient.setQueryData` / `getQueryData` 직접 호출하지 않았는가?** (옵티미스틱은 mutation hook 의 `onMutate`/`onError`/`onSettled` 에 캡슐화)
- [ ] **서버 데이터의 local mirror state (useState + useEffect 동기화) 를 만들지 않았는가?** (진실 원본은 react-query 캐시 1개로 유지)

> ⚠️ **잘못된 예시**: BottomSheet 컴포넌트가 `useScheduleTasksQuery()`를 직접 호출
> ✅ **올바른 예시**: 부모가 데이터를 조회하고 BottomSheet에 props로 전달
>
> ❌ 잘못된 예시 — 컴포넌트에서 직접 캐시 조작
> ```tsx
> const previousData = queryClient.getQueryData(subjectQueryKey)
> queryClient.setQueryData(subjectQueryKey, (old: any) => ({ ...old, ... }))
> mutate(payload, {
>   onError: () => queryClient.setQueryData(subjectQueryKey, previousData)
> })
> ```
>
> ✅ 권장 — mutation hook 안 캡슐화
> ```ts
> // hooks/queries/.../useFeatureItemUpdateMutation.ts
> return useMutation({
>   onMutate: async (vars) => {
>     await queryClient.cancelQueries({ queryKey })
>     const previousData = queryClient.getQueryData(queryKey)
>     queryClient.setQueryData(queryKey, (old) => /* 변환 */)
>     return { previousData }
>   },
>   onError: (_, __, ctx) => queryClient.setQueryData(queryKey, ctx?.previousData),
>   onSettled: () => queryClient.invalidateQueries({ queryKey })
> })
> ```
>
> ❌ 잘못된 예시 — server 데이터 local mirror
> ```tsx
> const [localPlans, setLocalPlans] = useState(plans)
> useEffect(() => { setLocalPlans(plans) }, [plans])
> // 드래그 시 setLocalPlans + handleDragRow 동시 호출
> ```
>
> ✅ 권장 — mutation `onMutate` 가 setQueryData 로 옵티미스틱 → 부모가 정상 props 흘려줌
> ```tsx
> // 자식은 plans props 만 신뢰. mirror state 없음.
> ```

### 경고 메시지 (UX)
- [ ] 사용자 확인이 필요한 경고는 **모달(ConfirmModal)**을 사용했는가?
- [ ] 단순 알림/피드백은 **토스트(Toast)**를 사용했는가?
- [ ] Alert.alert() 대신 프로젝트 공통 컴포넌트를 사용했는가?

| 상황 | 사용할 컴포넌트 |
|------|----------------|
| 삭제 확인, 저장 확인 등 | `ConfirmModal` |
| 성공/실패 알림, 유효성 경고 | `Toast` |
| 중요 정보 안내 (확인만) | `ConfirmModal` (취소 버튼 숨김) |

### 주석
- [ ] story, epic, AC, NFR 같은 내부 문서 참조 주석이 없는가?
- [ ] `_bmad-output/`, `planning-artifacts/` 같은 내부 경로 주석이 없는가?
- [ ] **외부 식별자 (백엔드 내부 함수명, 옛 레포명, 다른 시스템 식별자) 참조 주석이 없는가?**

> ❌ 잘못된 예시
> ```ts
> // 백엔드 _sync_attend_day 와 동치: 콘텐츠 남아있으면 등원일 유지
> // (api-epx updateMemo 의 null daily_id 분기와 동일 의미)
> ```
>
> ✅ 권장
> ```ts
> // 콘텐츠가 남아있으면 등원일 유지, 비면 OFF — 백엔드가 동기화한다
> // 단건 PATCH 는 daily_id 필수이므로 빈 셀 신규 케이스는 batch upsert 로 처리
> ```
>
> 💡 **이유**: 백엔드 내부 함수명 / 레거시 레포명은 리네이밍·삭제 시 주석이 거짓이 되고, FE 리더가 의미 추적 위해 다른 코드베이스를 뒤져야 함. 의도·계약은 도메인 용어로 적는다.

### 공통 컴포넌트 (shared)
- [ ] `@org/shared`에 동일/유사한 컴포넌트가 있는지 확인했는가?
- [ ] 직접 만든 컴포넌트가 shared 컴포넌트로 대체 가능하지 않은가?

<details>
<summary>📦 @org/shared 컴포넌트 목록</summary>

| 카테고리 | 컴포넌트 |
|----------|----------|
| **common** | `Button`, `IconButton`, `Badge`, `Input`, `Text`, `Divider`, `PageLayout`, `SegmentedTabs` |
| **modal** | `BottomSheet`, `SelectBottomSheet`, `ConfirmModal`, `FullScreenModal`, `GestureBottomSheet`, `Modal`, `Popover` |
| **auth** | `CountdownTimer`, `IdPasswordForm`, `PhoneInput`, `OTPInput`, `AgreementCheckbox` |
| **keypad** | `NumberKeypad`, `PinDots` |
| **schedule** | `ScheduleHeader`, `WeeklyView`, `DetailView`, `FeaturePlannerView` 등 |

</details>

### 전역 변경의 영향 범위 (블라스트 반경)

- [ ] **전역 파일을 수정했는가?** (`styles/globals.css`, `src/@core/**`, `src/types/**`, `_app.tsx`, `tailwind.config`, 공용 `utils/`)
- [ ] 수정했다면 **그 규칙이 닿는 다른 화면을 실제로 열거했는가?** (추측 말고 `grep` 으로)
- [ ] 전역 선택자를 **기능 스코프로 감쌌는가?** — 전역 파일에 `body *`, `html`, 태그 셀렉터를 조건 없이 쓰지 않는다
- [ ] 이 변경으로 **꺼진(기능 밖) 상태가 현행과 동일한가?** — "기능을 켠 화면"만 확인하고 끝내지 않는다

> ❌ 잘못된 예시 — 전역 `@media print` 에 무조건 걸리는 규칙
> ```css
> /* styles/globals.css */
> @media print {
>   body *:not(.board-print-document):not(.board-print-document *):not(:has(.board-print-document)) {
>     display: none !important;
>   }
> }
> ```
> `.board-print-document` 가 **없는** 페이지에서 인쇄하면 `body` 의 모든 자식이 세 `:not()` 을 전부
> 만족해 전부 사라진다 → **빈 종이**. 해당 기능이 없는 화면의 인쇄가 전부 죽는다.
>
> ✅ 권장 — 기능이 실행 중일 때만 걸리도록 스코프
> ```css
> @media print {
>   body[data-board-print-active='true'] *:not(.board-print-document):not(...) {
>     display: none !important;
>   }
> }
> ```
>
> 💡 **이유**: `styles/globals.css` 는 이름 그대로 전역이다. "우리 화면에서는 인쇄 대상이 하나뿐"
> 이라는 전제는 **그 화면 안에서만** 참이다. 다른 화면(리포트 등)이 함께 죽을 수 있다.
> 소비처 확인은 `grep -rn "window.print" src` 30초면 끝난다.

### 테스트가 이 변경을 실제로 덮는가

- [ ] **"테스트 N개 통과"를 근거로 쓰기 전에, 그 변경을 덮는 테스트가 존재하는지 확인했는가?**
- [ ] 전역 CSS / `@media print` / 브라우저 전용 동작을 고쳤다면 — **jsdom 은 이를 평가하지 않는다**는 것을 알고 있는가
- [ ] 자동 테스트가 닿지 않는 변경이면, **소비처를 열거하고 최소 1곳을 직접 확인했는가?**

> 💡 **이유**: `vitest.config` 에 `css` 옵션이 없으면 기본값은 `false` 라 CSS import 가 no-op 으로
> 스텁된다. `globals.css` 는 `_app.tsx` 에서만 import 되는데 테스트는 `_app.tsx` 를 렌더하지 않는다.
> 즉 **전역 CSS 를 덮는 테스트는 0개**다. 그 상태에서 "2213개 통과"는 이 변경에 대해 아무것도
> 보증하지 못한다. 커버리지가 없는 영역을 통과 숫자로 덮지 않는다.

---

## PR 전 확인

```bash
pnpm typecheck && pnpm lint && pnpm test:cm
```

---

## 📋 네이밍 컨벤션

### 파일명 규칙

| 파일 유형 | 네이밍 스타일 | 예시 |
|-----------|---------------|------|
| 컴포넌트 | PascalCase | `StudentItem.tsx` |
| 훅 | camelCase | `useScheduleCreation.ts` |
| 유틸리티 | camelCase | `timeUtils.ts` |
| 상수 | camelCase | `gridConstants.ts` |
| 타입 | camelCase | `weeklyDragDrop.ts` |

> ⚠️ **주의**: 타입/훅/유틸 파일은 **kebab-case가 아닌 camelCase**입니다!
> - ❌ `weekly-drag-drop.ts`
> - ✅ `weeklyDragDrop.ts`

### 변수명 규칙

| 변수 유형 | 네이밍 스타일 | 예시 |
|-----------|---------------|------|
| 상수 변수 | UPPER_SNAKE_CASE | `const MIN_HEIGHT = 100` |
| 일반 변수 | camelCase | `const isLoading = true` |
| 이벤트 핸들러 | handle + 동작 | `handleClick` |
| Ref 변수 | 의미 + Ref | `schedulerRef` |
| 불리언 | is/has/can + 의미 | `isLoading`, `hasError` |

### 폴더명 규칙

| 폴더 유형 | 네이밍 스타일 | 예시 |
|-----------|---------------|------|
| 뷰/페이지 | kebab-case | `schedule-board/` |
| 훅 폴더 | kebab-case | `queries/daily-view/` |
| 컴포넌트 | camelCase | `scheduleBoard/` |
| 테스트 | `__tests__/` | `utils/schedule-board/common/__tests__/` |

---

## 📋 React Query 훅 네이밍 컨벤션


| 유형 | 패턴 | 예시 |
|------|------|------|
| 조회 | `use` + 뷰이름 + 기능 + `Query` | `useDailyViewItemsQuery` |
| 생성 | `use` + `Create` + 기능 + `Mutation` | `useCreateScheduleMutation` |
| 수정 | `use` + `Update` + 기능 + `Mutation` | `useUpdateScheduleMutation` |
| 삭제 | `use` + `Delete` + 기능 + `Mutation` | `useDeleteScheduleMutation` |

---

## 📋 타입/인터페이스 네이밍 컨벤션

> `@org/shared` 패턴 기준 (weeklyView.ts, selfLeader.ts 참고)

### 용도별 접미사

| 용도 | 접미사 | 예시 |
|------|--------|------|
| API 응답 목록 컨테이너 | `~Response` | `AcademicSchedulesResponse`, `ScheduleTaskListResponse` |
| API 응답 개별 항목 | `~Item` | `AcademicScheduleItem`, `PlanItem`, `ScheduleTaskItem` |
| API 상세 조회 | `~Detail` | `LearningPlanDetail`, `SelfLeaderPlanDetail` |
| API 요청 | `~Request` | `CreateWeeklyPlanRequest`, `CreateDcRequest` |
| API 요청 내부 데이터 | `~Data` | `CreateWeeklyPlanData`, `UpdateLearningPlanData` |
| 파라미터 | `~Params` | `PlansRangeParams`, `AcademicSchedulesParams` |
| UI 도메인 모델 | (접미사 없음) | `SelfLeaderPlan`, `WeekDay`, `ScheduleTask` |
| 컴포넌트 Props | `~Props` | `TaskChipProps`, `WeeklyViewEventBlockProps` |

### 피해야 할 패턴

| ❌ 피하기 | ✅ 권장 | 이유 |
|-----------|---------|------|
| `ApiScheduleTask` | `ScheduleTaskItem` | `Api` 접두사는 구현 세부사항 노출 |
| `ItemResponse` | `Item` | 항목에 `Response` 중복 불필요 |

### 구조 예시

```
API 요청:
  CreateWeeklyPlanRequest
  └── data: CreateWeeklyPlanData (내부 데이터)

API 응답 (목록):
  ScheduleTaskListResponse
  └── items: ScheduleTaskItem[] (개별 항목)

API 응답 (상세):
  SelfLeaderPlanDetail (단일 객체)

UI 모델:
  ScheduleTask (접미사 없음, 앱 내부에서 사용)
```
