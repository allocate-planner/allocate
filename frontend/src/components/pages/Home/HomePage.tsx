import { useEffect } from "react";

import Header from "../../common/Home/Header";
import PrimaryContent from "../../common/Home/PrimaryContent";
import Features from "../../common/Home/Features";

const HomePage = () => {
  useEffect(() => {
    document.title = "allocate — Home";
  });

  return (
    <div className="w-full h-full">
      <Header />
      <div className="space-y-72">
        <PrimaryContent />
        <Features />
      </div>
    </div>
  );
};

export default HomePage;
