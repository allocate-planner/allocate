export interface IEvent {
  id: number;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface IEventCreate {
  title?: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface ITransformedEvent extends IEvent {
  event_week_start: Date;
  day: number;
}
