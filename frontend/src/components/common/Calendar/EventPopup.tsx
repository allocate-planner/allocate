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

const EventPopup = () => {
  return (
    <Dialog>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-4">
          <DialogTitle>Add to Calendar</DialogTitle>
          <DialogDescription>
            Add an event to your calendar here! Click Create when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-start items-start">
          <div className="flex flex-row items-center space-x-4">
            <Label htmlFor="name" className="text-right">
              Event Title
            </Label>
            <Input id="name" placeholder="New Event" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button className="bg-violet-500 hover:bg-violet-700" type="submit">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventPopup;
