export interface IEvent {
  id: number;
  title: string;
  description?: string;
  location?: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface IEventCreate {
  title?: string;
  description?: string;
  location?: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface ITransformedEvent extends IEvent {
  event_week_start: Date;
  day: number;
}
