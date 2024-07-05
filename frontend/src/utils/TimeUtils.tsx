import { parse, format, parseISO, formatISO, set, isAfter } from "date-fns";

export const calendarHours: number[] = Array.from({ length: 24 }, (_, i) => i);
export const daysOfWeek: number[] = Array.from({ length: 7 }, (_, i) => i);

export const times = Array.from({ length: 24 }, (_, i) =>
  format(set(new Date(), { hours: i, minutes: 0 }), "hh:mma").toLowerCase()
);

// Input:  "03:00am"
// Output: "03:00:00+01:00"
export const convertToISO = (time: string): string => {
  return format(parse(time, "hh:mma", new Date()), "HH:mm:ss" + "+01:00");
};

// Input:  "01"
// Output: "01:00am"
export const convertToTimePeriodFromHH = (time: string): string => {
  return format(
    parse(time as string, "HH", new Date()),
    "hh:mma"
  ).toLowerCase();
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
  return format(
    set(new Date(), { hours: hour, minutes: 0 }),
    "hh:mma"
  ).toLowerCase();
};

// Input:  "10"
// Output: "10:00am"
export const formatHourToHA = (hour: number): string => {
  return format(
    set(new Date(), { hours: hour, minutes: 0 }),
    "ha"
  ).toUpperCase();
};

// Input:  "5"
// Output: "05:00:00+01:00"
export const formatTimeFromHour = (hour: number): string => {
  return formatISO(
    set(new Date(), { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 }),
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
