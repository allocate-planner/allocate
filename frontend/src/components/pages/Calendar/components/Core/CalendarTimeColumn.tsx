import { calendarHours, formatHour } from "@/utils/TimeUtils";

export const CalendarTimeColumn = () => {
  return (
    <div className="col-span-1 row-span-48 w-full h-full">
      {calendarHours.map((hour: number) => (
        <div
          key={hour}
          className={`w-full min-w-0 ${hour === calendarHours.length - 1 ? "" : "border-b"}`}
        >
          <div className="flex flex-col justify-center items-start h-[56px] p-4">
            <h2 className="text-sm">{formatHour(hour)}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};
