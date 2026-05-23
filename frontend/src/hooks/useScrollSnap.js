// src/hooks/useScrollSnap.js
import { smoothScrollTo } from '../utils/scrollUtils';

export const useScrollSnap = () => {
  
  const disableSnap = () => {
    document.body.classList.remove('has-snap-scroll');
    document.body.classList.add('snap-disabled');
  };

  const enableSnap = () => {
    document.body.classList.add('has-snap-scroll');
    document.body.classList.remove('snap-disabled');
  };

  const performSnapScroll = (targetY, duration = 1000) => {
    disableSnap();
    
    smoothScrollTo(targetY, duration);

    const restore = () => {
      enableSnap();
      window.removeEventListener('scrollend', restore);
    };

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', restore, { once: true });
    } else {
      setTimeout(restore, duration + 100); // Fallback
    }
  };

  return { performSnapScroll, enableSnap, disableSnap };
};