import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Label } from "../../common/Label";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { Spinner } from "../../common/Spinner";

import { userService } from "@/services/UserService";
import { useAuth } from "@/AuthProvider";
import { IUserRegister } from "@/models/IUser";

import { toast } from "sonner";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    document.title = "allocate — Register";

    if (isAuthenticated) {
      navigate("/calendar");
    }
  }, [navigate, isAuthenticated]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("The passwords provided do not match.");
      return;
    }

    const userDetails: IUserRegister = {
      username: email,
      password: password,
      confirm_password: confirmPassword,
    };

    await registerUser(userDetails);
  };

  const registerUser = async (userDetails: IUserRegister) => {
    setIsLoading(true);

    try {
      await userService.registerUser(userDetails);
      toast.success("You have successfully created an account.");
      navigate("/login");
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row h-screen w-screen">
      <div className="md:w-1/2 bg-random-shapes flex flex-col justify-between"></div>
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <h1 className="font-black text-2xl">Create an account</h1>
            <h2 className="text-gray-600 text-sm font-normal">
              Enter your details below to create your account.
            </h2>
          </div>
          <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="•••••••••"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                id="confirm_password"
                placeholder="•••••••••"
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button className="bg-violet-500 hover:bg-violet-700">
              {isLoading && <Spinner />}
              Register
            </Button>
            <h2 className="text-gray-600 text-sm font-normal self-center">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-violet-500 hover:text-violet-700 hover:underline font-black cursor-pointer"
              >
                Login
              </a>
            </h2>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
