import { UserIcon } from "@heroicons/react/24/outline";

import { Label } from "@/components/common/Label";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

interface AccountTabProps {
  firstName: string;
  lastName: string;
  emailAddress: string;
}

const AccountTab = ({ firstName, lastName, emailAddress }: AccountTabProps) => {
  return (
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
              <Input id="firstname" defaultValue={firstName} placeholder="John" />
            </div>
            <div className="space-y-2 w-1/2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input id="lastname" defaultValue={lastName} placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={emailAddress}
              placeholder="name@example.com"
            />
          </div>
        </div>
        <Button className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Save Changes
        </Button>
      </div>
      <hr />
      <div className="space-y-8">
        <div className="flex flex-row space-x-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-600">
            <UserIcon aria-hidden="true" className="size-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-base">Security</h1>
            <p className="text-gray-500 text-sm">Manage your password and account security</p>
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
        <Button className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Update Password
        </Button>
      </div>
    </section>
  );
};

export default AccountTab;
