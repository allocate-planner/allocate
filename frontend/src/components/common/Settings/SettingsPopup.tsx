import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../Dialog";

import { Button } from "../Button";

import { Input } from "../Input";
import { Label } from "../Label";

import { UserIcon, CogIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface IProps {
  isOpen: boolean;
  firstName: string;
  lastName: string;
  emailAddress: string;
  onClose: () => void;
}

const SettingsPopup = (props: IProps) => {
  const [selectedSettingsSubpage, setSelectedSettingsSubPage] =
    useState<string>("account");

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="sm:max-w-[900px] p-0 gap-0">
        <DialogHeader className="space-y-4 border-b-[1px] border-gray-300 p-8">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Modify your user, or system settings here.
          </DialogDescription>
        </DialogHeader>
        <nav className="h-[400px] flex flex-row">
          <div className="h-full w-1/3 flex flex-col justify-between border-r-[1px] border-gray-300">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div
                  onClick={() => setSelectedSettingsSubPage("account")}
                  className={`${
                    selectedSettingsSubpage === "account"
                      ? "bg-gray-50 border-violet-500 border-r-2"
                      : ""
                  } p-4 hover:cursor-pointer `}
                >
                  <div className="flex flex-row items-center space-x-2 ">
                    <UserIcon className="ml-2 w-6 h-6" />
                    <h2>Account</h2>
                  </div>
                </div>
                <div
                  onClick={() => setSelectedSettingsSubPage("system")}
                  className={`${
                    selectedSettingsSubpage === "system"
                      ? "bg-gray-50 border-violet-500 border-r-2"
                      : ""
                  } p-4 hover:cursor-pointer `}
                >
                  <div className="flex flex-row items-center space-x-2 ">
                    <CogIcon className="ml-2 w-6 h-6" />
                    <h2>System</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {selectedSettingsSubpage === "account" ? (
            <section className="w-2/3 flex flex-col space-y-8 justify-center items-center">
              <div className="w-4/5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    defaultValue={props.firstName}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    defaultValue={props.lastName}
                    placeholder="Doe"
                  />
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
              <div className="flex flex-row space-x-4">
                <Button
                  className="bg-red-500 hover:bg-red-700 font-bold"
                  type="submit"
                >
                  Delete Account
                </Button>
                <Button
                  className="bg-gray-50 hover:bg-gray-100 text-red-500"
                  type="submit"
                >
                  Disable Account
                </Button>
                <Button
                  className="bg-violet-500 hover:bg-violet-700"
                  type="submit"
                >
                  Save Changes
                </Button>
              </div>
            </section>
          ) : (
            ""
          )}
        </nav>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPopup;
