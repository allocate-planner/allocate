import { z } from "zod";

const AudioSchema = z.object({
  session_id: z.string(),
});

const AudioTranscriptionResponseSchema = AudioSchema.extend({
  transcription: z.string(),
});

const AudioAnalysisOutputSchema = AudioSchema.extend({
  llm_output: z.string(),
});

export type AudioTranscriptionResponse = z.infer<typeof AudioTranscriptionResponseSchema>;
export type AudioAnalysisOutput = z.infer<typeof AudioAnalysisOutputSchema>;
