import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface TutorialOverlayProps {
  target: string;
  isActive: boolean;
  onBackdropClick?: () => void;
}

export function TutorialOverlay({ target, isActive, onBackdropClick }: TutorialOverlayProps) {
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!isActive) return;

    const element = document.querySelector(target);
    if (element) {
      setTargetElement(element);
      
      const updateDimensions = () => {
        const rect = element.getBoundingClientRect();
        setDimensions({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        });
      };

      updateDimensions();
      
      // Update on scroll and resize
      window.addEventListener('scroll', updateDimensions);
      window.addEventListener('resize', updateDimensions);
      
      return () => {
        window.removeEventListener('scroll', updateDimensions);
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, [target, isActive]);

  if (!isActive || !targetElement) return null;

  const overlayStyle = {
    clipPath: `polygon(0% 0%, 0% 100%, ${dimensions.x}px 100%, ${dimensions.x}px ${dimensions.y}px, ${dimensions.x + dimensions.width}px ${dimensions.y}px, ${dimensions.x + dimensions.width}px ${dimensions.y + dimensions.height}px, ${dimensions.x}px ${dimensions.y + dimensions.height}px, ${dimensions.x}px 100%, 100% 100%, 100% 0%)`
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      style={overlayStyle}
      onClick={onBackdropClick}
    />,
    document.body
  );
}