import { formatHourToHA } from "@/utils/TimeUtils";

interface IEventProps {
  title: string;
  startTime: number;
  endTime: number;
  onClick?: () => void;
}

const Event = (props: IEventProps) => {
  const duration = props.endTime - props.startTime + 1;

  return (
    <div
      className={`border-r-[1px] border-b-[1px] border-gray-300 flex flex-col text-sm items-start w-full h-full bg-[#FBDDD2] rounded-xl box-border px-4 py-1 hover:cursor-pointer`}
      style={{ gridRow: `span ${duration}` }}
      onClick={props.onClick}
    >
      <h2 className="font-bold text-sm">{props.title}</h2>
      <h3 className="text-xs">
        {formatHourToHA(props.startTime)} — {formatHourToHA(props.endTime)}
      </h3>
    </div>
  );
};

export default Event;
