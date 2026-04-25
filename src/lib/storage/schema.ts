import { z } from 'zod';

export const CustomDataItemSchema = z.object({
  id: z.string(),
  type: z.enum(['companion', 'equipment', 'costume', 'skill', 'card'] as const),
  label: z.string().max(50),
  sublabel: z.string().optional(),
  data: z.record(z.string(), z.union([z.number(), z.string(), z.boolean()])),
  updatedAt: z.number(),
});

export const PresetSchema = z.object({
  id: z.string(),
  name: z.string().max(50),
  calcId: z.string(),
  inputs: z.record(z.string(), z.unknown()),
  createdAt: z.number(),
  notes: z.string().max(500).default(''),
});

export const ExportDataSchema = z.object({
  schemaVersion: z.literal(1),
  exportedAt: z.string(),
  data: z.object({
    customData: z.array(CustomDataItemSchema),
    presets: z.array(PresetSchema),
  }),
});

export type CustomDataItem = z.infer<typeof CustomDataItemSchema>;
export type Preset = z.infer<typeof PresetSchema>;
export type ExportData = z.infer<typeof ExportDataSchema>;
