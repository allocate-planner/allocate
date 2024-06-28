export interface IEvent {
  id: number;
  title: string;
  date: Date;
  start_time: Date;
  end_time: Date;
}

export interface IEventCreate {
  title: string;
  date: Date;
  start_time: Date;
  end_time: Date;
}
