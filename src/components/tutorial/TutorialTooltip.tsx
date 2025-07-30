import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';
import { TutorialStep } from './TutorialProvider';

interface TutorialTooltipProps {
  step: TutorialStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onClose: () => void;
  isActive: boolean;
}

export function TutorialTooltip({
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  onClose,
  isActive
}: TutorialTooltipProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isActive) return;

    const targetElement = document.querySelector(step.target);
    if (!targetElement) return;

    const updatePosition = () => {
      const targetRect = targetElement.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = 200;
      const padding = 16;
      const arrowSize = 8;

      let x = 0;
      let y = 0;
      let arrowX = 0;
      let arrowY = 0;

      switch (step.placement) {
        case 'top':
          x = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
          y = targetRect.top - tooltipHeight - padding - arrowSize;
          arrowX = tooltipWidth / 2 - arrowSize;
          arrowY = tooltipHeight;
          break;
        case 'bottom':
          x = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
          y = targetRect.bottom + padding + arrowSize;
          arrowX = tooltipWidth / 2 - arrowSize;
          arrowY = -arrowSize;
          break;
        case 'left':
          x = targetRect.left - tooltipWidth - padding - arrowSize;
          y = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
          arrowX = tooltipWidth;
          arrowY = tooltipHeight / 2 - arrowSize;
          break;
        case 'right':
          x = targetRect.right + padding + arrowSize;
          y = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
          arrowX = -arrowSize;
          arrowY = tooltipHeight / 2 - arrowSize;
          break;
      }

      // Keep tooltip within viewport
      x = Math.max(padding, Math.min(x, window.innerWidth - tooltipWidth - padding));
      y = Math.max(padding, Math.min(y, window.innerHeight - tooltipHeight - padding));

      setPosition({ x, y });
      setArrowPosition({ x: arrowX, y: arrowY });
    };

    updatePosition();
    
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [step.target, step.placement, isActive]);

  if (!isActive) return null;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return createPortal(
    <div
      className="fixed z-50"
      style={{
        left: position.x,
        top: position.y,
        width: 320
      }}
    >
      <Card className="border-primary/20 shadow-glow bg-card/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">{step.title}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {!isFirstStep && step.showPrev !== false && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrev}
                  className="text-xs"
                >
                  <ChevronLeft className="h-3 w-3 mr-1" />
                  Back
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              {step.showSkip !== false && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <SkipForward className="h-3 w-3 mr-1" />
                  Skip Tour
                </Button>
              )}
              
              <Button
                size="sm"
                onClick={() => {
                  step.action?.();
                  onNext();
                }}
                className="text-xs"
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ChevronRight className="h-3 w-3 ml-1" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Arrow */}
      <div
        className="absolute w-0 h-0 border-8 border-transparent"
        style={{
          left: arrowPosition.x,
          top: arrowPosition.y,
          borderTopColor: step.placement === 'bottom' ? 'hsl(var(--card))' : 'transparent',
          borderBottomColor: step.placement === 'top' ? 'hsl(var(--card))' : 'transparent',
          borderLeftColor: step.placement === 'right' ? 'hsl(var(--card))' : 'transparent',
          borderRightColor: step.placement === 'left' ? 'hsl(var(--card))' : 'transparent',
        }}
      />
    </div>,
    document.body
  );
}
