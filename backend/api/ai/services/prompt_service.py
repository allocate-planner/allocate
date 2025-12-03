from datetime import UTC, datetime

from api.ai.utils.event_utils import format_events_by_date

PLACEHOLDER_EVENTS: str = "{events}"
PLACEHOLDER_TIME: str = "{time}"
PLACEHOLDER_DAY: str = "{day}"

FILE_ENCODING: str = "utf8"

_prompt_cache: dict[str, str] = {}


class PromptService:
    def __init__(self, prompt_path: str) -> None:
        self.prompt_path = prompt_path
        self.prompt = ""

    def get_prompt(
        self,
        current_time: str,
        events_by_date: dict[str, list[dict]],
    ) -> str:
        self._read_prompt_from_file()
        self._populate_dynamic_content(current_time, events_by_date)

        return self.prompt

    def _read_prompt_from_file(self) -> None:
        if self.prompt_path not in _prompt_cache:
            with open(self.prompt_path, encoding=FILE_ENCODING) as file:
                _prompt_cache[self.prompt_path] = file.read()
        self.prompt = _prompt_cache[self.prompt_path]

    def _populate_dynamic_content(
        self,
        current_time: str,
        events_by_date: dict[str, list[dict]],
    ) -> None:
        events_text = format_events_by_date(events_by_date)
        day = datetime.now(tz=UTC).strftime("%A, %B %d, %Y")

        self.prompt = self.prompt.replace(PLACEHOLDER_EVENTS, events_text)
        self.prompt = self.prompt.replace(PLACEHOLDER_TIME, current_time)
        self.prompt = self.prompt.replace(PLACEHOLDER_DAY, day)
