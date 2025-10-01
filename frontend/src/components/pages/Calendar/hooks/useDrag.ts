import { useSensors, useSensor, MouseSensor, type DragEndEvent } from "@dnd-kit/core";
import { useAtomValue } from "jotai";

import { weekEventsAtom } from "@/atoms/eventsAtom";
import type { IEventCreate, IEventUpdate } from "@/models/IEvent";
import type { Nullable } from "@/models/IUtility";
import {
  calculateNewDateFromDaySlot,
  calculateNewEndSlot,
  convertTimeSlotIndexToISO,
  convertTimeToSlotIndex,
} from "@/utils/TimeUtils";

interface IProps {
  createEvent: (event: IEventCreate) => Promise<boolean>;
  editEvent: (event: IEventUpdate) => Promise<boolean>;
}

type CtrlKeyEvent = MouseEvent | PointerEvent | KeyboardEvent;

const hasCtrlOrMetaKey = (value: Nullable<Event>): value is CtrlKeyEvent => {
  return !!value && ("ctrlKey" in value || "metaKey" in value);
};

export const useDrag = ({ createEvent, editEvent }: IProps) => {
  const events = useAtomValue(weekEventsAtom);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 4,
      },
    })
  );

  const onDragEnd = async (event: DragEndEvent) => {
    const { over, active } = event;

    const compositeId = active.id as string;
    const dropDateSlot = over?.id as string;

    const firstDashIndex = compositeId.indexOf("-");
    const eventIdStr = compositeId.substring(0, firstDashIndex);
    const eventDate = compositeId.substring(firstDashIndex + 1);
    const eventId = parseInt(eventIdStr, 10);

    const draggedEvent = events.find(e => e.id === eventId && e.date === eventDate);
    if (!draggedEvent || !dropDateSlot) return;

    const originalDateSlot = `${draggedEvent.day}-${convertTimeToSlotIndex(draggedEvent.start_time)}`;
    if (dropDateSlot === originalDateSlot) return;

    const isRecurringOccurrence =
      draggedEvent.repeated === true || (draggedEvent.rrule && draggedEvent.rrule !== "DNR");

    const newEvent: IEventUpdate = {
      id: draggedEvent.id,
      title: draggedEvent.title,
      description: draggedEvent.description,
      location: draggedEvent.location,
      colour: draggedEvent.colour,
      repeated: draggedEvent.repeated,
      start_time: convertTimeSlotIndexToISO(dropDateSlot),
      end_time: convertTimeSlotIndexToISO(
        calculateNewEndSlot(draggedEvent.start_time, draggedEvent.end_time, dropDateSlot)
      ),
      ...(isRecurringOccurrence
        ? {
            date: calculateNewDateFromDaySlot(draggedEvent.date, draggedEvent.day, dropDateSlot),
            previous_date: draggedEvent.date,
            previous_start_time: draggedEvent.start_time,
            previous_end_time: draggedEvent.end_time,
          }
        : {
            date: calculateNewDateFromDaySlot(draggedEvent.date, draggedEvent.day, dropDateSlot),
          }),
    };

    if (
      hasCtrlOrMetaKey(event.activatorEvent) &&
      (event.activatorEvent.ctrlKey === true || event.activatorEvent.metaKey === true)
    ) {
      const copiedEvent: IEventCreate = {
        title: draggedEvent.title,
        description: draggedEvent.description,
        location: draggedEvent.location,
        colour: draggedEvent.colour,
        date: calculateNewDateFromDaySlot(draggedEvent.date, draggedEvent.day, dropDateSlot),
        start_time: convertTimeSlotIndexToISO(dropDateSlot),
        end_time: convertTimeSlotIndexToISO(
          calculateNewEndSlot(draggedEvent.start_time, draggedEvent.end_time, dropDateSlot)
        ),
      };

      await createEvent(copiedEvent);
    } else {
      await editEvent(newEvent);
    }
  };

  return {
    sensors,
    onDragEnd,
  };
};
