import { useMemo } from 'react';

export const useSuggestions = () => {
  const suggestions = useMemo(() => [
    'Help me focus for 25 minutes',
    'I feel stressed — quick reset?',
    'Better sleep habits?',
    'Plan my day calmly',
  ], []);

  return { suggestions };
};
