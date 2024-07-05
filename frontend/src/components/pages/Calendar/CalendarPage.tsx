import { useEffect } from "react";

import Sidebar from "@/components/common/Calendar/Sidebar";
import Calendar from "@/components/common/Calendar/Calendar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/AuthProvider";

const CalendarPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "allocate — Calendar";

    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <Calendar />
    </div>
  );
};

export default CalendarPage;
