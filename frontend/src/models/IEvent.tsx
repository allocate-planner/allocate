import { z } from "zod";

import { compareDates } from "@/utils/TimeUtils";

export const EventSchema = z.object({
  id: z.number(),
  title: z.string().max(256),
  description: z.string().max(1024).optional(),
  location: z.string().max(256).optional(),
  date: z.string(),
  colour: z.string().max(256),
  start_time: z.string(),
  end_time: z.string(),
  rrule: z.string().max(512).optional(),
  repeated: z.boolean().optional(),
});

export const EventCreateSchema = z
  .object({
    title: z.string().min(1, "A title must be provided").max(256),
    description: z.string().max(1024).optional(),
    location: z.string().max(256).optional(),
    colour: z.string().max(256).optional(),
    date: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    rrule: z.string().max(512).optional(),
  })
  .refine(data => data.start_time !== data.end_time, {
    message: "Start time must be different than end time",
    path: ["start_time"],
  })
  .refine(
    data => {
      return !compareDates(data.start_time, data.end_time);
    },
    {
      message: "Start time must be before the end time",
      path: ["start_time"],
    }
  );

export const EventEditSchema = z
  .object({
    title: z.string().min(1, "A title must be provided").max(256),
    description: z.string().max(1024).optional(),
    location: z.string().max(256).optional(),
    colour: z.string().max(256).optional(),
    start_time: z.string(),
    end_time: z.string(),
    rrule: z.string().max(512).optional(),
  })
  .refine(data => data.start_time !== data.end_time, {
    message: "Start time must be different than end time",
    path: ["start_time"],
  })
  .refine(
    data => {
      return !compareDates(data.start_time, data.end_time);
    },
    {
      message: "Start time must be before the end time",
      path: ["start_time"],
    }
  );

export const TransformedEventSchema = EventSchema.extend({
  day: z.number(),
});

export type ISelectedEvent = {
  date: string;
  start_time: string;
  end_time: string;
};

export type IEvent = z.infer<typeof EventSchema>;
export type IEventCreate = z.infer<typeof EventCreateSchema>;
export type IEditEvent = z.infer<typeof EventEditSchema>;
export type ITransformedEvent = z.infer<typeof TransformedEventSchema>;

export type IEventUpdate = Omit<IEvent, "date"> & {
  date?: string;
  previous_date?: string;
  previous_start_time?: string;
  previous_end_time?: string;
};
