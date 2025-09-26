import { useState } from 'react';

const motivationalQuotes = [
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.",
    author: "Winston Churchill"
  },
  {
    text: "Don't let yesterday take up too much of today.",
    author: "Will Rogers"
  },
  {
    text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
    author: "Unknown"
  },
  {
    text: "It's not whether you get knocked down, it's whether you get up.",
    author: "Vince Lombardi"
  },
  {
    text: "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
    author: "Steve Jobs"
  },
  {
    text: "People who are crazy enough to think they can change the world, are the ones who do.",
    author: "Rob Siltanen"
  },
  {
    text: "Failure will never overtake me if my determination to succeed is strong enough.",
    author: "Og Mandino"
  },
  {
    text: "Entrepreneurs are great at dealing with uncertainty and also very good at minimizing risk. That's the classic entrepreneur.",
    author: "Mohnish Pabrai"
  },
  {
    text: "We may encounter many defeats but we must not be defeated.",
    author: "Maya Angelou"
  }
];

export const useQuotes = () => {
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNewQuote = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      const newQuote = motivationalQuotes[randomIndex];
      
      // Ensure we don't get the same quote twice in a row
      if (newQuote.text === quote.text && motivationalQuotes.length > 1) {
        const filteredQuotes = motivationalQuotes.filter(q => q.text !== quote.text);
        const randomFilteredIndex = Math.floor(Math.random() * filteredQuotes.length);
        setQuote(filteredQuotes[randomFilteredIndex]);
      } else {
        setQuote(newQuote);
      }
      
      setIsLoading(false);
    }, 500); // Simulated network delay
    };

  return {
    quote,
    isLoading,
    fetchNewQuote
  };
};