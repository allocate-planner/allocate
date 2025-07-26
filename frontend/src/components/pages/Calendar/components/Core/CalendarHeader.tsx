import { format, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { useAtomValue, useSetAtom } from "jotai";

import { ArrowLeftIcon, ArrowRightIcon, Bars3Icon } from "@heroicons/react/24/outline";

import { Button } from "@/components/common/Button";
import { currentWeekAtom } from "@/atoms/eventsAtom";

import type { CalendarView } from "@/components/pages/Calendar/hooks/useCalendarView";

interface IProps {
  moveWeek: (direction: number) => void;
  calendarView: CalendarView;
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void;
  weekDays: Date[];
}

export const CalendarHeader = ({
  moveWeek,
  calendarView,
  sidebarOpen,
  setSidebarOpen,
  weekDays,
}: IProps) => {
  const currentWeek = useAtomValue(currentWeekAtom);
  const setCurrentWeek = useSetAtom(currentWeekAtom);
  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);

  const getGridCols = () => {
    switch (calendarView) {
      case "single":
        return "grid-cols-[100px_1fr]";
      case "triple":
        return "grid-cols-4";
      default:
        return "grid-cols-8";
    }
  };

  return (
    <div className={`${getGridCols()} grid grid-rows-1 w-full`}>
      <div className="col-span-8 border-b flex justify-between">
        <div className="p-4 flex items-center">
          {calendarView === "single" ? (
            <Bars3Icon
              className="w-6 h-6 cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          ) : null}
        </div>
        <div className="flex justify-center items-center space-x-8 p-4">
          <ArrowLeftIcon
            className="w-6 h-6 cursor-pointer hover:scale-125 transform transition duration-300"
            onClick={() => moveWeek(-1)}
          />
          <h2 className="text-lg font-normal">
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
      </div>
      <div className="border-r border-b flex flex-col justify-center items-center p-4 ">
        <h3 className="font-light text-sm">GMT +1</h3>
      </div>
      {weekDays.map((day: Date) => (
        <div
          key={day.toISOString()}
          className={`
            border-r border-b
            ${isSameDay(day, new Date()) ? "border-b-violet-400" : "border-gray-200"} 
            flex justify-center items-center p-4
          `}
        >
          <span className={`${isSameDay(day, new Date()) ? "font-bold" : ""}`}>
            {format(day, "EEE d")}
          </span>
        </div>
      ))}
    </div>
  );
};
