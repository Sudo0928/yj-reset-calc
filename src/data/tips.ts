// 출처: 네이버 게임 라운지 — 각 작성자별 글 (2026-02 ~ 2026-04)
// 본문 무단 전재 금지 — 핵심 요약 + 출처 링크만 노출

export interface Tip {
  id: string;
  title: string;
  category: '신규' | '운영' | '효율' | '스테이지' | '결제' | '버그';
  summary: string;
  body: string[];
  source: { author: string; date: string; url: string };
}

export const TIPS: Tip[] = [
  {
    id: 'newbie-intro',
    category: '신규',
    title: '여고리셋 입문 가이드',
    summary: '게임 첫 진입 유저를 위한 시스템·운영 흐름 요약',
    body: [
      '코스튬 강화는 빛의파편이 핵심 자원 — 슬라임 농장 우선 투자',
      '광고제거(광제) 구매가 가장 가성비 좋음 (상자 30분 단축 효과)',
      '치명타 스탯은 기본 0이며 버프로만 상승 → 풀버프는 후반 목표',
      '14단계(절망)부터 본격적인 어려움 시작 — 보스 체력 매우 높음',
    ],
    source: { author: '시골쥐서울쥐 외', date: '2026-02-25', url: 'https://game.naver.com/lounge/reworld/board/9' },
  },
  {
    id: 'gold-strategy',
    category: '효율',
    title: '골드 수급 핵심 전략',
    summary: '골획 vs 전골획, 등반 vs 무한 모드 효율 비교',
    body: [
      '골획·전골획 모두 곱연산 → 작은 쪽을 올리는 것이 더 효율적',
      '전골획은 명상 + 로얄핫타임으로만 상승 (수단 한정)',
      '신화 골획 버프 효율은 기존 골획이 높을수록 감소 (200% → +15%, 400% → +7.5%)',
      '등반 vs 무한 모드는 시간당 골드 거의 동일 (몬스터 처치수가 핵심)',
      '드론자동공격·개틀링봇 같은 처치수 증가 버프가 골벞보다 효율적일 수 있음',
    ],
    source: { author: 'YUI', date: '2026-04-18', url: 'https://game.naver.com/lounge/reworld/board/detail/7553370' },
  },
  {
    id: 'slime-farm',
    category: '효율',
    title: '슬라임 농장 운영',
    summary: '달빛 충전·새식구·진화 우선순위',
    body: [
      '달빛 충전 1회 = 300다이아 = 100마리 = 약 1.16배 다이아 ROI',
      '슬라임 마스터 팩은 빛의파편 ×2 → 사실상 인권 패키지',
      '소환→합성 변환: 100회 → 97회, 1000회 → 994회 (이진수 1의 개수만큼 감소)',
      '합성보상은 50회마다 1회, 매주 초기화 → 1주 단위 계획',
      '새식구는 합성횟수를 1/(1-확률)로 증폭',
    ],
    source: { author: 'YUI', date: '2026-03-12', url: 'https://game.naver.com/lounge/reworld/board/detail/7402202' },
  },
  {
    id: 'stage-push',
    category: '스테이지',
    title: '스테이지 억지로 미는 법',
    summary: '스펙 부족 시 보스를 잡기 위한 핵심 팁',
    body: [
      '풀버프 + 모든 일시 버프 동시 적용 후 시도',
      '14단계(절망) 보스 직전엔 스킬 쿨다운 모두 차징해두기',
      '재등반 후 스텟 보존을 활용해 빠르게 동일 층 복귀',
    ],
    source: { author: '졸린 댕댕이', date: '2026-03-03', url: 'https://game.naver.com/lounge/reworld/board/detail/7373600' },
  },
  {
    id: 'box-tips',
    category: '효율',
    title: '상자 운영 꿀팁',
    summary: '즉시 개봉 다이아 비교 + 상자칸 회전',
    body: [
      '전설상자: 즉시 개봉 150다이아 = 720분 시간 가치 손익분기 동률',
      '초록상자(일반): 광고 시청 18다이아 vs 즉시 20다이아 → 즉시 개봉 추천',
      '상자칸이 가득 차면 새 보스 상자가 안 들어옴 → 낮은 등급은 다이아로 즉시 개봉',
    ],
    source: { author: '모룸', date: '2026-03-06', url: 'https://game.naver.com/lounge/reworld/board/detail/7384520' },
  },
  {
    id: 'ldplayer-fix',
    category: '버그',
    title: 'LD플레이어 구동 오류 해결',
    summary: 'LD플레이어에서 게임이 실행되지 않을 때',
    body: [
      'LD플레이어 설정 → CPU 코어 4 이상',
      '메모리 4GB 이상 할당',
      '안드로이드 9 이상 권장',
    ],
    source: { author: 'YUI', date: '2026-03-15', url: 'https://game.naver.com/lounge/reworld/board/detail/7416686' },
  },
  {
    id: 'reclimb',
    category: '운영',
    title: '재등반 팁',
    summary: '리셋 후 효율적인 재등반 루트',
    body: [
      '리셋 후 핵심 스탯(공격력)에 우선 투자',
      '월드 단계별 제한 스텟 도달까지만 찍고 다음 월드 진입',
      '마정석/재화 한도 내에서 연구소 우선순위 정하기',
    ],
    source: { author: '모룸', date: '2026-03-17', url: 'https://game.naver.com/lounge/reworld/board/detail/7422352' },
  },
  {
    id: 'paid-pack',
    category: '결제',
    title: '과금 가성비 추천',
    summary: '인권급 패키지 우선순위',
    body: [
      '1순위: 광고제거 (상자 30분 단축)',
      '2순위: 슬라임 마스터 팩 (빛의파편 ×2)',
      '3순위: 로얄패스 (전골획 핫타임)',
      '뽑기 1회 80다이아, 10연 720다이아 — 평균 76다이아 환산',
    ],
    source: { author: 'YUI', date: '2026-03-08', url: 'https://game.naver.com/lounge/reworld/board/9' },
  },
  // ─── Phase 12.5 신규 추가 ─────────────────────────────────────────────
  {
    id: 'daily-synthesis',
    category: '효율',
    title: '일일 무료 합성 146회 가능',
    summary: '달빛 150 → 슬라임 150 소환 → 합성 146회',
    body: [
      '기본 지급 50 + 무료 충전 50×2 = 일일 150 달빛',
      '150회 소환 → 합성 146회 (이진수 1의 개수만큼 슬라임 잔여)',
      '50회마다 1회 합성보상 → 일일 평균 2.92회 보상 무한 누적',
      '달빛주머니 업그레이드로 일일 기본 지급 증가 가능',
    ],
    source: { author: 'YUI', date: '2026-03-12', url: 'https://game.naver.com/lounge/reworld/board/detail/7402202' },
  },
  {
    id: 'costume-upgrade-coef',
    category: '효율',
    title: '코스튬 등급별 레벨업 효율',
    summary: '빛파편 7개당 1레벨, R/SR/SSR 차등',
    body: [
      'R등급: 1레벨당 공격력 +0.2% / 생명력 +0.7%',
      'SR등급: 1레벨당 공격력 +0.3% / 생명력 +0.9%',
      'SSR등급: 1레벨당 공격력 +0.4% / 생명력 +1.2%',
      '동일 빛파편 투자 시 SSR이 약 2배 효율',
      '코스튬 마스터 1~200 단계 = 모든 피해량 추가 보너스',
    ],
    source: { author: '매크니', date: '2026-03-09', url: 'https://game.naver.com/lounge/reworld/board/detail/7393959' },
  },
  {
    id: 'rune-cost',
    category: '효율',
    title: '동료 특성 룬 소모량',
    summary: '등급별 1단계 잠금 해제 비용',
    body: [
      '일반 10 / 희귀 20 / 영웅 30 / 전설 40 / 신화 50개',
      '잠금 단계마다 ×n배 누적 (1→2배→3배→...)',
      '신화 동료 5단계 잠금 해제 = 50 + 100 + 150 + 200 + 250 = 750개 룬',
      '일반·희귀 위주로 골획 특성 활성화가 ROI 최고',
    ],
    source: { author: 'YUI', date: '2026-03-15', url: 'https://game.naver.com/lounge/reworld/board/detail/7417755' },
  },
  {
    id: 'pack-priority',
    category: '결제',
    title: 'VIP팩 vs 광제 vs 슬마팩 우선순위',
    summary: '인권급 3종 비교',
    body: [
      'VIP팩 (₩15,000/30일): 매일 200다이아 + 모든 던전 1회 + 골획+20% + 마일리지5%',
      '광고제거팩 (1회 한정): 상자 해제 30분 단축 → 일평균 120분 시간 가치',
      '슬라임 마스터팩: 빛파편 ×2 → 코스튬 강화 ROI 2배',
      '신규: VIP팩 첫 구매 → 광제 → 슬마팩 순서 추천',
      'VIP팩 30일 누적 가치 ≈ 14,200다이아 = 약 ₩1대비 ₩0.95 환산',
    ],
    source: { author: 'YUI 외', date: '2026-03-08', url: 'https://game.naver.com/lounge/reworld/board/9' },
  },
  {
    id: 'heart-vs-dia',
    category: '효율',
    title: '깡다이아 vs 하트 카드뽑',
    summary: '하트 사용이 다이아 절약',
    body: [
      '카드뽑 1회 = 10 하트 또는 76다이아',
      '광고제거 패키지: 하트 1:1 = 1다이아 → 카드뽑 10다이아 가치',
      '깡 다이아샵: 하트 3:1 = 3다이아 → 카드뽑 30다이아 가치',
      '하트로 뽑기 vs 깡다이아 환산: 광제 시 7.6배 효율',
      '하트가 쌓이면 우선 사용, 다이아는 골드/달빛에 투자',
    ],
    source: { author: '존버', date: '2026-03-14', url: 'https://game.naver.com/lounge/reworld/board/detail/7414201' },
  },
  {
    id: 'idle-strategy',
    category: '운영',
    title: '99스테 주차 vs 100스테 무한 vs 90스테 등반',
    summary: '재등반 ROI 비교',
    body: [
      '99층 주차: 재등반 비용 2다이아, 가장 효율적 (단 보스 못 잡음)',
      '100층 무한: 보스 없음, 안정적이나 상자 미수령',
      '90층 등반: 재등반 비용 20다이아, 상자 파밍 시 본전~수익',
      '14층 도전: 클리어 가능성 확인 후 시도',
      '시간당 골드: 100층 무한 ≈ 99층 주차 > 90층 등반 (단 상자 가치 별도)',
    ],
    source: { author: '몰루는몰루 외', date: '2026-03-17', url: 'https://game.naver.com/lounge/reworld/board/detail/7422352' },
  },
  {
    id: 'manual-pull',
    category: '효율',
    title: '카드뽑 자동 vs 수동',
    summary: '수동 시 골드획득 카드 우선 픽',
    body: [
      '자동 30회 뽑기: 빠르지만 골드 카드 누락 가능',
      '수동 1회씩 뽑기: 골획 카드를 우선 선택해 효율 극대화',
      '신규: 30회 자동 후 골획 카드를 신화로 업그레이드 가능',
      '골드 모자랄 때는 수동, 충분할 때는 자동',
    ],
    source: { author: '하트를 든 라이언 외', date: '2026-03-17', url: 'https://game.naver.com/lounge/reworld/board/9' },
  },
  {
    id: 'online-vs-offline',
    category: '운영',
    title: '온라인 vs 오프라인 골드 4배 차이',
    summary: '게임 켜놓기 vs 방치 보상',
    body: [
      '게임 켜놓고 자동 사냥 시 시간당 골드가 오프라인 방치 보상 대비 약 4배',
      'LD플레이어로 24시간 켜놓기 + 광제 조합 추천',
      '오프라인은 단순 시간 가치, 온라인은 실제 처치수 기반',
      '핫타임 + 켜놓기 조합이 단기 골드작 핵심',
    ],
    source: { author: '몰루는몰루', date: '2026-03-16', url: 'https://game.naver.com/lounge/reworld/board/9' },
  },
];

export const TIP_CATEGORIES: Array<Tip['category']> = ['신규', '운영', '효율', '스테이지', '결제', '버그'];

export interface FAQ {
  id: string;
  q: string;
  a: string;
}

export const FAQ_LIST: FAQ[] = [
  { id: 'crit-source',
    q: '치명타는 어떻게 올리나요?',
    a: '인게임 기본값은 0%이며, 카드 뽑기 버프(치명타 확률 + 치명타 피해량)로만 획득 가능합니다. 신화 등급 기준 +30% / +50%.' },
  { id: 'stat-cap',
    q: '월드 단계별 제한 스텟이 뭔가요?',
    a: '각 월드에서 공격력/생명력/회복력 스텟 레벨의 상한. 14단계(절망)는 75,000, 15단계 100,000, 16단계 130,000. 17~20단계는 미확인.' },
  { id: 'climb-vs-infinite',
    q: '등반 모드와 무한 모드 중 어느게 골드 효율이 좋나요?',
    a: '시간당 골드는 거의 동일합니다. 다만 무한모드는 보스가 없어 보스 보상(상자/마정석)을 못 받습니다. 상자 파밍 시 등반, 단순 골드 시 무한 추천.' },
  { id: 'monster-drop',
    q: '몬스터 골드 드랍 확률이 매번 다른 것 같은데?',
    a: '몬스터당 약 65~70% 확률로 골드 드랍. 골드는 고정값 × 골획 × 전골획 (각 단계마다 버림 적용).' },
  { id: 'lightshard-fastest',
    q: '빛의파편 빠르게 모으는 법?',
    a: '슬라임 마스터 팩(×2) + 연구소 빛의파편 증가(+30%) + 높은 레벨 슬라임 합성(n²). 다이아는 달빛 충전에 투자가 가성비 1.16배.' },
  { id: 'buff-priority',
    q: '24종 버프 중 무엇부터 신화로 올려야 하나요?',
    a: '1순위: 치명타 확률 + 치명타 피해량 (세트). 2순위: 모든 피해량 증가, 보스 피해량. 3순위: 골드 획득량 (효율은 200% 이하일 때만 좋음).' },
  { id: 'lounge-source',
    q: '데이터 출처는 어디인가요?',
    a: '네이버 게임 라운지 "여고생과 리셋중!" 공식 라운지의 공략 게시판 글 (YUI 외 작성자들의 커뮤니티 역산 자료). 모든 수치는 ±5% 추정치이며 인게임 패치에 따라 달라질 수 있습니다.' },
];
