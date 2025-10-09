import { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { addDays } from "date-fns";
import { currentWeekAtom } from "@/atoms/eventsAtom";

export const useWeekNavigation = () => {
  const currentWeek = useAtomValue(currentWeekAtom);
  const setCurrentWeek = useSetAtom(currentWeekAtom);

  const moveByDays = useCallback(
    (days: number) => {
      setCurrentWeek(prevWeek => addDays(prevWeek, days));
    },
    [setCurrentWeek]
  );

  return {
    currentWeek,
    setCurrentWeek,
    moveByDays,
  };
};
