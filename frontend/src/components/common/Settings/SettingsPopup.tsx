import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../Dialog";

import { Button } from "../Button";

import { Input } from "../Input";
import { Label } from "../Label";

import { UserIcon, CalendarIcon, LinkIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface IProps {
  isOpen: boolean;
  firstName: string;
  lastName: string;
  emailAddress: string;
  onClose: () => void;
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

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="sm:max-w-[1000px] p-0 gap-0">
        <DialogHeader className="space-y-4 border-b-[1px] border-gray-200 p-8">
          <DialogTitle className="text-2xl">Settings</DialogTitle>
          <DialogDescription>Modify your user, or system settings here.</DialogDescription>
        </DialogHeader>
        <nav className="h-[600px] flex flex-row">
          <div className="h-full w-60 flex flex-col justify-between border-r-[1px] border-gray-200">
            <div className="flex flex-col">
              <div
                onClick={() => setSelectedSettingsSubPage("account")}
                className={`${
                  selectedSettingsSubpage === "account"
                    ? "bg-gray-50 border-violet-500 border-r-2"
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
                    ? "bg-gray-50 border-violet-500 border-r-2"
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
                    ? "bg-gray-50 border-violet-500 border-r-2"
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
                    ? "bg-gray-50 border-violet-500 border-r-2"
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
          {selectedSettingsSubpage === "account" ? (
            <section className="w-full flex flex-col p-8 space-y-12">
              <div className="space-y-8">
                <div className="flex flex-row space-x-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                    <UserIcon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="font-bold text-base">Profile Information</h1>
                    <p className="text-gray-500 text-sm">
                      Update your personal details and contact information
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-row space-x-4 w-full">
                    <div className="space-y-2 w-1/2">
                      <Label htmlFor="firstname">First Name</Label>
                      <Input id="firstname" defaultValue={props.firstName} placeholder="John" />
                    </div>
                    <div className="space-y-2 w-1/2">
                      <Label htmlFor="lastname">Last Name</Label>
                      <Input id="lastname" defaultValue={props.lastName} placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={props.emailAddress}
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div className="space-y-8">
                <div className="flex flex-row space-x-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                    <UserIcon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="font-bold text-base">Security</h1>
                    <p className="text-gray-500 text-sm">
                      Manage your password and account security
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-row space-x-4 w-full">
                    <div className="space-y-2 w-1/2">
                      <Label htmlFor="firstname">Current Password</Label>
                      <Input id="firstname" placeholder="••••••••••••" />
                    </div>
                    <div className="space-y-2 w-1/2">
                      <Label htmlFor="lastname">New Password</Label>
                      <Input id="lastname" placeholder="••••••••••••" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="w-full flex flex-col space-y-8 p-8">
              <div className="space-y-8">
                <div className="flex flex-row space-x-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                    <ArrowUpTrayIcon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="font-bold text-base">Calendar Import</h1>
                    <p className="text-gray-500 text-sm">
                      Import your existing calendar data from .ics files
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <ArrowUpTrayIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">.ics format supported</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </nav>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPopup;
