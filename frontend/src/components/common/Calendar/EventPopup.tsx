import { useState, useEffect } from "react";

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

import { Input } from "../Input";
import { Label } from "../Label";

interface IProps {
  isOpen: boolean;
  event: IEventCreate;
  onClose: () => void;
  onCreate: (title: string, event: IEventCreate) => void;
}

const EventPopup = (props: IProps) => {
  const [title, setTitle] = useState<string>("");

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
        <div className="flex flex-col justify-start items-start">
          <div className="flex flex-row items-center justify-between space-x-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              placeholder="New Event"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="bg-violet-500 hover:bg-violet-700"
            type="submit"
            onClick={() => {
              props.onCreate(title, props.event);
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
