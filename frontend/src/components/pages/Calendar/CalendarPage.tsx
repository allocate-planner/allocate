import { useEffect } from "react";

import Sidebar from "@/components/common/Calendar/Sidebar";
import Calendar from "@/components/common/Calendar/Calendar";

const CalendarPage = () => {
  useEffect(() => {
    document.title = "allocate — Calendar";
  }, []);

  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <Calendar />
    </div>
  );
};

export default CalendarPage;
