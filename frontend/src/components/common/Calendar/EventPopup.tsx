import { useState } from "react";

import { IEventCreate } from "@/models/IEvent";
import { Button } from "../Button";

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
import { toast } from "sonner";

import {
  compareDates,
  convertToISO,
  convertToTimePeriodFromISO,
  times,
} from "@/utils/TimeUtils";

interface IProps {
  isOpen: boolean;
  event: IEventCreate;
  onClose: () => void;
  onCreate: (event: IEventCreate) => void;
}

const backgroundColours = [
  "#FD8A8A",
  "#FFCBCB",
  "#9EA1D4",
  "#F1F7B5",
  "#A8D1D1",
  "#DFEBEB",
];

const EventPopup = (props: IProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [startTime, setStartTime] = useState<string>(
    convertToTimePeriodFromISO(props.event.start_time)
  );
  const [endTime, setEndTime] = useState<string>(
    convertToTimePeriodFromISO(props.event.end_time)
  );

  const handleEventCreation = () => {
    if (compareDates(startTime, endTime)) {
      toast.error("Start time must be before the end time");
      return;
    }

    const newEvent = {
      ...props.event,
      title: title,
      description: description,
      location: location,
      colour:
        backgroundColours[Math.floor(Math.random() * backgroundColours.length)],
      start_time: convertToISO(startTime),
      end_time: convertToISO(endTime),
    };

    props.onCreate(newEvent);
  };

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
            <Label htmlFor="title" className="w-1/3">
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
            <Label className="w-1/3">Time</Label>
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
