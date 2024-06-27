import { atom, useAtom } from "jotai";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

import { Button } from "../Button";

import { format, addDays, startOfWeek, endOfWeek, isSameDay } from "date-fns";

const currentWeekAtom = atom(new Date());

const CalendarHeader = () => {
  const [currentWeek, setCurrentWeek] = useAtom(currentWeekAtom);

  const moveWeek = (direction: number): void => {
    setCurrentWeek((prevWeek: Date) => addDays(prevWeek, direction * 7));
  };

  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-7 grid-rows-1 w-full">
      <div className="col-span-7 border-b border-gray-300 flex justify-center items-center space-x-8 p-4">
        <ArrowLeftIcon
          className="w-6 h-6 cursor-pointer hover:scale-125 transform transition duration-300"
          onClick={() => moveWeek(-1)}
        />
        <h2 className="text-lg font-semibold">
          {format(weekStart, "d MMMM")} — {format(weekEnd, "d MMMM yyyy")}
        </h2>
        <ArrowRightIcon
          className="w-6 h-6 cursor-pointer hover:scale-125 transform transition duration-300"
          onClick={() => moveWeek(1)}
        />
        <Button
          className="bg-violet-100 border border-violet-400 text-violet-700 h-2/3 rounded-xl hover:bg-violet-200"
          onClick={() => setCurrentWeek(new Date())}
        >
          Today
        </Button>
      </div>
      {weekDays.map((day: Date) => (
        <div
          key={day.toISOString()}
          className={`
            border-r border-b
            ${
              isSameDay(day, new Date())
                ? "border-b-violet-400"
                : "border-gray-300"
            } 
            flex flex-col justify-center items-center p-4 last:border-r-0
          `}
        >
          <h3 className="font-bold text-lg">{format(day, "EEEE")}</h3>
          <p className="text-sm">{format(day, "d MMMM")}</p>
        </div>
      ))}
    </div>
  );
};

export default CalendarHeader;
