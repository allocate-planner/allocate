import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/common/Label";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { Spinner } from "@/components/common/Spinner";

import { userService } from "@/services/UserService";
import { useAuth } from "@/AuthProvider";
import { type IUserLogin, UserRegisterSchema, type IUserRegister } from "@/models/IUser";

import { toast } from "sonner";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserRegister>({
    resolver: zodResolver(UserRegisterSchema),
  });

  useEffect(() => {
    document.title = "allocate — Register";

    if (isAuthenticated) {
      navigate("/calendar");
    }
  }, [navigate, isAuthenticated]);

  const registerUser = async (userDetails: IUserRegister) => {
    try {
      await userService.registerUser(userDetails);
      toast.success("You have successfully created an account.");

      const userDetailsLogin: IUserLogin = {
        emailAddress: userDetails.emailAddress,
        password: userDetails.password,
      };

      const response = await userService.authenticateUser(userDetailsLogin);

      login(response);
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
            <h1 className="font-black text-2xl">Create an account</h1>
            <h2 className="text-gray-600 text-sm font-normal">
              Enter your details below to create your account.
            </h2>
          </div>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit(registerUser)}>
            <div>
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                placeholder="John"
                {...register("firstName")}
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                placeholder="Doe"
                {...register("lastName")}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>
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
            <div>
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                id="confirm_password"
                placeholder="•••••••••"
                type="password"
                {...register("confirmPassword")}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button className="bg-indigo-500 hover:bg-indigo-700" type="submit">
              {isSubmitting && <Spinner />}
              Register
            </Button>
            <h2 className="text-gray-600 text-sm font-normal self-center">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-indigo-500 hover:text-indigo-700 hover:underline font-black cursor-pointer"
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
