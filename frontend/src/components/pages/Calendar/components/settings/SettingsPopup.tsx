import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/common/Dialog";

import { UserIcon, CalendarIcon, LinkIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

import AccountTab from "@/components/pages/Calendar/components/settings/tabs/AccountTab";
import ImportTab from "@/components/pages/Calendar/components/settings/tabs/ImportTab";
import IntegrationsTab from "@/components/pages/Calendar/components/settings/tabs/IntegrationsTab";
import CalendarTab from "@/components/pages/Calendar/components/settings/tabs/CalendarTab";
import type { IStoredUser } from "@/models/IUser";

interface IProps {
  isOpen: boolean;
  firstName: string;
  lastName: string;
  emailAddress: string;
  accessToken: string;
  onClose: () => void;
  onUserUpdate?: (updatedUser: IStoredUser) => void;
}

const SettingsPopup = (props: IProps) => {
  const [selectedSettingsSubpage, setSelectedSettingsSubPage] = useState<string>("account");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [_, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const renderTabContent = () => {
    switch (selectedSettingsSubpage) {
      case "account":
        return (
          <AccountTab
            firstName={props.firstName}
            lastName={props.lastName}
            emailAddress={props.emailAddress}
            accessToken={props.accessToken}
            {...(props.onUserUpdate && { onUserUpdate: props.onUserUpdate })}
          />
        );
      case "import":
        return <ImportTab handleUpload={handleUpload} />; // co-locate state
      case "integrations":
        return <IntegrationsTab />;
      case "calendar":
        return <CalendarTab />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="sm:max-w-[1280px] p-0 gap-0">
        <DialogHeader className="space-y-2 border-b-[1px] border-gray-200 p-8">
          <DialogTitle className="text-3xl font-bold">Settings</DialogTitle>
          <DialogDescription>Modify your user, or system settings here.</DialogDescription>
        </DialogHeader>
        <nav className="h-[700px] flex flex-row">
          <div className="h-full w-60 flex flex-col justify-between border-r-[1px] border-gray-200">
            <div className="flex flex-col">
              <div
                onClick={() => setSelectedSettingsSubPage("account")}
                className={`${
                  selectedSettingsSubpage === "account"
                    ? "bg-gray-50 border-indigo-500 border-r-2"
                    : ""
                } p-4 hover:cursor-pointer `}
              >
                <div className="flex flex-row items-center space-x-3">
                  <UserIcon className="ml-2 w-6 h-6" />
                  <h2 className="text-sm">Account</h2>
                </div>
              </div>
              <div
                onClick={() => setSelectedSettingsSubPage("import")}
                className={`${
                  selectedSettingsSubpage === "import"
                    ? "bg-gray-50 border-indigo-500 border-r-2"
                    : ""
                } p-4 hover:cursor-pointer `}
              >
                <div className="flex flex-row items-center space-x-3">
                  <ArrowUpTrayIcon className="ml-2 w-6 h-6" />
                  <h2 className="text-sm">Import</h2>
                </div>
              </div>
              <div
                onClick={() => setSelectedSettingsSubPage("integrations")}
                className={`${
                  selectedSettingsSubpage === "integrations"
                    ? "bg-gray-50 border-indigo-500 border-r-2"
                    : ""
                } p-4 hover:cursor-pointer `}
              >
                <div className="flex flex-row items-center space-x-3">
                  <LinkIcon className="ml-2 w-6 h-6" />
                  <h2 className="text-sm">Integrations</h2>
                </div>
              </div>
              <div
                onClick={() => setSelectedSettingsSubPage("calendar")}
                className={`${
                  selectedSettingsSubpage === "calendar"
                    ? "bg-gray-50 border-indigo-500 border-r-2"
                    : ""
                } p-4 hover:cursor-pointer `}
              >
                <div className="flex flex-row items-center space-x-3">
                  <CalendarIcon className="ml-2 w-6 h-6" />
                  <h2 className="text-sm">Calendar</h2>
                </div>
              </div>
            </div>
          </div>
          {renderTabContent()}
        </nav>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPopup;
