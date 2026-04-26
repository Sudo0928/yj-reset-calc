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
