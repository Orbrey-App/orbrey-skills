# Calendar conflict finder reference

The connected MCP exposes `calendar_list` for reading household calendar events. It does not expose calendar-provider sync or discovery tools. The tool returns recurring occurrences within a date range, with event IDs and household-local start/end times. Other event fields vary; use only fields actually returned.

## Supported analysis

- Compare returned start and end times for overlaps.
- Identify a person-specific conflict only when both events explicitly identify the same member.
- Report missing location, member association, or time as unknown.
- Keep findings read-only. This skill does not move, delete, import, or export events.

Do not estimate drive time, infer an attendee from event wording, or claim the scan covered calendars not represented in the returned data.
