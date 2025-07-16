import { useEffect, useState } from "react";
import { format } from "date-fns";

const HOUR_CONTENT_HEIGHT = 56;
const MINUTES_PER_HOUR = 60;
const TIME_INTERVAL = 60_000;

const TimeIndicator = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), TIME_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const topPosition = () => {
    const minutes = currentTime.getHours() * MINUTES_PER_HOUR + currentTime.getMinutes();
    const hoursElapsed = Math.floor(minutes / MINUTES_PER_HOUR);
    return minutes * (HOUR_CONTENT_HEIGHT / MINUTES_PER_HOUR) + hoursElapsed;
  };

  return (
    <div className="absolute w-full" style={{ top: `${topPosition()}px` }}>
      <div className="flex items-center -translate-y-1/2">
        <div className="bg-red-300 text-white whitespace-nowrap text-xs px-1.5 py-0.5 rounded-sm ml-auto">
          {format(currentTime, "h:mm a")}
        </div>
        <div className="flex-grow h-px bg-red-200" />
      </div>
    </div>
  );
};

export default TimeIndicator;
