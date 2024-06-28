export interface IEvent {
  id: number;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface IEventCreate {
  title: string;
  date: Date;
  start_time: Date;
  end_time: Date;
}

export interface ITransformedEvent {
  title: string;
  event_week_start: Date;
  day: number;
  start_time: number;
  end_time: number;
}
