import React, { useEffect } from "react";
import { useScrollSnap } from "../../../hooks/useScrollSnap";
import { HeroSection } from "./components/HeroSection/HeroSection";
import { BestSellerSection } from "./components/BestSellerSection/BestSellerSection";
import { CallToActionSection } from "./components/CallToActionSection/CallToActionSection";
import { AboutSection } from "./components/AboutSection/AboutSection";
import { ContactSection } from "./components/ContactSection/ContactSection";

export default function Home({ setCurrentPage }) {
  const { performSnapScroll } = useScrollSnap();

  useEffect(() => {
    // Exact scroll-reveal animation observer ported from main.js
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      animationObserver.observe(el);
    });

    return () => animationObserver.disconnect();
  }, []);

  return (
    <main className="home-page-content" id="home">
      <HeroSection setCurrentPage={setCurrentPage} />
      <BestSellerSection setCurrentPage={setCurrentPage} />
      <CallToActionSection setCurrentPage={setCurrentPage} />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
