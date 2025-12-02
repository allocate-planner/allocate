import axios from "axios";

import { API_BASE_URL } from "@/utils/constants";

import type { ITransformedEvent } from "@/models/IEvent";
import type { AudioAnalysisOutput, AudioTranscriptionResponse } from "@/models/IAudio";

export const aiService = {
  transcribeAudio: async (
    accessToken: string,
    audioRecording: Blob
  ): Promise<AudioTranscriptionResponse> => {
    const formData = new FormData();
    formData.append("file", audioRecording, "audio.webm");

    return await axios
      .post(`${API_BASE_URL}/ai/audio/transcribe`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(response => response.data)
      .catch(error => {
        if (error.response && error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        } else {
          throw new Error("An unknown error occurred while transcribing the audio");
        }
      });
  },

  analyseAudio: async (
    accessToken: string,
    transcriptionResponse: AudioTranscriptionResponse,
    events: ITransformedEvent[]
  ): Promise<AudioAnalysisOutput> => {
    return await axios
      .post(
        `${API_BASE_URL}/ai/audio/analyse`,
        {
          transcription_response: transcriptionResponse,
          events: events,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(response => response.data)
      .catch(error => {
        if (error.response && error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        } else {
          throw new Error("An unknown error occurred while analysing the audio");
        }
      });
  },

  applyRecommendations: async (
    accessToken: string,
    analysisOutput: AudioAnalysisOutput
  ): Promise<ITransformedEvent[]> => {
    return await axios
      .post(
        `${API_BASE_URL}/ai/audio/apply`,
        {
          llm_output: analysisOutput.llm_output,
          session_id: analysisOutput.session_id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(response => response.data)
      .catch(error => {
        if (error.response && error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        } else {
          throw new Error("An unknown error occurred while applying the recommendations");
        }
      });
  },

  processAudio: async (
    accessToken: string,
    audioRecording: Blob,
    events: ITransformedEvent[]
  ): Promise<ITransformedEvent[]> => {
    try {
      const transcriptionResponse = await aiService.transcribeAudio(accessToken, audioRecording);
      const analysisOutput = await aiService.analyseAudio(
        accessToken,
        transcriptionResponse,
        events
      );
      const appliedRecommendations = await aiService.applyRecommendations(
        accessToken,
        analysisOutput
      );

      return appliedRecommendations;
    } catch (error) {
      throw error;
    }
  },
};
