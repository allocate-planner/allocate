import { useEffect } from "react";

import Header from "@/components/pages/Home/components/Header";
import Hero from "@/components/pages/Home/components/Hero";
import Features from "@/components/pages/Home/components/Features";
import CTA from "@/components/pages/Home/components/CTA";
import Footer from "@/components/pages/Home/components/Footer";

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
