import { useState, useRef } from "react";

import { toast } from "sonner";

interface IProps {
  onProcess: (audio: Blob) => void;
}

const SpeechComponent = (props: IProps) => {
  const mimeType = "audio/webm";

  const [permission, setPermission] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<"inactive" | "recording">("inactive");
  const audioChunksRef = useRef<Blob[]>([]);

  const handleAudioProcessing = (audioBlob: Blob) => {
    props.onProcess(audioBlob);
  };

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        setPermission(true);
        setStream(streamData);
      } catch (err) {
        if (err instanceof Error) {
          alert(err.message);
        }
      }
    } else {
      toast.error("The MediaRecorder API is not supported in your browser");
    }
  };

  const startRecording = async () => {
    if (stream) {
      setRecordingStatus("recording");

      const media = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      mediaRecorder.current = media;
      mediaRecorder.current.start();

      mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      setRecordingStatus("inactive");

      mediaRecorder.current.stop();

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        handleAudioProcessing(audioBlob);
      };
    }
  };

  return (
    <div>
      {!permission && (
        <button onClick={getMicrophonePermission} type="button">
          Record
        </button>
      )}
      {permission && recordingStatus === "inactive" && (
        <button onClick={startRecording} type="button">
          Start
        </button>
      )}
      {recordingStatus === "recording" && (
        <button onClick={stopRecording} type="button">
          Stop
        </button>
      )}
    </div>
  );
};

export default SpeechComponent;
