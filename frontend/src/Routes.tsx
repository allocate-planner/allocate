import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "@/components/pages/Home/HomePage";
import LoginPage from "@/components/pages/Login/LoginPage";
import RegisterPage from "@/components/pages/Register/RegisterPage";
import CalendarPage from "@/components/pages/Calendar/CalendarPage";
import ErrorPage from "./components/pages/Error/ErrorPage";

// TODO: Reorganise routes

const Routes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      element: <HomePage />,
    },
    {
      path: "/login",
      errorElement: <ErrorPage />,
      element: <LoginPage />,
    },
    {
      path: "/register",
      errorElement: <ErrorPage />,
      element: <RegisterPage />,
    },
    {
      path: "/calendar",
      errorElement: <ErrorPage />,
      element: <CalendarPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
