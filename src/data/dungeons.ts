// 출처: 라운지 던전편 (YUI, 2026-03-20) + Phase 12.2 이미지 분석

export interface DungeonMeta {
  id: string;
  name: string;
  description: string;
}

// 이미지 분석: 4개 던전 (배너 4개 확인). 정확한 이름·보상 텍스트는 텍스트 추출에서 발견 안됨.
export const DUNGEONS: DungeonMeta[] = [
  { id: 'dungeon-1', name: '던전 1', description: '미상 (이미지 위주)' },
  { id: 'dungeon-2', name: '던전 2', description: '미상' },
  { id: 'dungeon-3', name: '던전 3', description: '미상' },
  { id: 'dungeon-4', name: '던전 4', description: '미상' },
];

// 일일 무료 입장 키 수 (텍스트 추출)
export const DAILY_KEY = {
  vipPack: 3,        // VIP팩 보유 시
  noVip: 2,          // VIP팩 미보유 시
  questBonus: 1,     // 퀘스트로 +1
  adBonus: 1,        // 광고로 +1
};

export const lastUpdated = '2026-03-20';
