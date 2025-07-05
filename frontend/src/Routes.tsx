import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "@/components/pages/Home/HomePage";
import LoginPage from "@/components/pages/Login/LoginPage";
import RegisterPage from "@/components/pages/Register/RegisterPage";
import CalendarPage from "@/components/pages/Calendar/CalendarPage";
import ErrorPage from "./components/pages/Error/ErrorPage";

const Routes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      element: <HomePage />,
      children: [
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
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
