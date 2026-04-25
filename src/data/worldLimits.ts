// 출처: 네이버 게임 라운지 — 월드 단계별 제한 스텟 (2026-03-31)
// "스텟 레벨 제한" — 해당 단계 진입 시 공격력/생명력/회복력 스텟 레벨 상한
// 17~20단계 수치는 미확인

export interface WorldStage {
  stage: number;
  name: string;
  statLimit: number | null; // null = 미확인
}

export const WORLD_STAGES: WorldStage[] = [
  { stage: 1,  name: '시작',   statLimit: 200 },
  { stage: 2,  name: '도전',   statLimit: 400 },
  { stage: 3,  name: '위험',   statLimit: 800 },
  { stage: 4,  name: '균열',   statLimit: 1_500 },
  { stage: 5,  name: '고통',   statLimit: 2_500 },
  { stage: 6,  name: '타락',   statLimit: 4_000 },
  { stage: 7,  name: '붕괴',   statLimit: 5_500 },
  { stage: 8,  name: '공허',   statLimit: 7_500 },
  { stage: 9,  name: '금단',   statLimit: 10_000 },
  { stage: 10, name: '파멸',   statLimit: 12_500 },
  { stage: 11, name: '지옥',   statLimit: 15_000 },
  { stage: 12, name: '심연',   statLimit: 30_000 },
  { stage: 13, name: '악몽',   statLimit: 50_000 },
  { stage: 14, name: '절망',   statLimit: 75_000 },
  { stage: 15, name: '말살',   statLimit: 100_000 },
  { stage: 16, name: '종말',   statLimit: 130_000 },
  { stage: 17, name: '17단계', statLimit: null },
  { stage: 18, name: '18단계', statLimit: null },
  { stage: 19, name: '19단계', statLimit: null },
  { stage: 20, name: '20단계', statLimit: null },
];

export function getWorldStage(stage: number): WorldStage | null {
  return WORLD_STAGES.find((w) => w.stage === stage) ?? null;
}

export const WORLD_STAGE_OPTIONS = WORLD_STAGES.map((w) => ({
  value: String(w.stage),
  label: `${w.stage}단계 (${w.name})${w.statLimit ? ` — ${w.statLimit.toLocaleString()}` : ''}`,
}));
