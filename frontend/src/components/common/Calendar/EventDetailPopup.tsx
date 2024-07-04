import { ITransformedEvent } from "@/models/IEvent";
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
import { useState } from "react";

interface IProps {
  isOpen: boolean;
  event: ITransformedEvent;
  onClose: () => void;
  onEdit: (event: ITransformedEvent, title: string) => void;
  onDelete: (event: ITransformedEvent) => void;
}

const EventDetailPopup = (props: IProps) => {
  const [title, setTitle] = useState<string>(props.event.title);

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-4">
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Edit, or delete your event. Click Save when you're done, or click
            delete to remove the item from your calendar.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-start items-start">
          <div className="flex flex-row items-center justify-between space-x-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-row justify-between w-full">
          <Button
            className="bg-red-500 hover:bg-red-700"
            type="submit"
            onClick={() => {
              props.onDelete(props.event);
            }}
          >
            Delete
          </Button>
          <Button
            className="bg-violet-500 hover:bg-violet-700"
            type="submit"
            onClick={() => {
              props.onEdit(props.event, title);
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
