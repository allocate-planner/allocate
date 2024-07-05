import { memo } from "react";

import { formatHourToHA } from "@/utils/TimeUtils";

interface IProps {
  title: string;
  colour: string;
  startTime: number;
  endTime: number;
  onClick?: () => void;
}

const Event = memo((props: IProps) => {
  const duration = props.endTime - props.startTime;
  return (
    <div
      className={`border-r-[1px] border-b-[1px] border-gray-300 flex flex-col text-sm items-start w-full h-full rounded-xl box-border px-4 py-1 hover:cursor-pointer`}
      style={{ gridRow: `span ${duration}`, backgroundColor: props.colour }}
      onClick={props.onClick}
    >
      <h2 className="font-bold text-sm">{props.title}</h2>
      <h3 className="text-xs">
        {formatHourToHA(props.startTime)} — {formatHourToHA(props.endTime)}
      </h3>
    </div>
  );
});

export default Event;
