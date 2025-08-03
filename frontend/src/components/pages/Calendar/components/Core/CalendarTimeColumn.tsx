import { calendarHours, formatHourLabel } from "@/utils/TimeUtils";

export const CalendarTimeColumn = () => {
  return (
    <div className="col-span-1 row-span-48 w-full h-full border-gray-200">
      <div className="h-[56px]"></div>
      {calendarHours.slice(1).map((hour: number) => (
        <div key={hour} className="h-[56px] flex items-start justify-end pr-2 relative">
          <span className="text-xs text-gray-500 font-medium absolute -top-2">
            {formatHourLabel(hour)}
          </span>
        </div>
      ))}
    </div>
  );
};
