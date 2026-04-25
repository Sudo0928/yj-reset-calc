import { ExportDataSchema, type ExportData } from './schema';
import { migrateExportData } from './migrations';

export function exportToJson(data: ExportData['data']): void {
  const payload: ExportData = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `yj-reset-calc_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importFromJsonFile(file: File): Promise<ExportData> {
  const text = await file.text();
  const raw = JSON.parse(text) as Record<string, unknown>;
  const migrated = migrateExportData(raw);
  const result = ExportDataSchema.safeParse(migrated);
  if (!result.success) {
    throw new Error(`데이터 형식이 올바르지 않습니다: ${result.error.issues[0]?.message ?? '알 수 없는 오류'}`);
  }
  return result.data;
}
