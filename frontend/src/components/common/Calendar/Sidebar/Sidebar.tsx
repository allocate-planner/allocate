import { useAuth } from "@/AuthProvider";

import {
  CalendarDaysIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import SpeechComponent from "@/components/common/Calendar/SpeechComponent";
import SettingsPopup from "@/components/common/Settings/SettingsPopup";

import { audioService } from "@/services/AudioService";
import { userService } from "@/services/UserService";
import { useState } from "react";

import HamburgerMenu from "@/components/common/Calendar/Sidebar/HamburgerMenu";
import MenuList from "@/components/common/Calendar/Sidebar/MenuList";
import UserInfo from "@/components/common/Calendar/Sidebar/UserInfo";

interface IProps {
  eventData: (startDate: string, endDate: string) => void;
  dateData: (currentWeek: Date) => { startDate: string; endDate: string };
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

type Icon = React.ComponentType<React.ComponentProps<"svg">>;
export type MenuItem = {
  icon: Icon;
  title?: string;
  hasBackground?: boolean;
  onClick?: () => void;
  customContent?: React.ReactNode;
};

const Sidebar = (props: IProps) => {
  const navigate = useNavigate();

  const { firstName, lastName, emailAddress, getAccessToken, updateAuthentication } = useAuth();
  const accessToken = getAccessToken();
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

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

  const menuItems: MenuItem[] = [
    {
      icon: CalendarDaysIcon,
      title: "Calendar",
      hasBackground: true,
    },
    {
      icon: Cog6ToothIcon,
      title: "Settings",
      onClick: () => setSettingsOpen(true),
    },
    {
      icon: MicrophoneIcon,
      customContent: <SpeechComponent onProcess={processAudio} />,
    },
  ];

  if (props.sidebarOpen) {
    return (
      <HamburgerMenu
        sidebarOpen={props.sidebarOpen}
        setSidebarOpen={props.setSidebarOpen}
        menuItems={menuItems}
        firstName={firstName}
        lastName={lastName}
        emailAddress={emailAddress}
        onLogout={logout}
      />
    );
  }

  return (
    <nav className="hidden h-screen w-72 lg:flex flex-col justify-between border-r-[1px] border-gray-200 flex-shrink-0">
      <div className="flex flex-col">
        <div className="border-b-[1px] border-gray-200 flex flex-col justify-between items-center p-12">
          <img src="/logo.svg" alt="Allocate Logo" />
        </div>
        <MenuList menuItems={menuItems} />
      </div>
      <UserInfo
        firstName={firstName}
        lastName={lastName}
        emailAddress={emailAddress}
        onLogout={logout}
      />

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
