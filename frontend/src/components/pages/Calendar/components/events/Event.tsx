import { memo } from "react";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { formatTimeSlotToHMM, formatTimeSlotToHMMA } from "@/utils/TimeUtils";

interface IProps {
  id: string;
  title: string;
  colour: string;
  startTime: string;
  endTime: string;
  hasDescription?: boolean;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Event = memo(
  ({ id, title, colour, startTime, endTime, hasDescription, onClick, onContextMenu }: IProps) => {
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
      zIndex: isDragging ? 1000 : 10,
      boxShadow: hasDescription
        ? "inset 0 0 6px rgba(255, 255, 255, 0.4), inset 0 0 1px rgba(255, 255, 255, 0.6)"
        : undefined,
    };

    return (
      <div
        ref={setNodeRef}
        style={{
          backgroundColor: colour,
          gridRow: `${startHour} / span ${duration}`,
          ...style,
        }}
        className={`absolute z-10 flex ${
          duration === 1 ? "flex-row items-center space-x-2" : "flex-col"
        } text-sm items-start w-full h-full rounded-sm box-border px-4 py-1 hover:cursor-pointer ${
          isDragging ? "cursor-grabbing opacity-50" : "cursor-grab"
        } ${!isDragging && hasDescription ? "opacity-90" : !isDragging ? "opacity-100" : ""}`}
        onClick={onClick}
        onContextMenu={onContextMenu}
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
  }
);

Event.displayName = "Event";
export default Event;
