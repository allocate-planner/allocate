import { useState, useCallback } from "react";
import { addDays } from "date-fns";

export const useWeekNavigation = (initialDate: Date = new Date()) => {
  const [currentWeek, setCurrentWeek] = useState(initialDate);

  const moveWeek = useCallback((direction: number) => {
    setCurrentWeek(prevWeek => addDays(prevWeek, direction * 7));
  }, []);

  return {
    currentWeek,
    setCurrentWeek,
    moveWeek,
  };
};
