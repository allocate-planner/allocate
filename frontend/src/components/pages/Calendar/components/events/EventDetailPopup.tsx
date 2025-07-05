import { useState } from "react";
import { toast } from "sonner";

import type { ITransformedEvent } from "@/models/IEvent";
import { Button } from "@/components/common/Button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/common/Dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select";

import { Input } from "@/components/common/Input";
import { Label } from "@/components/common/Label";

import { compareDates, convertToISO, convertToTimePeriodFromHHmm, times } from "@/utils/TimeUtils";

interface IProps {
  isOpen: boolean;
  event: ITransformedEvent;
  onClose: () => void;
  onEdit: (event: ITransformedEvent) => Promise<boolean>;
  onDelete: (eventId: number) => Promise<boolean>;
}

const EventDetailPopup = ({ isOpen, event, onClose, onEdit, onDelete }: IProps) => {
  const [title, setTitle] = useState<string>(event.title);
  const [description, setDescription] = useState<string>(event.description ?? "");
  const [location, setLocation] = useState<string>(event.location ?? "");
  const [startTime, setStartTime] = useState<string>(convertToTimePeriodFromHHmm(event.start_time));
  const [endTime, setEndTime] = useState<string>(convertToTimePeriodFromHHmm(event.end_time));

  const handleEventUpdate = () => {
    if (startTime === endTime) {
      toast.error("Start time must be different than end time");
      return;
    }

    if (compareDates(startTime, endTime)) {
      toast.error("Start time must be before the end time");
      return;
    }

    if (title.length == 0) {
      toast.error("A title must be provided");
      return;
    }

    const newEvent = {
      ...event,
      title: title,
      description: description,
      location: location,
      start_time: convertToISO(startTime),
      end_time: convertToISO(endTime),
    };

    onEdit(newEvent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-4">
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Edit, or delete your event. Click Save when you&apos;re done, or click delete to remove
            the item from your calendar.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-between items-start w-full space-y-4">
          <div className="flex flex-row items-center justify-between space-x-4 w-full">
            <Label htmlFor="title" className="w-1/3">
              Title
            </Label>
            <Input
              id="title"
              defaultValue={title}
              placeholder="Call with Joe"
              onChange={e => setTitle(e.target.value)}
              className="w-2/3"
            />
          </div>
          <div className="flex flex-row items-center justify-between space-x-4 w-full">
            <Label htmlFor="description" className="w-1/3">
              Description
            </Label>
            <Input
              id="description"
              defaultValue={description}
              placeholder="Discuss new Product Name"
              onChange={e => setDescription(e.target.value)}
              className="w-2/3"
            />
          </div>
          <div className="flex flex-row items-center justify-between space-x-4 w-full">
            <Label htmlFor="location" className="w-1/3">
              Location
            </Label>
            <Input
              id="location"
              defaultValue={location}
              placeholder="1600 Amphitheatre Parkway"
              onChange={e => setLocation(e.target.value)}
              className="w-2/3"
            />
          </div>
          <div className="flex flex-row items-center justify-between space-x-4 w-full">
            <Label className="w-1/3">Time</Label>
            <div className="flex flex-row justify-center items-center w-2/3 space-x-2">
              <Select
                onValueChange={value => {
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
                      <SelectItem key={index} value={time} onClick={() => setStartTime(time)}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Label>To</Label>
              <Select
                onValueChange={value => {
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
        <DialogFooter className="flex flex-row justify-between w-full">
          <Button
            className="bg-red-500 hover:bg-red-700"
            type="submit"
            onClick={() => {
              onDelete(event.id);
            }}
          >
            Delete
          </Button>
          <Button
            className="bg-violet-500 hover:bg-violet-700"
            type="submit"
            onClick={() => {
              handleEventUpdate();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailPopup;
