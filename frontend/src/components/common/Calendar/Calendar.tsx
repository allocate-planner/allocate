import CalendarHeader from "./CalendarHeader";

const calendarHours = Array.from({ length: 24 }, (_, i) => i);

const formatHour = (hour: number): string => {
  const period = hour < 12 ? "am" : "pm";

  return `${hour.toString().padStart(2, "0")}:00${period}`;
};

const Calendar = () => {
  return (
    <div className="w-[87.5%] flex flex-col items-start border-[1px] bg-[#F8F8F8] rounded-xl border-gray-300 m-12">
      <CalendarHeader />
      <div className="h-full w-full overflow-y-scroll no-scrollbar">
        {calendarHours.map((index: number, hour: number) => (
          <div
            className={`grid grid-cols-7 grid-rows-1 w-full ${
              index === calendarHours.length - 1 ? "" : "border-b"
            } `}
          >
            <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-start p-4">
              <h2 className="text-sm">{formatHour(hour)}</h2>
            </div>
            <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-center p-4">
              <h2 className="text-sm"></h2>
            </div>
            <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-center p-4">
              <h2 className="text-sm"></h2>
            </div>
            <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-center p-4">
              <h2 className="text-sm"></h2>
            </div>
            <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-center p-4">
              <h2 className="text-sm"></h2>
            </div>
            <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-center p-4">
              <h2 className="text-sm"></h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
