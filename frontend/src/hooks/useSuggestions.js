import { useMemo } from 'react';

export const useSuggestions = () => {
  const suggestions = useMemo(() => [
    "What is NeuraLift?",
    "Wellness tips",
    "Mental health support",
    "Stress management",
    "Sleep better",
    "Exercise advice"
  ], []);

  return { suggestions };
};