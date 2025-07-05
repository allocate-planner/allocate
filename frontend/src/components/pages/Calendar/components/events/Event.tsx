import { memo } from "react";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { formatTimeSlotToHMM, formatTimeSlotToHMMA } from "@/utils/TimeUtils";

interface I {
  id: number;
  title: string;
  colour: string;
  startTime: string;
  endTime: string;
  onClick?: () => void;
}

const Event = memo(({ id, title, colour, startTime, endTime, onClick }: I) => {
  const startTimeParts = startTime.split(":").map(Number);
  const endTimeParts = endTime.split(":").map(Number);

  const startHour = startTimeParts[0]! * 2 + (startTimeParts[1] === 30 ? 1 : 0) + 1;
  const startTimeInMinutes = startTimeParts[0]! * 60 + startTimeParts[1]!;
  const endTimeInMinutes = endTimeParts[0]! * 60 + endTimeParts[1]!;
  const durationInMinutes = endTimeInMinutes - startTimeInMinutes;
  const duration = Math.ceil(durationInMinutes / 30);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 10,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: colour,
        gridRow: `${startHour} / span ${duration}`,
        ...style,
      }}
      className={`flex ${
        duration === 1 ? "flex-row items-center space-x-2" : "flex-col"
      } text-sm items-start w-full h-full rounded-xl box-border px-4 py-1 hover:cursor-pointer ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      onClick={onClick}
      {...listeners}
      {...attributes}
    >
      <h2 className="font-bold text-sm truncate overflow-hidden w-full">{title}</h2>
      <h3 className="text-xs">
        {duration !== 1 ? (
          <>
            {formatTimeSlotToHMM(startTimeParts[0]!, startTimeParts[1]!)} —{" "}
            {formatTimeSlotToHMMA(endTimeParts[0]!, endTimeParts[1]!)}
          </>
        ) : (
          formatTimeSlotToHMMA(startTimeParts[0]!, startTimeParts[1]!)
        )}
      </h3>
    </div>
  );
});

Event.displayName = "Event";
export default Event;
