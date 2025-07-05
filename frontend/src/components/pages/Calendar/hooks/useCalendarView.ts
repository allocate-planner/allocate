import { useState, useEffect } from "react";

export type CalendarView = "single" | "triple" | "full";

export const useCalendarView = () => {
  const [calendarView, setCalendarView] = useState<CalendarView>("full");

  useEffect(() => {
    const updateViewMode = () => {
      const width = window.innerWidth;

      if (width < 1024) {
        setCalendarView("single");
      } else if (width < 1280) {
        setCalendarView("triple");
      } else {
        setCalendarView("full");
      }
    };

    updateViewMode();
    window.addEventListener("resize", updateViewMode);
    return () => window.removeEventListener("resize", updateViewMode);
  }, []);

  return calendarView;
};
