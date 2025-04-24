
import { useEffect } from 'react';

export const useScrollAnimation = () => {
  useEffect(() => {
    const handleScroll = () => {
      const animatedElements = document.querySelectorAll('.animate-fade-in');
      
      animatedElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect();
        const isVisible = elementPosition.top < window.innerHeight - 100 &&
                        elementPosition.bottom >= 0;
        
        if (isVisible) {
          element.classList.add('visible');
        }
      });
    };
    
    // Add initial class to elements
    const animatedElements = document.querySelectorAll('.animate-fade-in');
    animatedElements.forEach(element => {
      element.classList.add('fade-ready');
    });
    
    // Run once on load
    setTimeout(handleScroll, 200);
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};
