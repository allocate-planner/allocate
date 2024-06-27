import Sidebar from "@/components/common/Calendar/Sidebar";
import Calendar from "@/components/common/Calendar/Calendar";

const CalendarPage = () => {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <Calendar />
    </div>
  );
};

export default CalendarPage;
