import { useSensors, useSensor, MouseSensor, type DragEndEvent } from "@dnd-kit/core";

import type { ITransformedEvent, IEventUpdate } from "@/models/IEvent";
import {
  calculateNewDateFromDaySlot,
  calculateNewEndSlot,
  convertTimeSlotIndexToISO,
} from "@/utils/TimeUtils";

interface IProps {
  events: ITransformedEvent[];
  editEvent: (event: IEventUpdate) => Promise<boolean>;
}

export const useDrag = ({ events, editEvent }: IProps) => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 4,
      },
    })
  );

  const onDragEnd = async (event: DragEndEvent) => {
    const { over, active } = event;

    const eventId = active.id;
    const dropDateSlot = over?.id as string;

    const draggedEvent = events.find(e => e.id === eventId);
    if (!draggedEvent) return;

    const newEvent: IEventUpdate = {
      ...draggedEvent,
      date: calculateNewDateFromDaySlot(draggedEvent.date, draggedEvent.day, dropDateSlot),
      start_time: convertTimeSlotIndexToISO(dropDateSlot),
      end_time: convertTimeSlotIndexToISO(
        calculateNewEndSlot(draggedEvent.start_time, draggedEvent.end_time, dropDateSlot)
      ),
      previous_date: draggedEvent.date,
      previous_start_time: draggedEvent.start_time,
      previous_end_time: draggedEvent.end_time,
    };

    await editEvent(newEvent);
  };

  return {
    sensors,
    onDragEnd,
  };
};
