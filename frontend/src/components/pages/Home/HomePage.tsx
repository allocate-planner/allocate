import { useEffect } from "react";

import Header from "../../common/Home/Header";
import PrimaryContent from "../../common/Home/PrimaryContent";

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
