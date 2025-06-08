import axios from "axios";

import { API_BASE_URL } from "@/utils/Constants";

export const audioService = {
  processAudio: async (audioRecording: Blob, accessToken: string) => {
    const formData = new FormData();
    formData.append("file", audioRecording, "audio.webm");

    return await axios
      .post(`${API_BASE_URL}/audio`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        } else {
          throw new Error("An unknown error occurred while processing the audio");
        }
      });
  },
};
