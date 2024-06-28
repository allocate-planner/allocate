interface IEventProps {
  title: string;
  startTime: number;
  endTime: number;
}

const Event = (props: IEventProps) => {
  return (
    <div className="flex flex-col text-sm items-start w-full bg-[#FBDDD2] rounded-xl box-border px-2 py-1 hover:cursor-pointer">
      <h2 className="font-bold text-sm">{props.title}</h2>
      <h3 className="text-xs">
        {props.startTime} — {props.endTime}
      </h3>
    </div>
  );
};

export default Event;
