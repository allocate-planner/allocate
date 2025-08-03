import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface IProps {
  onProcess: (audio: Blob) => void;
}

const SpeechComponent = ({ onProcess }: IProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    if (!("MediaRecorder" in window)) {
      toast.error("Recording not supported in your browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;

      const supportedTypes = ["audio/webm", "audio/mp4", "audio/ogg", "audio/wav"];
      const mimeType =
        supportedTypes.find(type => MediaRecorder.isTypeSupported(type)) || "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = () => {
        toast.error("Recording error occurred");
      };

      await new Promise(resolve => setTimeout(resolve, 100));

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (error) {
      toast.error("Failed to access microphone");
      cleanupStream();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsRecording(false);

      mediaRecorderRef.current.onstop = () => {
        const totalSize = audioChunksRef.current.reduce((total, chunk) => total + chunk.size, 0);

        if (totalSize === 0) {
          toast.error("No audio data recorded");
          cleanupStream();
          return;
        }

        const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        onProcess(audioBlob);
        cleanupStream();
      };

      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }
  };

  useEffect(() => {
    return () => cleanupStream();
  }, []);

  return (
    <div>
      {!isRecording ? (
        <button onClick={startRecording} type="button">
          Record
        </button>
      ) : (
        <button onClick={stopRecording} type="button">
          Stop
        </button>
      )}
    </div>
  );
};

export default SpeechComponent;
