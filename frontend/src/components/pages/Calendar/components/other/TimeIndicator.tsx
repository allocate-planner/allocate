import { useEffect, useState } from "react";
import { format } from "date-fns";

const TimeIndicator = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const topPosition = () => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const pixelsPerMinute = 56 / 60;
    return minutes * pixelsPerMinute;
  };

  return (
    <div className="absolute w-full" style={{ top: `${topPosition()}px` }}>
      <div className="flex items-center translate-y-1/2">
        <div className="bg-red-300 text-white whitespace-nowrap text-xs px-1.5 py-0.5 rounded-sm ml-auto">
          {format(currentTime, "h:mm a")}
        </div>
        <div className="flex-grow h-px bg-red-200"></div>
      </div>
    </div>
  );
};

export default TimeIndicator;
