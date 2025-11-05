import { calendarHours, formatHourLabel } from "@/utils/timeUtils";

export const CalendarTimeColumn = () => {
  return (
    <div className="col-span-1 row-span-48 w-full h-full border-gray-200 grid grid-rows-subgrid">
      {calendarHours.map((hour: number) => (
        <div key={hour} className="row-span-2 flex items-center justify-end pr-2 relative">
          <span className="text-xs text-gray-500 font-medium">{formatHourLabel(hour)}</span>
        </div>
      ))}
    </div>
  );
};
