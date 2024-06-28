interface IEventProps {
  title: string;
  startTime: number;
  endTime: number;
}

const Event = (props: IEventProps) => {
  const duration = props.endTime - props.startTime + 1;

  return (
    <div
      className={`border-r-[1px] border-gray-300 flex flex-col text-sm items-start w-full h-full bg-[#FBDDD2] rounded-xl box-border px-4 py-1 hover:cursor-pointer`}
      style={{ gridRow: `span ${duration} / span ${duration}` }}
    >
      <h2 className="font-bold text-sm">{props.title}</h2>
      <h3 className="text-xs">
        {props.startTime} — {props.endTime}
      </h3>
    </div>
  );
};

export default Event;
