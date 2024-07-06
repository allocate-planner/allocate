import { memo } from "react";

import { formatTimeSlotToHMM, formatTimeSlotToHMMA } from "@/utils/TimeUtils";

interface IProps {
  title: string;
  colour: string;
  startTime: string;
  endTime: string;
  onClick?: () => void;
}

const Event = memo((props: IProps) => {
  const startTimeParts = props.startTime.split(":").map(Number);
  const endTimeParts = props.endTime.split(":").map(Number);

  const startHour =
    startTimeParts[0] * 2 + (startTimeParts[1] === 30 ? 1 : 0) + 1;
  const startTimeInMinutes = startTimeParts[0] * 60 + startTimeParts[1];
  const endTimeInMinutes = endTimeParts[0] * 60 + endTimeParts[1];
  const durationInMinutes = endTimeInMinutes - startTimeInMinutes;
  const duration = Math.ceil(durationInMinutes / 30);

  return (
    <div
      className={`border-r-[1px] border-b-[1px] border-gray-300 flex ${
        duration === 1 ? "flex-row items-center space-x-2" : "flex-col"
      } text-sm items-start w-full h-full rounded-xl box-border px-4 py-1 hover:cursor-pointer z-10`}
      style={{
        backgroundColor: props.colour,
        gridRow: `${startHour} / span ${duration}`,
      }}
      onClick={props.onClick}
    >
      <h2 className="font-bold text-sm truncate">{props.title}</h2>
      <h3 className="text-xs">
        {duration !== 1 ? (
          <>
            {formatTimeSlotToHMM(startTimeParts[0], startTimeParts[1])} —{" "}
            {formatTimeSlotToHMMA(endTimeParts[0], endTimeParts[1])}
          </>
        ) : (
          formatTimeSlotToHMMA(startTimeParts[0], startTimeParts[1])
        )}
      </h3>
    </div>
  );
});

export default Event;
