import { useAuth } from "@/AuthProvider";

import {
  CalendarDaysIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import SpeechComponent from "./SpeechComponent";
import SettingsPopup from "../Settings/SettingsPopup";

import { audioService } from "@/services/AudioService";
import { userService } from "@/services/UserService";
import { useState } from "react";

interface IProps {
  eventData: (startDate: string, endDate: string) => void;
  dateData: (currentWeek: Date) => { startDate: string; endDate: string };
}

const Sidebar = (props: IProps) => {
  const navigate = useNavigate();

  const { firstName, lastName, emailAddress, getAccessToken, updateAuthentication } = useAuth();

  const accessToken = getAccessToken();

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const logout = async () => {
    try {
      await userService.logout();

      toast.success("You have successfully been logged out!");

      updateAuthentication(false);
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong when logging out.");
    }
  };

  const processAudio = async (audio: Blob) => {
    try {
      if (accessToken) {
        await audioService.processAudio(audio, accessToken);
        toast.success("Audio successfully processed");

        const { startDate, endDate } = props.dateData(new Date());

        props.eventData(startDate, endDate);
      }
    } catch (error) {
      toast.error("Audio not processed");
    }
  };

  const closeSettings = () => {
    setSettingsOpen(false);
  };

  return (
    <nav className="hidden h-screen w-72 lg:flex flex-col justify-between border-r-[1px] border-gray-200 flex-shrink-0">
      <div className="flex flex-col">
        <div className="border-b-[1px] border-gray-200 flex flex-col justify-between items-center p-12">
          <img src="/logo.svg" alt="Allocate Logo" />
        </div>
        <div className="mt-4 flex flex-col items-center space-y-2">
          <div className="flex flex-row items-center space-x-2 border border-1 border-[#DBDBDB] rounded-xl bg-[#F8F8F8] w-4/5 py-1 hover:cursor-pointer">
            <CalendarDaysIcon className="ml-2 w-6 h-6" />
            <h2>Calendar</h2>
          </div>
          <div
            onClick={() => setSettingsOpen(true)}
            className="flex flex-row items-center space-x-2 w-4/5 py-1 hover:cursor-pointer"
          >
            <Cog6ToothIcon className="ml-2 w-6 h-6" />
            <h1>Settings</h1>
          </div>
          <div className="flex flex-row items-center space-x-2 w-4/5 py-1 hover:cursor-pointer">
            <MicrophoneIcon className="ml-2 w-6 h-6" />
            <SpeechComponent onProcess={processAudio} />
          </div>
        </div>
      </div>
      <div className="border-t-[1px] border-gray-200 flex flex-row justify-between items-center p-6">
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

      {settingsOpen && (
        <SettingsPopup
          firstName={firstName}
          lastName={lastName}
          emailAddress={emailAddress}
          isOpen={settingsOpen}
          onClose={closeSettings}
        />
      )}
    </nav>
  );
};

export default Sidebar;
