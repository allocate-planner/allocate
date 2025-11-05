from api.system.schemas.base import FrozenBaseModel


class AudioTranscriptionResponse(FrozenBaseModel):
    transcription: str
    session_id: str


class AudioAnalysisOutput(FrozenBaseModel):
    llm_output: str
    session_id: str
