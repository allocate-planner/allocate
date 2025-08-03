import { parse, format, parseISO, formatISO, set, isAfter } from "date-fns";

const TIMEZONE_OFFSET = "+01:00" as const;

export const calendarHours: number[] = Array.from({ length: 24 }, (_, i) => i);

export const times = Array.from({ length: 48 }, (_, i) =>
  format(
    set(new Date(), { hours: Math.floor(i / 2), minutes: (i % 2) * 30 }),
    "hh:mma"
  ).toLowerCase()
);

// Input:  "03:00am"
// Output: "03:00:00+01:00"
export const convertToISO = (time: string): string => {
  return format(parse(time, "hh:mma", new Date()), "HH:mm:ss" + TIMEZONE_OFFSET);
};

// Input:  "01:30"
// Output: "01:00am"
export const convertToTimePeriodFromHHmm = (time: string): string => {
  return format(parse(time as string, "HH:mm", new Date()), "hh:mma").toLowerCase();
};

// Input:  "02:00:00+01:00"
// Output: "02:00am"
export const convertToTimePeriodFromISO = (time: string) => {
  const dummyISOString = `1970-01-01T${time}`;
  return format(parseISO(dummyISOString), "hh:mma").toLowerCase();
};

// Input:  "10"
// Output: "10:00am"
export const formatHour = (hour: number): string => {
  return format(set(new Date(), { hours: hour, minutes: 0 }), "hh:mma").toLowerCase();
};

// Input:  "10, 30"
// Output: "10:30"
export const formatTimeSlotToHMM = (hour: number, minute: number): string => {
  return format(set(new Date(), { hours: hour, minutes: minute }), "h:mm").toUpperCase();
};

// Input:  "10, 30"
// Output: "10:30AM"
export const formatTimeSlotToHMMA = (hour: number, minute: number): string => {
  return format(set(new Date(), { hours: hour, minutes: minute }), "h:mma").toUpperCase();
};

// Input:  "10"
// Output: "10AM"
export const formatHourLabel = (hour: number): string => {
  return format(set(new Date(), { hours: hour, minutes: 0 }), "ha").toUpperCase();
};

// Input:  "05, 00"
// Output: "05:00:00+01:00"
export const formatISOFromTimeSlot = (hour: number, minute: number): string => {
  return formatISO(
    set(new Date(), {
      hours: hour,
      minutes: minute,
      seconds: 0,
      milliseconds: 0,
    }),
    { representation: "time" }
  );
};

// Input:  "Fri Jul 05 2024 00:00:00 GMT+0100 (British Summer Time)"
// Output: "2024-07-05"
export const formatDate = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

export const compareDates = (startTime: string, endTime: string): boolean => {
  const startTimeAsDate = parse(startTime, "hh:mma", new Date());
  const endTimeAsDate = parse(endTime, "hh:mma", new Date());

  return isAfter(startTimeAsDate, endTimeAsDate);
};

// Input:  07:00pm
// Output: 19:00
export const transformTo24HourFormat = (time: string): string => {
  return format(parse(time, "h:mma", new Date()), "HH:mm");
};

// Input: currentDate "2025-06-10", currentDay 2, newDaySlot "0:2"
// Output: "2025-06-08" (moved from day 2 to day 0, so -2 days)
export const calculateNewDateFromDaySlot = (
  currentDate: string,
  currentDay: number,
  newDaySlot: string
): string => {
  const [newDayStr] = newDaySlot.split(":");
  const newDay = parseInt(newDayStr!);
  const dayDifference = newDay - currentDay;

  const date = parseISO(currentDate);
  const newDate = set(date, {
    date: date.getDate() + dayDifference,
  });

  return formatDate(newDate);
};

// Input: 6-1
// Output: 00:30:00+01:00
export const convertTimeSlotIndexToISO = (timeSlotIndex: string): string => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [_, slotStr] = timeSlotIndex.split("-");
  const slot = parseInt(slotStr!);
  const hour = Math.floor(slot / 2);
  const minutes = (slot % 2) * 30;

  return formatISOFromTimeSlot(hour, minutes);
};

// Input: originalStartTime "02:30", originalEndTime "03:30", newDaySlot "0-1"
// Output: "0-3" (slot 1 + 2 slots difference = slot 3)
export const calculateNewEndSlot = (
  originalStartTime: string,
  originalEndTime: string,
  newDaySlot: string
): string => {
  const startDate = parse(originalStartTime, "HH:mm", new Date());
  const endDate = parse(originalEndTime, "HH:mm", new Date());
  const durationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
  const slotDifference = durationMinutes / 30;

  const [day, slotStr] = newDaySlot.split("-");
  const newEndSlot = parseInt(slotStr!) + slotDifference;

  return `${day}-${newEndSlot}`;
};
