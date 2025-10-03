import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { toast } from "sonner";

import { CalendarDaysIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

import { useAuth } from "@/AuthProvider";
import { audioService } from "@/services/AudioService";
import { scheduledEventsAtom } from "@/atoms/eventsAtom";
import type { IStoredUser } from "@/models/IUser";

import OrbComponent from "@/components/pages/Calendar/components/other/OrbComponent";
import SpeechComponent from "@/components/pages/Calendar/components/other/SpeechComponent";
import SettingsPopup from "@/components/pages/Calendar/components/settings/SettingsPopup";

import HamburgerMenu from "@/components/pages/Calendar/components/sidebar/HamburgerMenu";
import MenuList from "@/components/pages/Calendar/components/sidebar/MenuList";
import UserInfo from "@/components/pages/Calendar/components/sidebar/UserInfo";

interface IProps {
  sidebarOpen: boolean;
  onEventsUpdate?: () => Promise<void>;
}

type Icon = React.ComponentType<React.ComponentProps<"svg">>;
export type MenuItem = {
  icon?: Icon;
  title?: string;
  classNames?: string;
  hasBackground?: boolean;
  onClick?: () => void;
  customContent?: React.ReactNode;
};

const Sidebar = ({ sidebarOpen, onEventsUpdate }: IProps) => {
  const navigate = useNavigate();

  const { firstName, lastName, emailAddress, accessToken, logout, login } = useAuth();

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const scheduledEvents = useAtomValue(scheduledEventsAtom);

  if (!accessToken) {
    toast.error("Authentication required");
    return false;
  }

  const logoutUser = async () => {
    try {
      logout();
      toast.success("You have successfully been logged out!");
      navigate("/");
    } catch {
      toast.error("Something went wrong when logging out.");
    }
  };

  const processAudio = async (audio: Blob) => {
    try {
      if (accessToken) {
        await audioService.processAudio(audio, accessToken, scheduledEvents);
        onEventsUpdate?.();
        toast.success("Audio successfully processed");
      }
    } catch {
      toast.error("Audio not processed");
    }
  };

  const closeSettings = () => {
    setSettingsOpen(false);
  };

  const handleUserUpdate = (updatedUser: IStoredUser) => {
    if (updatedUser) {
      login(updatedUser);
    }
  };

  const [stopSignal, setStopSignal] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessingRecording, setIsProcessingRecording] = useState<boolean>(false);

  const handleRecordingChange = (recording: boolean) => {
    setIsRecording(recording);
  };

  const handleProcessingChange = (processing: boolean) => {
    setIsProcessingRecording(processing);
  };

  const handleOrbStop = () => {
    setStopSignal(previous => previous + 1);
    setIsRecording(false);
    setIsProcessingRecording(false);
  };

  const handleProcessAudio = async (audio: Blob) => {
    await processAudio(audio);
  };

  const menuItems: MenuItem[] = [
    { icon: CalendarDaysIcon, title: "Calendar", hasBackground: true },
    { icon: Cog6ToothIcon, title: "Settings", onClick: () => setSettingsOpen(true) },
    {
      customContent: (
        <SpeechComponent
          onProcess={handleProcessAudio}
          onRecordingChange={handleRecordingChange}
          onProcessingChange={handleProcessingChange}
          stopSignal={stopSignal}
          isProcessing={isProcessingRecording}
        />
      ),
      classNames: isRecording || isProcessingRecording ? "hidden" : "",
    },
  ];

  if (sidebarOpen) {
    return (
      <HamburgerMenu
        sidebarOpen={sidebarOpen}
        menuItems={menuItems}
        firstName={firstName}
        lastName={lastName}
        emailAddress={emailAddress}
        onLogout={logoutUser}
        footerContent={
          isRecording || isProcessingRecording ? (
            <OrbComponent onStop={handleOrbStop} isProcessing={isProcessingRecording} />
          ) : null
        }
      />
    );
  }

  return (
    <nav className="hidden h-screen w-72 lg:flex flex-col justify-between border-r-[1px] border-gray-200 flex-shrink-0">
      <div className="flex flex-col flex-1">
        <div className="border-b-[1px] border-gray-200 flex flex-col justify-between items-center p-12">
          <img
            src="/logo.svg"
            alt="Allocate Logo"
            className="cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <MenuList menuItems={menuItems} />
      </div>
      {isRecording || isProcessingRecording ? (
        <div className="px-6 pb-4">
          <OrbComponent onStop={handleOrbStop} isProcessing={isProcessingRecording} />
        </div>
      ) : null}
      <UserInfo
        firstName={firstName}
        lastName={lastName}
        emailAddress={emailAddress}
        onLogout={logoutUser}
      />

      {settingsOpen && (
        <SettingsPopup
          firstName={firstName}
          lastName={lastName}
          emailAddress={emailAddress}
          accessToken={accessToken}
          isOpen={settingsOpen}
          onClose={closeSettings}
          onUserUpdate={handleUserUpdate}
        />
      )}
    </nav>
  );
};

export default Sidebar;
