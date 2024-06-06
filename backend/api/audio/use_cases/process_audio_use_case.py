from fastapi import UploadFile

from api.audio.errors.audio_processing_error import AudioProcessingError


class ProcessAudioUseCase:
    def __init__(self) -> None:
        pass

    def execute(self, file: UploadFile):
        try:
            print(file.file)
        except Exception as e:
            raise AudioProcessingError(f"Error processing audio file: {str(e)}")
