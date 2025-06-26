import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "@/components/pages/Home/HomePage";
import LoginPage from "@/components/pages/Login/LoginPage";
import RegisterPage from "@/components/pages/Register/RegisterPage";
import CalendarPage from "@/components/pages/Calendar/CalendarPage";

const Routes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/calendar",
      element: <CalendarPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
