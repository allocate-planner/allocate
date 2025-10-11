import { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { addDays } from "date-fns";
import { currentDayAtom } from "@/atoms/eventsAtom";

export const useWeekNavigation = () => {
  const currentDay = useAtomValue(currentDayAtom);
  const setCurrentDay = useSetAtom(currentDayAtom);

  const moveByDays = useCallback(
    (days: number) => {
      setCurrentDay(prevDay => addDays(prevDay, days));
    },
    [setCurrentDay]
  );

  return {
    currentDay,
    setCurrentDay,
    moveByDays,
  };
};
