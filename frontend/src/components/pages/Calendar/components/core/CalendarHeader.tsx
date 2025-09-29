import { format, isSameDay } from "date-fns";
import { useAtomValue, useSetAtom } from "jotai";

import { Bars3Icon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

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

  const getGridCols = () => {
    switch (calendarView) {
      case "single":
        return "grid-cols-[60px_1fr]";
      case "triple":
        return "grid-cols-[60px_repeat(3,1fr)]";
      default:
        return "grid-cols-[60px_repeat(7,1fr)]";
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="border-b flex justify-between">
        <div className="p-4 flex items-center space-x-4">
          {calendarView === "single" ? (
            <Bars3Icon
              className="w-6 h-6 cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          ) : null}
          <h2 className="text-lg font-semibold">{format(currentWeek, "MMMM yyyy")}</h2>
        </div>
        <div className="flex justify-center items-center space-x-8 p-4">
          <ChevronLeftIcon
            className="w-6 h-6 cursor-pointer hover:scale-110 transform transition duration-100"
            onClick={() => moveWeek(-1)}
          />
          <ChevronRightIcon
            className="w-6 h-6 cursor-pointer hover:scale-110 transform transition duration-100"
            onClick={() => moveWeek(1)}
          />
          <Button
            className="bg-white border border-gray-300 text-gray-700 h-full rounded-lg hover:bg-gray-50"
            onClick={() => setCurrentWeek(new Date())}
          >
            Today
          </Button>
        </div>
      </div>
      <div className={`${getGridCols()} grid grid-rows-1 w-full`}>
        <div className="border-b"></div>
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
    </div>
  );
};
