export type IEvent = {
  id: number;
  title: string;
  description?: string;
  location?: string;
  date: string;
  colour: string;
  start_time: string;
  end_time: string;
}

export type IEventCreate = {
  title?: string;
  description?: string;
  location?: string;
  colour?: string;
  date: string;
  start_time: string;
  end_time: string;
}

export type ITransformedEvent = IEvent & {
  event_week_start: Date;
  day: number;
}
