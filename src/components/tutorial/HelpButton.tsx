import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useTutorial } from './TutorialProvider';
import { PageTutorial } from './TutorialProvider';

interface HelpButtonProps {
  tutorial: PageTutorial;
  className?: string;
}

export function HelpButton({ tutorial, className }: HelpButtonProps) {
  const { startTutorial, isStepCompleted } = useTutorial();

  const allStepsCompleted = tutorial.steps.every(step => 
    isStepCompleted(tutorial.id, step.id)
  );

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => startTutorial(tutorial)}
      className={`gap-2 ${className}`}
    >
      <HelpCircle className="h-4 w-4" />
      {allStepsCompleted ? 'Show Tutorial Again' : 'Show Tutorial'}
    </Button>
  );
}