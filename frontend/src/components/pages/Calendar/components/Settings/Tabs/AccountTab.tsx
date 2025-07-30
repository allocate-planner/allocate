import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { Label } from "@/components/common/Label";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import {
  ProfileEditSchema,
  PasswordEditSchema,
  type IProfileEdit,
  type IPasswordEdit,
  type IStoredUser,
} from "@/models/IUser";
import { userService } from "@/services/UserService";
import { useAuth } from "@/AuthProvider";

interface IProps {
  firstName: string;
  lastName: string;
  emailAddress: string;
  accessToken: string;
  onUserUpdate?: (updatedUser: IStoredUser) => void;
}

const AccountTab = ({ firstName, lastName, emailAddress, accessToken, onUserUpdate }: IProps) => {
  const { id, refreshToken } = useAuth();

  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<IProfileEdit>({
    resolver: zodResolver(ProfileEditSchema),
    defaultValues: {
      firstName,
      lastName,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<IPasswordEdit>({
    resolver: zodResolver(PasswordEditSchema),
  });

  if (!refreshToken) {
    toast.error("Authentication required");
    return false;
  }

  const onProfileSubmit = async (data: IProfileEdit) => {
    setIsUpdatingProfile(true);

    try {
      const updatedUser = await userService.editUser(
        {
          firstName: data.firstName,
          lastName: data.lastName,
        },
        accessToken
      );

      const storedUser = {
        ...updatedUser,
        id,
        accessToken,
        refreshToken,
      };

      toast.success("Profile updated successfully");
      onUserUpdate?.(storedUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: IPasswordEdit) => {
    setIsUpdatingPassword(true);

    try {
      await userService.editUser({ password: data.password }, accessToken);
      toast.success("Password updated successfully");
      resetPassword();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update password";
      toast.error(message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

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
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
          <div className="flex flex-row space-x-4 w-full">
            <div className="space-y-2 w-1/2">
              <Label htmlFor="firstname">First Name</Label>
              <Input id="firstname" placeholder="John" {...registerProfile("firstName")} />
              {profileErrors.firstName && (
                <p className="text-red-500 text-xs mt-1">{profileErrors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2 w-1/2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input id="lastname" placeholder="Doe" {...registerProfile("lastName")} />
              {profileErrors.lastName && (
                <p className="text-red-500 text-xs mt-1">{profileErrors.lastName.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={emailAddress}
              placeholder="name@example.com"
              disabled
              className="bg-gray-50 text-gray-500"
            />
            <p className="text-gray-400 text-xs">Email cannot be changed</p>
          </div>
          <Button
            type="submit"
            disabled={isUpdatingProfile}
            className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {isUpdatingProfile ? "Updating..." : "Save Changes"}
          </Button>
        </form>
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
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
          <div className="flex flex-row space-x-4 w-full">
            <div className="space-y-2 w-1/2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                {...registerPassword("password")}
              />
              {passwordErrors.password && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.password.message}</p>
              )}
            </div>
            <div className="space-y-2 w-1/2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                {...registerPassword("confirmPassword")}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={isUpdatingPassword}
            className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {isUpdatingPassword ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default AccountTab;
