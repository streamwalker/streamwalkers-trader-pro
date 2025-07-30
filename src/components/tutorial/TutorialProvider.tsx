import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface TutorialStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  showSkip?: boolean;
  showPrev?: boolean;
  showNext?: boolean;
  action?: () => void;
}

export interface PageTutorial {
  id: string;
  name: string;
  steps: TutorialStep[];
  trigger: 'onLoad' | 'onDemand' | 'onFirstVisit';
}

interface TutorialContextType {
  activeTutorial: PageTutorial | null;
  currentStep: number;
  isActive: boolean;
  startTutorial: (tutorial: PageTutorial) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  endTutorial: () => void;
  isStepCompleted: (tutorialId: string, stepId: string) => boolean;
  markStepCompleted: (tutorialId: string, stepId: string) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

interface TutorialProviderProps {
  children: ReactNode;
}

export function TutorialProvider({ children }: TutorialProviderProps) {
  const [activeTutorial, setActiveTutorial] = useState<PageTutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Load completed steps from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tutorial-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedSteps(new Set(parsed));
      } catch (error) {
        console.error('Failed to parse tutorial progress:', error);
      }
    }
  }, []);

  // Save completed steps to localStorage
  const saveProgress = (steps: Set<string>) => {
    localStorage.setItem('tutorial-progress', JSON.stringify(Array.from(steps)));
  };

  const startTutorial = (tutorial: PageTutorial) => {
    setActiveTutorial(tutorial);
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => {
    if (activeTutorial && currentStep < activeTutorial.steps.length - 1) {
      // Mark current step as completed
      const stepKey = `${activeTutorial.id}-${activeTutorial.steps[currentStep].id}`;
      const newCompleted = new Set(completedSteps);
      newCompleted.add(stepKey);
      setCompletedSteps(newCompleted);
      saveProgress(newCompleted);

      setCurrentStep(prev => prev + 1);
    } else {
      endTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipTutorial = () => {
    if (activeTutorial) {
      // Mark all steps as completed when skipping
      const newCompleted = new Set(completedSteps);
      activeTutorial.steps.forEach(step => {
        newCompleted.add(`${activeTutorial.id}-${step.id}`);
      });
      setCompletedSteps(newCompleted);
      saveProgress(newCompleted);
    }
    endTutorial();
  };

  const endTutorial = () => {
    setActiveTutorial(null);
    setCurrentStep(0);
    setIsActive(false);
  };

  const isStepCompleted = (tutorialId: string, stepId: string) => {
    return completedSteps.has(`${tutorialId}-${stepId}`);
  };

  const markStepCompleted = (tutorialId: string, stepId: string) => {
    const stepKey = `${tutorialId}-${stepId}`;
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepKey);
    setCompletedSteps(newCompleted);
    saveProgress(newCompleted);
  };

  return (
    <TutorialContext.Provider value={{
      activeTutorial,
      currentStep,
      isActive,
      startTutorial,
      nextStep,
      prevStep,
      skipTutorial,
      endTutorial,
      isStepCompleted,
      markStepCompleted
    }}>
      {children}
    </TutorialContext.Provider>
  );
}