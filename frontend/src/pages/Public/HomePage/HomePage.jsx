import React, { useEffect } from "react";
import { useScrollSnap } from "../../../hooks/useScrollSnap";
import { HeroSection } from "../../../components/features/HomePage/HeroSection";
import { BestSellerSection } from "../../../components/features/HomePage/BestSellerSection";
import { CallToActionSection } from "../../../components/features/HomePage/CallToActionSection";
import { AboutSection } from "../../../components/features/HomePage/AboutSection";
import { ContactSection } from "../../../components/features/HomePage/ContactSection";

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
