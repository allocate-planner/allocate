import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

import { MicrophoneIcon } from "@heroicons/react/24/outline";

interface IProps {
  onProcess: (audio: Blob) => Promise<void> | void;
  onRecordingChange: (isRecording: boolean) => void;
  onProcessingChange: (isProcessing: boolean) => void;
  stopSignal: number;
  isProcessing: boolean;
}

const SpeechComponent = ({
  onProcess,
  onRecordingChange,
  onProcessingChange,
  stopSignal,
  isProcessing,
}: IProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const previousStopSignalRef = useRef<number>(stopSignal);

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    if (isRecording || isProcessing) {
      return;
    }

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
        cleanupStream();
        setIsRecording(false);
        onRecordingChange(false);
        onProcessingChange(false);
      };

      await new Promise(resolve => setTimeout(resolve, 100));

      mediaRecorder.start(100);
      setIsRecording(true);
      onRecordingChange(true);
    } catch (error) {
      toast.error("Failed to access microphone");
      cleanupStream();
      onRecordingChange(false);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) {
      return;
    }

    const recorder = mediaRecorderRef.current;
    setIsRecording(false);
    onRecordingChange(false);

    recorder.onstop = () => {
      const totalSize = audioChunksRef.current.reduce((total, chunk) => total + chunk.size, 0);

      if (totalSize === 0) {
        toast.error("No audio data recorded");
        cleanupStream();
        onProcessingChange(false);
        return;
      }

      const mimeType = recorder.mimeType || "audio/webm";
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

      onProcessingChange(true);

      Promise.resolve(onProcess(audioBlob)).finally(() => {
        cleanupStream();
        onProcessingChange(false);
      });
    };

    if (recorder.state !== "inactive") {
      recorder.stop();
    }
  };

  useEffect(() => {
    if (stopSignal !== previousStopSignalRef.current) {
      previousStopSignalRef.current = stopSignal;
      stopRecording();
    }
  }, [stopSignal]);

  useEffect(() => {
    return () => cleanupStream();
  }, []);

  if (isRecording || isProcessing) {
    return null;
  }

  return (
    <>
      <MicrophoneIcon className="ml-2 w-6 h-6 flex-shrink-0" />
      <button onClick={startRecording} type="button" className="text-left">
        Record
      </button>
    </>
  );
};

export default SpeechComponent;
