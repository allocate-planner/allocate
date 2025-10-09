import { useState, useCallback, useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { DndContext } from "@dnd-kit/core";

import { addDays, startOfWeek, getDay } from "date-fns";

import { useAuth } from "@/AuthProvider";
import type { ITransformedEvent, ISelectedEvent, IEvent } from "@/models/IEvent";

import EventPopup from "@/components/pages/Calendar/components/events/EventPopup";
import EventDetailPopup from "@/components/pages/Calendar/components/events/EventDetailPopup";

import { formatDate, formatISOFromTimeSlot, transformTo24HourFormat } from "@/utils/TimeUtils";

import { useCalendarEvents } from "@/components/pages/Calendar/hooks/useCalendarEvents";
import { useCalendarView } from "@/components/pages/Calendar/hooks/useCalendarView";
import { useWeekNavigation } from "@/components/pages/Calendar/hooks/useWeekNavigation";
import { useDrag } from "@/components/pages/Calendar/hooks/useDrag";
import { useOAuthCallback } from "@/components/pages/Calendar/hooks/useOAuthCallback";

import { CalendarHeader } from "@/components/pages/Calendar/components/core/CalendarHeader";
import { CalendarTimeColumn } from "@/components/pages/Calendar/components/core/CalendarTimeColumn";
import { CalendarGrid } from "@/components/pages/Calendar/components/core/CalendarGrid";
import TimeIndicator from "@/components/pages/Calendar/components/other/TimeIndicator";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/common/Command";

import { integrationsAtom } from "@/atoms/integrationsAtom";
import { integrationService } from "@/services/IntegrationService";

type ContextTarget =
  | { type: "event"; event: ITransformedEvent }
  | { type: "empty"; day: number; time: string };

interface IProps {
  transformEvents: (events: IEvent[]) => ITransformedEvent[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Calendar = ({ transformEvents, sidebarOpen, setSidebarOpen }: IProps) => {
  useOAuthCallback();

  const [selectedSlot, setSelectedSlot] = useState<ISelectedEvent | null>();
  const [isEventPopupOpen, setIsEventPopupOpen] = useState<boolean>(false);

  const [selectedEvent, setSelectedEvent] = useState<ITransformedEvent | null>();
  const [isEventDetailPopupOpen, setIsEventDetailPopupOpen] = useState<boolean>(false);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    target: ContextTarget;
  } | null>(null);

  const integrations = useAtomValue(integrationsAtom);
  const setIntegrations = useSetAtom(integrationsAtom);

  const gridRef = useRef<HTMLDivElement | null>(null);

  const { accessToken } = useAuth();

  const { createEvent, editEvent, deleteEvent } = useCalendarEvents({
    accessToken,
    transformEvents,
    setIsEventDetailPopupOpen,
    setIsEventPopupOpen,
  });

  const { currentWeek, moveByDays } = useWeekNavigation();

  const { sensors, onDragEnd } = useDrag({ createEvent, editEvent });
  const calendarView = useCalendarView();

  const weekStart = startOfWeek(currentWeek);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (contextMenu) {
          e.preventDefault();
          setContextMenu(null);
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [contextMenu]);

  const handleEventClick = (day: number, time: string) => {
    const timeSlot = transformTo24HourFormat(time).split(":").map(Number);
    const dateFromWeekAndDay = addDays(weekStart, day);

    const newEvent: ISelectedEvent = {
      date: formatDate(dateFromWeekAndDay),
      start_time: formatISOFromTimeSlot(timeSlot[0]!, timeSlot[1]!),
      end_time: formatISOFromTimeSlot(timeSlot[0]! + 1, timeSlot[1]!),
    };

    setSelectedSlot(newEvent);
    setIsEventPopupOpen(true);
  };

  const handleEventDetailsClick = useCallback((event: ITransformedEvent) => {
    setSelectedEvent(event);
    setIsEventDetailPopupOpen(true);
  }, []);

  useEffect(() => {
    const fetchIfEmpty = async () => {
      if (!accessToken) return;
      if (Object.keys(integrations).length > 0) return;

      try {
        const data = await integrationService.retrieveIntegrations(accessToken);
        setIntegrations(data);
      } catch {}
    };
    fetchIfEmpty();
  }, [accessToken, integrations, setIntegrations]);

  const openContextMenuAt = (e: React.MouseEvent, target: ContextTarget) => {
    e.preventDefault();

    const rect = gridRef.current?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : e.clientX;
    const y = rect ? e.clientY - rect.top : e.clientY;

    setContextMenu({ x, y, target });
  };

  const handleEmptyContextMenu = (
    day: number,
    time: string,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    openContextMenuAt(e, { type: "empty", day, time });
  };

  const handleEventContextMenu = (
    event: ITransformedEvent,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    openContextMenuAt(e, { type: "event", event });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleDeleteFromContext = async () => {
    if (contextMenu?.target.type === "event") {
      await deleteEvent(contextMenu.target.event);
      closeContextMenu();
    }
  };

  const handleCreateFromContext = () => {
    if (contextMenu?.target.type === "empty") {
      handleEventClick(contextMenu.target.day, contextMenu.target.time);
      closeContextMenu();
    }
  };
  const closeEventPopup = () => {
    setSelectedSlot(null);
    setIsEventPopupOpen(false);
  };

  const closeEventDetailPopup = () => {
    setSelectedEvent(null);
    setIsEventDetailPopupOpen(false);
  };

  const daysCount = calendarView === "single" ? 1 : calendarView === "triple" ? 3 : 7;
  const viewStartDate =
    calendarView === "single"
      ? currentWeek
      : calendarView === "triple"
        ? addDays(currentWeek, -1)
        : weekStart;

  const weekDays = Array.from({ length: daysCount }, (_, i) => addDays(viewStartDate, i));
  const daysOfWeek = weekDays.map(d => getDay(d));

  const gridCols =
    calendarView === "single"
      ? "grid-cols-[60px_1fr]"
      : calendarView === "triple"
        ? "grid-cols-[60px_repeat(3,1fr)]"
        : "grid-cols-[60px_repeat(7,1fr)]";

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="w-full flex flex-col items-start bg-gray-50 rounded-xl">
        <CalendarHeader
          moveByDays={moveByDays}
          calendarView={calendarView}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          weekDays={weekDays}
        />

        <div
          ref={gridRef}
          className={`${gridCols} grid row-span-48 h-full w-full overflow-y-scroll no-scrollbar relative`}
          onScroll={() => contextMenu && closeContextMenu()}
          onClick={() => contextMenu && closeContextMenu()}
        >
          <CalendarTimeColumn />
          <CalendarGrid
            daysOfWeek={daysOfWeek}
            calendarView={calendarView}
            onEventClick={handleEventClick}
            onEventDetailsClick={handleEventDetailsClick}
            onEmptyContextMenu={handleEmptyContextMenu}
            onEventContextMenu={handleEventContextMenu}
          />
          <TimeIndicator />
          {contextMenu && (
            <div
              className="absolute z-50"
              style={{ left: contextMenu.x, top: contextMenu.y }}
              onClick={e => e.stopPropagation()}
            >
              <Command className="rounded-lg border shadow-md min-w-[220px]">
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandGroup heading="Actions">
                    {contextMenu.target.type === "event" ? (
                      <>
                        {Object.entries(integrations)
                          .filter(([, connected]) => connected)
                          .map(([key]) => {
                            const iconPathMap: Record<string, string> = {
                              linear: "/brands/linear.svg",
                              notion: "/brands/notion.svg",
                              gmail: "/brands/gmail.svg",
                              github: "/brands/github.svg",
                              figma: "/brands/figma.svg",
                              slack: "/brands/slack.svg",
                            };

                            const label = `Add context with ${key.charAt(0).toUpperCase() + key.slice(1)}`;
                            const iconPath = iconPathMap[key] || "/brands/linear.svg";

                            return (
                              <CommandItem
                                key={key}
                                className="cursor-not-allowed bg-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-400 data-[selected=true]:bg-gray-100 data-[selected=true]:text-gray-400"
                              >
                                {label}
                                <img src={iconPath} alt={key} className="ml-auto h-4 w-4" />
                              </CommandItem>
                            );
                          })}
                        <CommandItem className="cursor-pointer" onSelect={handleDeleteFromContext}>
                          Delete Event
                        </CommandItem>
                      </>
                    ) : (
                      <CommandItem className="cursor-pointer" onSelect={handleCreateFromContext}>
                        Create Event
                      </CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
          {selectedSlot && (
            <EventPopup
              isOpen={isEventPopupOpen}
              event={selectedSlot}
              onClose={closeEventPopup}
              onCreate={createEvent}
            />
          )}

          {selectedEvent && (
            <EventDetailPopup
              isOpen={isEventDetailPopupOpen}
              event={selectedEvent}
              onClose={closeEventDetailPopup}
              onEdit={editEvent}
              onDelete={deleteEvent}
            />
          )}
        </div>
      </div>
    </DndContext>
  );
};

export default Calendar;
