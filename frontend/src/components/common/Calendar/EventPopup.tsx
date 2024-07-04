import { useState, useEffect } from "react";

import { IEventCreate } from "@/models/IEvent";
import { Button } from "../Button";

import { parse, format, parseISO } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../Dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../Select";

import { Input } from "../Input";
import { Label } from "../Label";

const times = [
  "12:00am",
  "01:00am",
  "02:00am",
  "03:00am",
  "04:00am",
  "05:00am",
  "06:00am",
  "07:00am",
  "08:00am",
  "09:00am",
  "10:00am",
  "11:00am",
  "12:00pm",
  "01:00pm",
  "02:00pm",
  "03:00pm",
  "04:00pm",
  "05:00pm",
  "06:00pm",
  "07:00pm",
  "08:00pm",
  "09:00pm",
  "10:00pm",
  "11:00pm",
];

interface IProps {
  isOpen: boolean;
  event: IEventCreate;
  onClose: () => void;
  onCreate: (event: IEventCreate) => void;
}

const EventPopup = (props: IProps) => {
  const convertToAMPM = (time: string) => {
    const dummyISOString = `1970-01-01T${time}`;

    return format(parseISO(dummyISOString), "hh:mma").toLowerCase();
  };

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [startTime, setStartTime] = useState<string>(
    convertToAMPM(props.event.start_time)
  );
  const [endTime, setEndTime] = useState<string>(
    convertToAMPM(props.event.end_time)
  );

  const convertToISO = (time: string) => {
    return format(parse(time, "hh:mma", new Date()), "HH:mm:ss" + "+01:00");
  };

  const handleEventCreation = () => {
    const newEvent = {
      ...props.event,
      title: title,
      description: description,
      location: location,
      start_time: convertToISO(startTime),
      end_time: convertToISO(endTime),
    };

    console.log(newEvent);

    props.onCreate(newEvent);
  };

  useEffect(() => {
    if (props.isOpen) {
      setTitle("");
    }
  }, [props.isOpen]);

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-4">
          <DialogTitle>Add to Calendar</DialogTitle>
          <DialogDescription>
            Add an event to your calendar here! Click Create when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-between items-start w-full space-y-4">
          <div className="flex flex-row items-center justify-between space-x-4 w-full">
            <Label htmlFor="name" className="w-1/3">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Call with Joe"
              onChange={(e) => setTitle(e.target.value)}
              className="w-2/3"
            />
          </div>
          <div className="flex flex-row items-center justify-between space-x-4 w-full">
            <Label htmlFor="description" className="w-1/3">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Discuss new Product Name"
              onChange={(e) => setDescription(e.target.value)}
              className="w-2/3"
            />
          </div>
          <div className="flex flex-row items-center justify-between space-x-4 w-full">
            <Label htmlFor="location" className="w-1/3">
              Location
            </Label>
            <Input
              id="location"
              placeholder="1600 Amphitheatre Parkway"
              onChange={(e) => setLocation(e.target.value)}
              className="w-2/3"
            />
          </div>
          <div className="flex flex-row items-center justify-between space-x-4 w-full">
            <Label htmlFor="time" className="w-1/3">
              Time
            </Label>
            <div className="flex flex-row justify-center items-center w-2/3 space-x-2">
              <Select
                onValueChange={(value) => {
                  setStartTime(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={startTime} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Start Time</SelectLabel>
                    {times.map((time, index) => (
                      <SelectItem
                        key={index}
                        value={time}
                        onClick={() => setStartTime(time)}
                      >
                        {time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Label>To</Label>
              <Select
                onValueChange={(value) => {
                  setEndTime(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={endTime} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>End Time</SelectLabel>
                    {times.map((time, index) => (
                      <SelectItem key={index} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="bg-violet-500 hover:bg-violet-700"
            type="submit"
            onClick={() => {
              handleEventCreation();
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventPopup;
