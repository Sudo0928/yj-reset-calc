# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

"여고생과 리셋중" (한국 모바일 로그라이크/방치형 게임)의 **비공식** 데이터·수치 계산 사이트 (`yj-reset-calc`).
원작사가 공식 수치를 공개하지 않아, 모든 공식·확률은 네이버 게임 라운지 커뮤니티의 역산 추정치(±5%)이며 디스클레이머가 필수다.

- 배포: https://Sudo0928.github.io/yj-reset-calc/ (GitHub Pages, 자동 배포)
- 1차 출처: 네이버 게임 라운지 글 (WebFetch는 인증 차단됨 → MHTML 로컬 파싱)

## 명령어

```bash
npm run dev         # 로컬 개발 서버 (http://localhost:5173)
npm run build       # tsc -b && vite build (타입체크 포함)
npm run typecheck   # tsc -b --noEmit
npm run lint        # eslint .
npm run format      # prettier (src/**/*.{ts,tsx,css,json})
npm run preview     # 빌드 결과 로컬 미리보기
npm test            # vitest run (1회 실행, 103 tests)
npm run test:watch  # vitest 감시 모드
```

단일 테스트 파일 실행: `npx vitest run src/calculators/damage/formula.test.ts`
특정 테스트만: `npx vitest run -t "치명타 배수"` (이름 매치)

Node 20 LTS (`.nvmrc`). GitHub Actions가 `main` push 시 typecheck → build → Pages 배포. 빌드 실패는 대개 typecheck 오류.

## 핵심 아키텍처

### Firebase는 옵셔널 (오프라인 우선)
`src/lib/firebase/client.ts`의 `getFirebaseApp()`은 `VITE_FIREBASE_API_KEY` 미설정 시 `null`을 반환한다. 이게 전체 앱의 분기점:
- 환경변수 없음 → LocalStorage-only로 완전 동작 (Zustand persist, key `yjreset:userData`)
- 환경변수 있음 → Auth + Firestore 활성화

**새 기능 추가 시**: Firebase 미설정 환경에서도 동작하는지 반드시 확인. `isFirebaseReady()` 체크 후 분기.

### 라우팅 (HashRouter)
`src/router.tsx` — GitHub Pages SPA 404 우회를 위해 BrowserRouter 대신 HashRouter (`#/damage` 형태). 활성 라우트: `/`, `/stats`, `/hourly`, `/decisions`, `/compare`, `/dps`, `/damage`, `/gold`, `/chest`, `/tips`, `/my-data`, `/dev/components` (DEV).

`/compare`는 `?b=...` 쿼리에 base64로 좌·우 빌드를 인코딩 — 새 탭에서 열면 자동 디코딩 (`src/lib/storage/buildShareUrl.ts`).

### 입력 모델 (모드 B 영구 폐기 — 2026-04-26 재계획)
- **단일 모델**: 사용자가 인게임 스펙창의 33개 필드 + 환경을 직접 입력. 카드 효과·동료 특성·장비 옵션은 게임이 합산값에 이미 반영하므로 별도 카탈로그 없음.
- **구 Phase 10·11(원신식 슬롯 자동 lookup + 가성비 추천 엔진)**: 게임사 비공개 + 크라우드소싱 비현실로 정식 폐기. `src/components/slots/`는 시각화 잔재로만 보존.
- **신규 Phase 8~11** (모두 구현됨): `/stats` 통합 입력 → `/hourly`(시간당 자원), `/decisions`(다이아 ROI), `/compare`(빌드 비교), `/dps`(DPS 분해)에서 공유 사용.

### 통합 입력 스토어 (Phase 8 신설)
신규 4개 페이지(`/hourly`, `/decisions`, `/compare`, `/dps`)는 모두 `useStatsStore`(`src/store/statsStore.ts`, LocalStorage 키 `yjreset:stats`) 한 곳에서 33필드 + 환경 + **assumptions**를 읽어온다. 사용자는 `/stats`에서 한 번만 입력하면 됨. 33필드 메타정보는 `src/data/statsSchema.ts`의 `STAT_FIELDS` (그룹: `girl`/`drone`/`companion`/`effect`).

### Assumptions store (Phase 12.3 신설)
추정치 5종(치명타 기본 배수×3, DPS 평타·스킬 비중, 슬라임 합성/시간, 광제 일일 절약 분, 달빛 ROI)을 `useStatsStore.assumptions`로 노출하여 사용자가 보정 가능. **모든 calc formula는 `assumptions` 인자를 옵셔널로 받고**, 미지정 시 `DEFAULT_ASSUMPTIONS` 사용 (기존 호출부 호환). `/stats` 하단 "고급 가정" 아코디언에서 변경 가능.

매직넘버는 절대 formula 안에 박지 말 것 — 새로운 추정치가 생기면 `AssumptionsInput`에 필드 추가 + `ASSUMPTION_FIELDS`에 메타 추가.

별도로 기존 `useUserDataStore`(`yjreset:userData`)는 **프리셋·커스텀 데이터** 보관용. `/stats`에서 빌드 프리셋을 저장하면 `presets[].calcId === 'stats'`로 분류된다.

### 게임 숫자 단위 파싱
게임은 1000진법 단위(K/M/G/T)로만 표시 (한국식 京/垓 미사용). `src/lib/format/number.ts`의 `parseGameNumber("247.2G")` / `formatGameNumber(n)` 사용. **공격력 같은 큰 수 입력창은 반드시 `parseGameNumber`로 받기** — 사용자가 "247.2G" 형태로 입력함.

### 계산기 폴더 구조
`src/calculators/<name>/` 패턴 (현재 `damage`, `gold`, `chest`, `hourly`, `decisions`, `compare`, `dps` 7종):
- `types.ts` — 입력/결과 타입 + `DEFAULT_INPUT`
- `formula.ts` — 순수 계산 함수 (React 의존 없음, 테스트 대상)
- `formula.test.ts` — Vitest 단위 테스트 (현재 75 tests, 데미지편/골드편/DPS 비교/자원시뮬 포함)
- `<Name>Calculator.tsx` — UI 컴포넌트
- 페이지는 `src/pages/<Name>.tsx`에서 래핑

### 민감도 계산 함정 ⚠️
`calcDamage`가 `calcSensitivity`를 호출하고 `calcSensitivity`가 다시 `calcDamage(modified)`를 호출하므로, 재귀 가드가 필요. `calcDamage(input, _withSensitivity=false)` 시그니처가 그 가드. 새 계산기에서 비슷한 민감도 패턴을 만들 때 동일하게 처리.

### 시뮬레이션은 시드 고정 PRNG
몬테카를로/난수 기반 계산은 항상 시드 고정해서 재현 가능하게. `src/calculators/chest/formula.ts`의 `mulberry32(seed)` 패턴 따를 것 (시드 42 기본). 테스트에서 `r1.monteCarlo.mean === r2.monteCarlo.mean` 회귀 검증 가능.

### Zustand inline selector 무한 렌더 함정 ⚠️
`useXxxStore((s) => s.list.filter(...))` 형태는 **매 렌더마다 새 배열 참조를 반환** → Zustand가 "상태 변경"으로 감지 → 재렌더 → 무한 루프 → React Error #185 ("Too many re-renders").

```tsx
// ❌ 무한 렌더
const items = useUserDataStore((s) => s.presets.filter((p) => p.calcId === 'stats'));

// ✅ 올바른 패턴
const allPresets = useUserDataStore((s) => s.presets);
const items = useMemo(() => allPresets.filter((p) => p.calcId === 'stats'), [allPresets]);
```

`filter`, `map`, `slice` 등 새 배열을 리턴하는 selector는 항상 `useMemo`로 감싸야 함.

### 데이터 파일 (`src/data/`)
모든 게임 수치는 여기에 모임. 채워진 파일:
- 기본: `damage.ts`, `worldLimits.ts`(1~16단계), `gold.ts`, `chests.ts`, `glossary.ts`, `tips.ts`
- 통합 입력: `statsSchema.ts` (33필드 + AssumptionsInput, `splice` 없이 선언 시점에 완전 정의할 것)
- Phase 12.2 (이미지 분석 추가): `bossDespair14.ts` (14단계 절망 1~100층 보스 HP/피격), `skills.ts`, `costumes.ts` (R/SR/SSR 레벨업 계수), `companionTraits.ts`, `dungeons.ts`
- Phase 12.4 (운영 데이터): `runes.ts` (특성 룬 비용), `hearts.ts` (하트 환율), `vipPack.ts` (VIP팩 30일 누적 가치), `mileage.ts`, `synthesisReward.ts` (50회당 무한 보상) 미작성/부분 작성 파일은 빈 stub + `// TBD` 주석으로 시작 → MHTML 검토 후 점진적으로 채움. 파일 상단에 **반드시 출처 주석** (`// 출처: 네이버 라운지 — XXX편 (작성자, YYYY-MM-DD)`).

`tips.ts` / `glossary.ts`는 정적 콘텐츠. `tips.ts`는 라운지 본문 무단 전재 금지 — `summary` + `body[]` (요약 불릿) + `source` (작성자/날짜/URL) 구조 유지.

### MHTML 추출 도구 (`tools/mhtml-extract/`)
일회성 도구. `Information/`의 MHTML 32개를 `tools/mhtml-extract/out/<글제목>/{text.md, images/*, meta.json}`로 풀어냄. 둘 다 gitignore. Phase 12.1에서 `extract.mjs`를 보강 — 이제 base64 임베드 이미지를 PNG로 풀고 HTML src를 로컬 경로로 치환. 1120개 이미지가 추출되어 `Read` tool로 시각 분석 가능.

**추출 결과를 사이트에 자동 임포트하지 말 것** — 표가 이미지인 경우가 많아 사람/LLM 시각 검토 후 `src/data/*.ts`로 수동 매핑. (예: `bossDespair14.ts` 100층은 Phase 12.2에서 표 이미지 직접 분석으로 추출)

### Tailwind v4
`@tailwindcss/vite` 플러그인 사용. `@theme` 토큰 + 픽셀 디자인 시스템 (`src/components/pixel/`). 픽셀 폰트 Galmuri11 + `-webkit-font-smoothing: none` 필수.

### TypeScript 엄격 설정
`strict` + `noUncheckedIndexedAccess` + `noUnusedLocals/Parameters` + `verbatimModuleSyntax`. `import type`을 type-only 임포트에 명시적으로 사용해야 빌드 통과. 배열 인덱스 접근은 `T | undefined`로 좁혀짐.

알리아스: `@/` → `src/`.

## 작업 시 주의사항

- **저작권**: 라운지 글 본문을 사이트에 무단 전재하지 말 것. 요약 + 출처 링크 또는 사용자 본인 작성 글만 직접 인용.
- **데이터 디스클레이머**: 모든 계산기 결과 패널에 "추정치, 인게임과 ±X% 오차 가능" 명시 + 출처 주석.
- **단계적 도입**: 게임의 등급별·레벨별 정확한 수치를 우리가 모르므로 모드 A로 시작. 한 번에 모드 B까지 만들지 말 것.
- **Phase 진행**: `~/.claude/plans/1-goofy-harbor.md` 상세 계획. Phase 0~12 모두 완료. Phase 12 (최종 완성): 이미지 추출 도구 + 7개 글 시각 분석 → `bossDespair14.ts`(100층) 등 신규 데이터 9종, assumptions 보정 UI, 의사결정 신규 카드 4종, Tips/용어사전 보강, slot 컴포넌트 제거. 잔존 백로그: i18n, SEO 강화, PWA. 구 Phase 10·11(원신식 lookup + 추천 엔진)은 영구 폐기.
- **검증 시나리오**: 데미지편 예시값 (공격력 55.7M, 모든피해량증가 101% 등)으로 사용자 측정값과 ±2% 일치 확인. `formula.test.ts`에 회귀 테스트로 박혀 있음.
