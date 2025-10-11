import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { Label } from "@/components/common/Label";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { Spinner } from "@/components/common/Spinner";

import { userService } from "@/services/UserService";

import { useAuth } from "@/AuthProvider";

import { UserLoginSchema, type IUserLogin } from "@/models/IUser";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserLogin>({
    resolver: zodResolver(UserLoginSchema),
  });

  useEffect(() => {
    document.title = "allocate — Login";

    if (isAuthenticated) {
      navigate("/calendar");
    }
  }, [navigate, isAuthenticated]);

  const authenticateUser = async (userDetails: IUserLogin) => {
    try {
      const response = await userService.authenticateUser(userDetails);
      login(response);
      toast.success("You have successfully been authenticated!");
      navigate("/calendar");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative flex flex-row h-screen w-screen">
      <div className="absolute inset-x-0 top-0 z-50">
        <div className="flex flex-1">
          <a href="/" className="flex items-center justify-between lg:px-8 p-6 shrink-0">
            <span className="sr-only">allocate</span>
            <div className="-m-1.5 p-1.5">
              <img alt="Allocate Logo" src="/logo.svg" className="h-8 w-auto" />
            </div>
          </a>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <h1 className="font-black text-3xl md:text-4xl">Welcome Back!</h1>
            <h2 className="text-gray-600 text-base md:text-lg font-normal">
              Enter your details below to access your account.
            </h2>
          </div>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit(authenticateUser)}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                {...register("emailAddress")}
                disabled={isSubmitting}
              />
              {errors.emailAddress && (
                <p className="text-red-500 text-xs mt-1">{errors.emailAddress.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="•••••••••"
                type="password"
                {...register("password")}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
            <Button className="bg-indigo-500 hover:bg-indigo-700" type="submit">
              {isSubmitting && <Spinner />}
              Sign In
            </Button>
            <h2 className="text-gray-600 text-sm font-normal self-center">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-indigo-500 hover:text-indigo-700 hover:underline font-black cursor-pointer"
              >
                Sign Up
              </a>
            </h2>
          </form>
        </div>
      </div>
      <div className="relative hidden md:flex md:w-1/2 items-center justify-center bg-indigo-50 bg-opacity-10 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 z-0 transform-gpu overflow-hidden blur-3xl pointer-events-none"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-20rem)] sm:w-[60rem]"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-md px-6 text-center md:text-left">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight text-gray-900">
            Turn thoughts into perfect schedules.
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Log in to continue planning your day with voice-first scheduling that just works.
          </p>
        </div>
        <img
          src="/product/linear.svg"
          alt="Linear"
          className="absolute z-10 top-24 left-16 -rotate-6 h-24 sm:h-28 md:h-32 w-auto drop-shadow-2xl"
        />
        <img
          src="/product/notion.svg"
          alt="Notion"
          className="absolute z-10 bottom-24 right-16 rotate-6 h-24 sm:h-28 md:h-32 w-auto drop-shadow-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 z-0 transform-gpu overflow-hidden blur-3xl pointer-events-none"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+20rem)] sm:w-[60rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
