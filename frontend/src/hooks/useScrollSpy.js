import { useState, useEffect } from 'react';

export const useScrollSpy = (sectionIds, offset = 150) => {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    const handleScroll = () => {
      let current = sectionIds[0];
      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section top is near the top of the viewport
          if (rect.top <= offset) {
            current = sectionId;
          }
        }
      }

      // If we have scrolled to the absolute bottom of the page, always highlight the last section
      const isAtBottom = window.innerHeight + Math.round(window.scrollY) >= document.body.offsetHeight - 10;
      if (isAtBottom) {
        current = sectionIds[sectionIds.length - 1];
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
};