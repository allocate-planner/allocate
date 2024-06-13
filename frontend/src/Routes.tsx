import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "./components/pages/Login/LoginPage";
import RegisterPage from "./components/pages/Register/RegisterPage";

const Routes = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
