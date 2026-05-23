import React, { useEffect } from 'react';
import { smoothScrollTo } from '../../../utils/scrollUtils';
import { useScrollSnap } from '../../../hooks/useScrollSnap';
import { HeroSection } from '../../../components/features/Home/HeroSection';
import { BestSellerSection } from '../../../components/features/Home/BestsellerSection';
import { CallToActionSection } from '../../../components/features/Home/CallToActionSection';
import { AboutSection } from '../../../components/features/Home/AboutSection';
import { ContactSection } from '../../../components/features/Home/ContactSection';


export default function Home({ setCurrentPage }) {
  const { performSnapScroll } = useScrollSnap();

  useEffect(() => {
    // Exact scroll-reveal animation observer ported from main.js
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      animationObserver.observe(el);
    });

    return () => animationObserver.disconnect();
  }, []);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const targetY = sectionId === 'home' ? 0 : document.getElementById(sectionId)?.getBoundingClientRect().top + window.scrollY;
    if (targetY !== undefined) performSnapScroll(targetY);
    };

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