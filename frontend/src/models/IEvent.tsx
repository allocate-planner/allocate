export interface IEvent {
  id: number;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface ITransformedEvent {
  title: string;
  day: number;
  start_time: number;
  end_time: number;
}

export interface IEventCreate {
  title: string;
  date: Date;
  start_time: Date;
  end_time: Date;
}
