import { useMemo } from 'react';

export const useSuggestions = () => {
  const suggestions = useMemo(() => [
    "What is NeuraLift?",
    "Wellness tips",
    "Help me with stress",
    "Mental health support"
  ], []);

  return { suggestions };
};