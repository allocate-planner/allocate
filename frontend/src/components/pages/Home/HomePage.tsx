import { useEffect } from "react";

import Header from "./Header";
import PrimaryContent from "./PrimaryContent";

const HomePage = () => {
  useEffect(() => {
    document.title = "allocate — Home";
  });

  return (
    <div className="w-full h-full">
      <Header />
      <PrimaryContent />
    </div>
  );
};

export default HomePage;
