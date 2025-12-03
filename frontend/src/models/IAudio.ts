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

const ChatInputSchema = z.object({
  user_input: z.string(),
});

const ChatOutputSchema = z.object({
  response: z.string(),
});

export type AudioTranscriptionResponse = z.infer<typeof AudioTranscriptionResponseSchema>;
export type AudioAnalysisOutput = z.infer<typeof AudioAnalysisOutputSchema>;
export type ChatInput = z.infer<typeof ChatInputSchema>;
export type ChatOutput = z.infer<typeof ChatOutputSchema>;
