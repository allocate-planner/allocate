import React from "react";

import Routes from "./Routes";

import { AuthProvider } from "./AuthProvider";
import { Toaster } from "sonner";

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
