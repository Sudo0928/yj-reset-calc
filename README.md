# 여고리셋 계산기 (yj-reset-calc)

"여고생과 리셋중" 모바일 게임을 위한 비공식 데이터 / 수치 계산 사이트.

- 배포: https://Sudo0928.github.io/yj-reset-calc/
- 출처: [네이버 게임 라운지](https://game.naver.com/lounge/reworld/home)
- 라이선스: 사이트 코드는 추후 결정. 게임 스프라이트는 원작사 허락 하 사용.

## 개발

```bash
npm install
npm run dev      # 로컬 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
npm run typecheck
npm run lint
npm run format
```

Node 20 LTS 권장 (`.nvmrc` 참고).

## 환경 변수

`.env.local` 파일을 만들고 `.env.example` 키들을 채운다. Phase 2 진입 전까지는 비워두어도 동작한다 (Firebase 미사용).

## 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 GitHub Pages에 배포한다 (`.github/workflows/deploy.yml`).

GitHub repo Settings → Secrets and variables → Actions에 `VITE_FIREBASE_*` 6개 키를 등록해야 빌드가 통과한다 (현재는 빈 값이어도 빌드 가능).

## 단계 진행

상세 계획: `~/.claude/plans/1-goofy-harbor.md`

| Phase | 내용 | 상태 |
|---|---|---|
| 0 | 프로젝트 초기화 + GitHub Pages 첫 배포 | 진행 중 |
| 0.5 | MHTML 추출 도구 | |
| 1 | 픽셀 디자인 시스템 + 슬롯 골격 | |
| 2 | Firebase Auth + Firestore + JSON I/O | |
| 3 | 데미지 계산기 (모드 A) ★MVP | |
| 4 | 골드/파편/슬라임 계산기 ★MVP | |
| 5 | 상자 EV 계산기 ★MVP | |
| 6 | 팁/FAQ/용어사전 + 검색 ★MVP | |
| 7~ | 운영, i18n, Phase 10 슬롯 자동 lookup, Phase 11 가성비 추천 | |
