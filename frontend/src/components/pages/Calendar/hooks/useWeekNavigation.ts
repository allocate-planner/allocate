import { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { addDays } from "date-fns";
import { currentWeekAtom } from "@/atoms/eventsAtom";

export const useWeekNavigation = () => {
  const currentWeek = useAtomValue(currentWeekAtom);
  const setCurrentWeek = useSetAtom(currentWeekAtom);

  const moveWeek = useCallback(
    (direction: number) => {
      setCurrentWeek(prevWeek => addDays(prevWeek, direction * 7));
    },
    [setCurrentWeek]
  );

  return {
    currentWeek,
    setCurrentWeek,
    moveWeek,
  };
};
