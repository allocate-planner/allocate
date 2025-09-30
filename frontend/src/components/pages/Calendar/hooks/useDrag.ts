import { useSensors, useSensor, MouseSensor, type DragEndEvent } from "@dnd-kit/core";
import { useAtomValue } from "jotai";

import { weekEventsAtom } from "@/atoms/eventsAtom";
import type { IEventUpdate } from "@/models/IEvent";
import {
  calculateNewDateFromDaySlot,
  calculateNewEndSlot,
  convertTimeSlotIndexToISO,
} from "@/utils/TimeUtils";

interface IProps {
  editEvent: (event: IEventUpdate) => Promise<boolean>;
}

export const useDrag = ({ editEvent }: IProps) => {
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
    if (!draggedEvent) return;

    const isRecurringOccurrence =
      draggedEvent.repeated === true || (draggedEvent.rrule && draggedEvent.rrule !== "DNR");

    const newEvent: IEventUpdate = {
      ...draggedEvent,
      start_time: convertTimeSlotIndexToISO(dropDateSlot),
      end_time: convertTimeSlotIndexToISO(
        calculateNewEndSlot(draggedEvent.start_time, draggedEvent.end_time, dropDateSlot)
      ),
      ...(isRecurringOccurrence
        ? {
            previous_date: draggedEvent.date,
            previous_start_time: draggedEvent.start_time,
            previous_end_time: draggedEvent.end_time,
          }
        : {
            date: calculateNewDateFromDaySlot(draggedEvent.date, draggedEvent.day, dropDateSlot),
          }),
    };

    await editEvent(newEvent);
  };

  return {
    sensors,
    onDragEnd,
  };
};
