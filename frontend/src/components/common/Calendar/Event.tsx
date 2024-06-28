interface IEventProps {
  title: string;
  startTime: number;
  endTime: number;
}

const Event = (props: IEventProps) => {
  return (
    <div className="flex flex-col text-sm items-start h-full w-full bg-[#FBDDD2] rounded-xl p-2">
      <h2 className="font-bold text-sm">{props.title}</h2>
      <h3>
        {props.startTime} — {props.endTime}
      </h3>
    </div>
  );
};

export default Event;
