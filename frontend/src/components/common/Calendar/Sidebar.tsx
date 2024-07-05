import { useAuth } from "@/AuthProvider";
import { userService } from "@/services/UserService";

import {
  CalendarDaysIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Sidebar = () => {
  const navigate = useNavigate();
  const { firstName, lastName, emailAddress, updateAuthentication } = useAuth();

  const logout = async () => {
    try {
      await userService.logout();

      toast.success("You have successfully been logged out!");

      updateAuthentication(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong when logging out.");
    }
  };

  return (
    <nav className="h-screen w-[12.5%] flex flex-col justify-between border-r-[1px] border-gray-300">
      <div className="flex flex-col">
        <div className="border-b-[1px] border-gray-300 flex flex-col justify-between items-center p-12">
          <img src="/logo.svg" alt="Allocate Logo" />
        </div>
        <div className="mt-4 flex flex-col items-center space-y-2">
          <div className="flex flex-row items-center space-x-2 border border-1 border-[#DBDBDB] rounded-xl bg-[#F8F8F8] w-4/5 py-1">
            <CalendarDaysIcon className="ml-2 w-6 h-6" />
            <h2>Calendar</h2>
          </div>
          <div className="flex flex-row items-center space-x-2 w-4/5 py-1">
            <Cog6ToothIcon className="ml-2 w-6 h-6" />
            <h1>Settings</h1>
          </div>
        </div>
      </div>
      <div className="border-t-[1px] border-gray-300 flex flex-row justify-between items-center p-6">
        <div className="flex flex-col">
          <h1 className="font-bold">
            {firstName} {lastName}
          </h1>
          <h2 className="font-light text-sm">{emailAddress}</h2>
        </div>
        <ArrowLeftStartOnRectangleIcon
          className="w-6 h-6 hover:cursor-pointer"
          onClick={() => logout()}
        />
      </div>
    </nav>
  );
};

export default Sidebar;
