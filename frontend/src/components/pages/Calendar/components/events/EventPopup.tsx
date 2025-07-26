import { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/common/Button";

import { EventCreateSchema, type ISelectedEvent, type IEventCreate } from "@/models/IEvent";

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

import { convertToISO, convertToTimePeriodFromISO, times } from "@/utils/TimeUtils";
import { Textarea } from "@/components/common/Textarea";

const rruleOptions = [
  { label: "Does not repeat", value: "DNR" },
  { label: "Every day", value: "FREQ=DAILY" },
  { label: "Every week", value: "FREQ=WEEKLY" },
  { label: "Every month", value: "FREQ=MONTHLY" },
  { label: "Every year", value: "FREQ=YEARLY" },
];

const colourOptions = ["#FD8A8A", "#FFCBCB", "#9EA1D4", "#F1F7B5", "#A8D1D1", "#DFEBEB"];

interface IProps {
  isOpen: boolean;
  event: ISelectedEvent;
  onClose: () => void;
  onCreate: (event: IEventCreate) => void;
}

const EventPopup = ({ isOpen, event, onClose, onCreate }: IProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IEventCreate>({
    resolver: zodResolver(EventCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date: event.date,
      start_time: convertToTimePeriodFromISO(event.start_time),
      end_time: convertToTimePeriodFromISO(event.end_time),
      rrule: "DNR",
      colour: "#FD8A8A",
    },
  });

  const onSubmit = (data: IEventCreate) => {
    const newEvent = {
      ...event,
      ...data,
      start_time: convertToISO(data.start_time),
      end_time: convertToISO(data.end_time),
    };

    onCreate(newEvent);
  };

  useEffect(() => {
    if (isOpen) {
      reset({
        title: "",
        description: "",
        location: "",
        date: event.date,
        start_time: convertToTimePeriodFromISO(event.start_time),
        end_time: convertToTimePeriodFromISO(event.end_time),
        rrule: "DNR",
        colour: "#FD8A8A",
      });
    }
  }, [isOpen, event.date, event.start_time, event.end_time, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[475px]" onWheel={e => e.stopPropagation()}>
        <DialogHeader className="space-y-4">
          <DialogTitle>Add to Calendar</DialogTitle>
          <DialogDescription>
            Add an event to your calendar here! Click Create when you&apos;re done.
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
          <DialogFooter className="mt-6">
            <Button className="bg-violet-500 hover:bg-violet-700" type="submit">
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventPopup;
