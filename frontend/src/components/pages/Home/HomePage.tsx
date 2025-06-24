import { useEffect } from "react";

import Header from "@/components/common/Home/Header";
import Hero from "@/components/common/Home/Hero";
import Features from "@/components/common/Home/Features";
import CTA from "@/components/common/Home/CTA";
import Footer from "@/components/common/Home/Footer";

const HomePage = () => {
  useEffect(() => {
    document.title = "allocate — Home";
  });

  return (
    <div className="w-full h-full space-y-8 2xl:space-y-0">
      <Header />
      <div className="2xl:space-y-32">
        <section id="hero">
          <Hero />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="cta">
          <CTA />
        </section>
        <section id="footer">
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default HomePage;
