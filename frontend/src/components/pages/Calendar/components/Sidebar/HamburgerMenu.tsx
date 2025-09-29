import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
} from "@/components/common/Sheet";

import { type MenuItem } from "@/components/pages/Calendar/components/sidebar/Sidebar";
import UserInfo from "@/components/pages/Calendar/components/sidebar/UserInfo";

interface IProps {
  sidebarOpen: boolean;
  menuItems: MenuItem[];
  firstName: string;
  lastName: string;
  emailAddress: string;
  onLogout: () => void;
  footerContent?: React.ReactNode;
}

const HamburgerMenu = ({
  sidebarOpen,
  menuItems,
  firstName,
  lastName,
  emailAddress,
  onLogout,
  footerContent,
}: IProps) => {
  const [open, setOpen] = useState<boolean>(sidebarOpen);
  const navigate = useNavigate();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side={"left"} className="flex flex-col justify-between">
        <SheetHeader>
          <div className="border-b-[1px] border-gray-200 flex flex-col justify-between items-center p-12">
            <img src="/logo.svg" alt="Allocate Logo" onClick={() => navigate("/")} />
          </div>
          <SheetDescription>
            <div className="mt-4 text-black space-y-1">
              {menuItems.map((item: MenuItem, index: number) => (
                <div
                  key={index}
                  onClick={item.onClick}
                  className={`
            flex flex-row items-center space-x-2 w-full py-2
            ${item.hasBackground ? "border border-[#DBDBDB] rounded-xl bg-[#F8F8F8]" : ""}
            ${item.onClick ? "hover:cursor-pointer" : ""}
          `}
                >
                  {item.icon ? <item.icon className="ml-2 w-6 h-6" /> : null}
                  {item.customContent ? item.customContent : <h2>{item.title}</h2>}
                </div>
              ))}
            </div>
          </SheetDescription>
        </SheetHeader>
        {footerContent ? <SheetFooter className="mt-auto">{footerContent}</SheetFooter> : null}
        <UserInfo
          firstName={firstName}
          lastName={lastName}
          emailAddress={emailAddress}
          onLogout={onLogout}
          className="text-black"
        />
      </SheetContent>
    </Sheet>
  );
};

export default HamburgerMenu;
