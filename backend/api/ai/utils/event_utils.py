from api.system.schemas.event import Event

NO_EVENTS_TEXT: str = "No events scheduled"
NO_TITLE_TEXT: str = "(no title)"


def parse_events(events: list[Event] | None) -> list[dict | None]:
    if not events:
        return []

    return [event.model_dump(mode="json") if event else None for event in events]


def group_events_by_date(events: list[dict | None]) -> dict[str, list[dict]]:
    events_by_date: dict[str, list[dict]] = {}

    for event in events:
        if not event:
            continue

        event_date = event.get("date")
        if not event_date:
            continue

        if event_date not in events_by_date:
            events_by_date[event_date] = []

        events_by_date[event_date].append(
            {
                "id": event.get("id"),
                "title": event.get("title", ""),
                "description": event.get("description", ""),
                "start_time": event.get("start_time", ""),
                "end_time": event.get("end_time", ""),
            }
        )

    return events_by_date


def format_events_by_date(events_by_date: dict[str, list[dict]]) -> str:
    if not events_by_date:
        return NO_EVENTS_TEXT

    formatted_events = []

    for date_key in sorted(events_by_date.keys()):
        events = events_by_date[date_key]
        formatted_events.append(f"\n{date_key}:")

        for event in events:
            _id = event.get("id", "")
            title = event.get("title", NO_TITLE_TEXT)
            start_time = event.get("start_time", "")
            end_time = event.get("end_time", "")
            description = event.get("description", "")

            event_str = (
                f"  - ID:{_id} | {start_time}-{end_time} | {title} | {description}"
            )
            formatted_events.append(event_str)

    return "\n".join(formatted_events)
