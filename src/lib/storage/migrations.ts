import type { ExportData } from './schema';

type Migration = (raw: Record<string, unknown>) => Record<string, unknown>;

const migrations: Record<number, Migration> = {
  // 버전 1 → 2 예시 (추후 추가)
  // 2: (raw) => ({ ...raw, schemaVersion: 2 }),
};

export function migrateExportData(raw: Record<string, unknown>): Record<string, unknown> {
  let current = raw;
  const startVersion = typeof current['schemaVersion'] === 'number' ? current['schemaVersion'] : 0;
  const targetVersion = 1;

  for (let v = startVersion; v < targetVersion; v++) {
    const migrate = migrations[v + 1];
    if (migrate) {
      current = migrate(current);
    }
  }

  return current;
}

export function isExportDataStale(data: ExportData): boolean {
  return data.schemaVersion < 1;
}
