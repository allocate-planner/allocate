import { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  EventEditSchema,
  type IEditEvent,
  type ITransformedEvent,
  type IEventUpdate,
} from "@/models/IEvent";
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
import { Textarea } from "@/components/common/Textarea";

import { convertToISO, convertToTimePeriodFromHHmm, times } from "@/utils/TimeUtils";

const rruleOptions = [
  { label: "Does not repeat", value: "DNR" },
  { label: "Every day", value: "FREQ=DAILY" },
  { label: "Every week", value: "FREQ=WEEKLY" },
  { label: "Every month", value: "FREQ=MONTHLY" },
  { label: "Every year", value: "FREQ=YEARLY" },
];

const colourOptions = ["#8D85D2", "#86B89A", "#A9C7EA", "#F7CEB7", "#E09BA7", "#C3CEDC"];

interface IProps {
  isOpen: boolean;
  event: ITransformedEvent;
  onClose: () => void;
  onEdit: (event: IEventUpdate) => Promise<boolean>;
  onDelete: (event: ITransformedEvent) => Promise<boolean>;
}

const EventDetailPopup = ({ isOpen, event, onClose, onEdit, onDelete }: IProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IEditEvent>({
    resolver: zodResolver(EventEditSchema),
    defaultValues: {
      title: event.title,
      description: event.description ?? "",
      location: event.location ?? "",
      start_time: convertToTimePeriodFromHHmm(event.start_time),
      end_time: convertToTimePeriodFromHHmm(event.end_time),
      rrule: event.rrule ?? "DNR",
      colour: event.colour,
    },
  });

  const onSubmit = (data: IEditEvent) => {
    const newEvent: IEventUpdate = {
      ...event,
      title: data.title,
      description: data.description,
      location: data.location,
      start_time: convertToISO(data.start_time),
      end_time: convertToISO(data.end_time),
      rrule: data.rrule === "DNR" ? undefined : data.rrule,
      colour: data.colour ?? "#8D85D2",
      previous_date: event.date,
      previous_start_time: event.start_time,
      previous_end_time: event.end_time,
    };

    onEdit(newEvent);
  };

  useEffect(() => {
    if (isOpen) {
      reset({
        title: event.title,
        description: event.description ?? "",
        location: event.location ?? "",
        start_time: convertToTimePeriodFromHHmm(event.start_time),
        end_time: convertToTimePeriodFromHHmm(event.end_time),
        rrule: event.rrule ?? "DNR",
        colour: event.colour,
      });
    }
  }, [
    isOpen,
    event.title,
    event.description,
    event.location,
    event.start_time,
    event.end_time,
    event.rrule,
    event.colour,
    reset,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[475px]" onWheel={e => e.stopPropagation()}>
        <DialogHeader className="space-y-4">
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Edit, or delete your event. Click Save when you&apos;re done, or click delete to remove
            the item from your calendar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col justify-between items-start w-full space-y-4">
            <div className="flex flex-row items-center justify-between space-x-4 w-full">
              <Label htmlFor="title" className="w-1/3">
                Title
              </Label>
              <div className="flex flex-col w-2/3">
                <Input
                  id="title"
                  placeholder="Call with Joe"
                  className="w-full"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-row items-center justify-between space-x-4 w-full">
              <Label htmlFor="description" className="w-1/3">
                Description
              </Label>
              <div className="flex flex-col w-2/3">
                <Textarea
                  id="description"
                  placeholder="Discuss new Product Name"
                  className="w-full"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-row items-center justify-between space-x-4 w-full">
              <Label className="w-1/3">Time</Label>
              <div className="flex flex-row justify-center items-center w-2/3 space-x-2">
                <Controller
                  name="start_time"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Start Time</SelectLabel>
                          {times.map((time, index) => (
                            <SelectItem key={index} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Label>To</Label>
                <Controller
                  name="end_time"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder={field.value} />
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
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between space-x-4 w-full">
              <Label className="w-1/3">Repeat</Label>
              <div className="flex flex-row justify-center items-center w-2/3">
                <Controller
                  name="rrule"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? "DNR"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Does not repeat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Repeat</SelectLabel>
                          {rruleOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between space-x-4 w-full">
              <Label htmlFor="location" className="w-1/3">
                Location
              </Label>
              <div className="flex flex-col w-2/3">
                <Input
                  id="location"
                  placeholder="1600 Amphitheatre Parkway"
                  className="w-full"
                  {...register("location")}
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-row items-center justify-between space-x-4 w-full">
              <Label className="w-1/3">Colour</Label>
              <div className="flex flex-row items-center space-x-2 w-2/3">
                <Controller
                  name="colour"
                  control={control}
                  render={({ field }) => (
                    <div className="flex space-x-2">
                      {colourOptions.map(colour => (
                        <button
                          type="button"
                          key={colour}
                          onClick={() => field.onChange(colour)}
                          className={`w-6 h-6 rounded-full transition-all ${field.value === colour ? "ring-1 ring-offset-2 ring-gray-800 scale-110" : ""}`}
                          style={{ backgroundColor: colour }}
                        />
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>

            {(errors.start_time || errors.end_time) && (
              <div className="w-full">
                {errors.start_time && (
                  <p className="text-red-500 text-xs">{errors.start_time.message}</p>
                )}
                {errors.end_time && (
                  <p className="text-red-500 text-xs">{errors.end_time.message}</p>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-row justify-between w-full mt-6">
            <Button
              className="bg-red-500 hover:bg-red-700"
              type="submit"
              onClick={e => {
                e.preventDefault();
                onDelete(event);
              }}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
            <Button className="bg-violet-500 hover:bg-violet-700" type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailPopup;
