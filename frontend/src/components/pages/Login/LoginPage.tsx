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
    </div>
  );
};

export default LoginPage;
