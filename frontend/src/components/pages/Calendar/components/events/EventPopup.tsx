import { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/common/Button";
import { Check } from "lucide-react";

import { EventCreateSchema, type ISelectedEvent, type IEventCreate } from "@/models/IEvent";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/common/Dialog";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/Popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/common/Command";
import { cn } from "@/lib/utils";

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

const colourOptions = ["#8D85D2", "#86B89A", "#A9C7EA", "#F7CEB7", "#E09BA7", "#C3CEDC"];

interface IProps {
  isOpen: boolean;
  event: ISelectedEvent;
  onClose: () => void;
  onCreate: (event: IEventCreate) => void;
}

const EventPopup = ({ isOpen, event, onClose, onCreate }: IProps) => {
  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [rruleOpen, setRruleOpen] = useState<boolean>(false);

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
      colour: "#8D85D2",
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
    onClose();
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
        colour: "#8D85D2",
      });
    }
  }, [isOpen, event.date, event.start_time, event.end_time, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]" onWheel={e => e.stopPropagation()}>
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
                    <Popover open={startOpen} onOpenChange={setStartOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={startOpen}
                          className="w-full justify-between"
                        >
                          {field.value || "Start"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search time..." />
                          <CommandList>
                            <CommandEmpty>No results.</CommandEmpty>
                            <CommandGroup>
                              {times.map((time, index) => (
                                <CommandItem
                                  key={index}
                                  value={time}
                                  onSelect={(val: string) => {
                                    field.onChange(val);
                                    setStartOpen(false);
                                  }}
                                >
                                  {time}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === time ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <Label>To</Label>
                <Controller
                  name="end_time"
                  control={control}
                  render={({ field }) => (
                    <Popover open={endOpen} onOpenChange={setEndOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={endOpen}
                          className="w-full justify-between"
                        >
                          {field.value || "End"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search time..." />
                          <CommandList>
                            <CommandEmpty>No results.</CommandEmpty>
                            <CommandGroup>
                              {times.map((time, index) => (
                                <CommandItem
                                  key={index}
                                  value={time}
                                  onSelect={(val: string) => {
                                    field.onChange(val);
                                    setEndOpen(false);
                                  }}
                                >
                                  {time}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === time ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                    <Popover open={rruleOpen} onOpenChange={setRruleOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={rruleOpen}
                          className="w-full justify-between"
                        >
                          {rruleOptions.find(o => o.value === (field.value ?? "DNR"))?.label ||
                            "Does not repeat"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[240px] p-0">
                        <Command>
                          <CommandInput placeholder="Search repeat..." />
                          <CommandList>
                            <CommandEmpty>No results.</CommandEmpty>
                            <CommandGroup>
                              {rruleOptions.map(option => (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  onSelect={(val: string) => {
                                    field.onChange(val);
                                    setRruleOpen(false);
                                  }}
                                >
                                  {option.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      (field.value ?? "DNR") === option.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
