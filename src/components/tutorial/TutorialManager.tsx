import { useEffect } from 'react';
import { useTutorial } from './TutorialProvider';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialTooltip } from './TutorialTooltip';

export function TutorialManager() {
  const {
    activeTutorial,
    currentStep,
    isActive,
    nextStep,
    prevStep,
    skipTutorial,
    endTutorial
  } = useTutorial();

  // Scroll to target element when step changes
  useEffect(() => {
    if (isActive && activeTutorial) {
      const currentStepData = activeTutorial.steps[currentStep];
      if (currentStepData) {
        const targetElement = document.querySelector(currentStepData.target);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }
    }
  }, [isActive, currentStep, activeTutorial]);

  if (!isActive || !activeTutorial) return null;

  const currentStepData = activeTutorial.steps[currentStep];
  if (!currentStepData) return null;

  return (
    <>
      <TutorialOverlay
        target={currentStepData.target}
        isActive={isActive}
        onBackdropClick={endTutorial}
      />
      
      <TutorialTooltip
        step={currentStepData}
        currentStep={currentStep}
        totalSteps={activeTutorial.steps.length}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={skipTutorial}
        onClose={endTutorial}
        isActive={isActive}
      />
    </>
  );
}