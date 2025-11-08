import { z } from "zod";

export const ImportedEventSchema = z.object({
  title: z.string().max(256),
  description: z.string().max(1024).optional(),
  location: z.string().max(256).optional(),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  colour: z.string().max(256),
  rrule: z.string().max(512).optional(),
  exdate: z.string().optional(),
});

export const ImportReportSchema = z.object({
  imported_count: z.number(),
  skipped_count: z.number().optional(),
  warnings: z.array(z.string()).optional(),
});

export type IImportedEvent = z.infer<typeof ImportedEventSchema>;
export type IImportReport = z.infer<typeof ImportReportSchema>;
