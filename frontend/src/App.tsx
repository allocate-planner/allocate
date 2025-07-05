import React from "react";
import { Toaster } from "sonner";

import Routes from "@/Routes";
import { AuthProvider } from "@/AuthProvider";

const App = () => {
  return (
    <React.Fragment>
      <Toaster richColors />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </React.Fragment>
  );
};

export default App;
