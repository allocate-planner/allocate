import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Label } from "../../common/Label";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { Spinner } from "../../common/Spinner";

import { userService } from "@/services/UserService";
import { useAuth } from "@/AuthProvider";
import { IUserDetails } from "@/models/IUser";

import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, updateAuthentication } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    document.title = "allocate — Login";

    if (isAuthenticated) {
      navigate("/calendar");
    }
  }, [navigate, isAuthenticated]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userDetails: IUserDetails = {
      username: email,
      password: password,
    };

    await authenticateUser(userDetails);
  };

  const authenticateUser = async (userDetails: IUserDetails) => {
    setIsLoading(true);

    try {
      await userService.authenticateUser(userDetails);
      updateAuthentication(true);
      toast.success("You have successfully been authenticated!");
      navigate("/calendar");
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
            <h1 className="font-black text-2xl">Welcome Back!</h1>
            <h2 className="text-gray-600 text-sm font-normal">
              Enter your details below to access your account.
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
            <Button className="bg-violet-500 hover:bg-violet-700">
              {isLoading && <Spinner />}
              Sign In
            </Button>
            <h2 className="text-gray-600 text-sm font-normal self-center">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-violet-500 hover:text-violet-700 hover:underline font-black cursor-pointer"
              >
                Sign Up
              </a>
            </h2>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
