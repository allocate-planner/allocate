import { useEffect } from "react";

import Header from "../../common/Home/Header";
import PrimaryContent from "../../common/Home/PrimaryContent";
import Features from "../../common/Home/Features";
import Pricing from "../../common/Home/Pricing";
import Footer from "../../common/Home/Footer";

const HomePage = () => {
  useEffect(() => {
    document.title = "allocate — Home";
  });

  return (
    <div className="w-full h-full space-y-8 2xl:space-y-0">
      <Header />
      <div className="2xl:space-y-32">
        <section id="primary">
          <PrimaryContent />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <section id="footer">
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default HomePage;
