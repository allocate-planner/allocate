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

    const eventId = parseInt(compositeId.split("-")[0]!, 10);
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
