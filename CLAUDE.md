# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

"여고생과 리셋중" (한국 모바일 로그라이크/방치형 게임)의 **비공식** 데이터·수치 계산 사이트 (`yj-reset-calc`).
원작사가 공식 수치를 공개하지 않아, 모든 공식·확률은 네이버 게임 라운지 커뮤니티의 역산 추정치(±5%)이며 디스클레이머가 필수다.

- 배포: https://Sudo0928.github.io/yj-reset-calc/ (GitHub Pages, 자동 배포)
- 1차 출처: 네이버 게임 라운지 글 (WebFetch는 인증 차단됨 → MHTML 로컬 파싱)

## 명령어

```bash
npm run dev        # 로컬 개발 서버 (http://localhost:5173)
npm run build      # tsc -b && vite build (타입체크 포함)
npm run typecheck  # tsc -b --noEmit
npm run lint       # eslint .
npm run format     # prettier (src/**/*.{ts,tsx,css,json})
npm run preview    # 빌드 결과 로컬 미리보기
```

Node 20 LTS (`.nvmrc`). 단위 테스트 프레임워크는 아직 미도입 (Phase 7에서 Vitest 도입 예정).

GitHub Actions가 `main` push 시 typecheck → build → Pages 배포. 빌드 실패는 typecheck 오류일 가능성 높음.

## 핵심 아키텍처

### Firebase는 옵셔널 (오프라인 우선)
`src/lib/firebase/client.ts`의 `getFirebaseApp()`은 `VITE_FIREBASE_API_KEY` 미설정 시 `null`을 반환한다. 이게 전체 앱의 분기점:
- 환경변수 없음 → LocalStorage-only로 완전 동작 (Zustand persist, key `yjreset:userData`)
- 환경변수 있음 → Auth + Firestore 활성화

**새 기능 추가 시**: Firebase 미설정 환경에서도 동작하는지 반드시 확인. `isFirebaseReady()` 체크 후 분기.

### 라우팅 (HashRouter)
`src/router.tsx` — GitHub Pages SPA 404 우회를 위해 BrowserRouter 대신 HashRouter (`#/damage` 형태). SEO는 Phase 9+에서 마이그레이션 예정. 미구현 라우트는 `<WipPage>`로 placeholder.

### 두 가지 입력 모드 (현재 모드 A만)
계산기는 처음부터 두 모드를 염두에 두고 설계됨:
- **모드 A** (현재, Phase 3~5): 사용자가 인게임에서 본 최종 수치를 직접 입력
- **모드 B** (Phase 10+): 슬롯 클릭 → 종류·등급·레벨 선택 → `src/data/*.ts`에서 자동 lookup

모드 B용 슬롯 컴포넌트 골격은 `src/components/slots/`에 이미 존재 (BaseSlot, EquipmentSlot 등). `src/data/`의 stub 파일들이 채워지면 모드 B 활성화.

### 데이터 우선순위
계산 시 lookup 우선순위는 **사용자 커스텀 (`useUserDataStore`) > 사이트 기본 (`src/data/*.ts`)**. `src/store/userDataStore.ts`의 `customData` 배열에서 사용자가 등록한 동료 특성/장비/코스튬 등이 우선 적용된다.

### 게임 숫자 단위 파싱
게임은 1000진법 단위(K/M/G/T)로만 표시 (한국식 京/垓 미사용). `src/lib/format/number.ts`의 `parseGameNumber("247.2G")` / `formatGameNumber(n)` 사용. **공격력 같은 큰 수 입력창은 반드시 `parseGameNumber`로 받기** — 사용자가 "247.2G" 형태로 입력함.

### 계산기 폴더 구조
`src/calculators/<name>/` 패턴:
- `types.ts` — 입력/결과 타입 + `DEFAULT_INPUT`
- `formula.ts` — 순수 계산 함수 (React 의존 없음)
- `<Name>Calculator.tsx` — UI 컴포넌트
- 페이지는 `src/pages/<Name>.tsx`에서 래핑

### 민감도 계산 함정 ⚠️
`calcDamage`가 `calcSensitivity`를 호출하고 `calcSensitivity`가 다시 `calcDamage(modified)`를 호출하므로, 재귀 가드가 필요. `calcDamage(input, _withSensitivity=false)` 시그니처가 그 가드. 새 계산기에서 비슷한 민감도 패턴을 만들 때 동일하게 처리.

### 데이터 파일 (`src/data/`)
모든 게임 수치는 여기에 모임. 처음엔 빈 stub + `// TBD` 주석으로 시작 → MHTML 검토 후 점진적으로 채움. 파일 상단에 **반드시 출처 주석** (`// 출처: 네이버 라운지 — XXX편 (작성자, YYYY-MM-DD)`).

### MHTML 추출 도구 (`tools/mhtml-extract/`)
일회성 도구. `Information/`의 MHTML 32개를 `tools/mhtml-extract/out/<글제목>/{text.md, images/*}`로 풀어냄. 둘 다 gitignore. **추출 결과를 사이트에 자동 임포트하지 말 것** — 표가 이미지인 경우가 많아 사람/LLM 검토 후 `src/data/*.ts`로 수동 매핑.

### Tailwind v4
`@tailwindcss/vite` 플러그인 사용. `@theme` 토큰 + 픽셀 디자인 시스템 (`src/components/pixel/`). 픽셀 폰트 Galmuri11 + `-webkit-font-smoothing: none` 필수.

### TypeScript 엄격 설정
`strict` + `noUncheckedIndexedAccess` + `noUnusedLocals/Parameters` + `verbatimModuleSyntax`. `import type`을 type-only 임포트에 명시적으로 사용해야 빌드 통과. 배열 인덱스 접근은 `T | undefined`로 좁혀짐.

알리아스: `@/` → `src/`.

## 작업 시 주의사항

- **저작권**: 라운지 글 본문을 사이트에 무단 전재하지 말 것. 요약 + 출처 링크 또는 사용자 본인 작성 글만 직접 인용.
- **데이터 디스클레이머**: 모든 계산기 결과 패널에 "추정치, 인게임과 ±X% 오차 가능" 명시 + 출처 주석.
- **단계적 도입**: 게임의 등급별·레벨별 정확한 수치를 우리가 모르므로 모드 A로 시작. 한 번에 모드 B까지 만들지 말 것.
- **Phase 진행**: README.md의 Phase 표 + `~/.claude/plans/1-goofy-harbor.md` 상세 계획. Phase 0~3 완료, Phase 4부터 진행 중.
- **검증 시나리오**: 데미지편 예시값 (공격력 55.7M, 모든피해량증가 101% 등)으로 사용자 측정값과 ±2% 일치 확인.
