import React, { createContext, useContext, useReducer } from 'react';

const CardsContext = createContext();

const initialState = {
  cards: [
    {
      id: '1',
      title: 'TechTalks with Hasan Nahle',
      description: 'We are proud to host Major Nahle\'s Trustees meeting discussing the latest in technology trends, innovation strategies, and digital transformation. Join us for an insightful session that will reshape how we think about technology in business.',
      color: '#3a86ff',
      author: 'Hasan Nahle',
      location: 'Online Event',
      time: '6:00 AM - 2:00 PM'
    }
  ],
  selectedCard: null,
  isModalOpen: false
};

function cardsReducer(state, action) {
  switch (action.type) {
    case 'ADD_CARD':
      return {
        ...state,
        cards: [...state.cards, { ...action.payload, id: Date.now().toString() }]
      };
    case 'UPDATE_CARD':
      return {
        ...state,
        cards: state.cards.map(card =>
          card.id === action.payload.id ? action.payload : card
        )
      };
    case 'DELETE_CARD':
      return {
        ...state,
        cards: state.cards.filter(card => card.id !== action.payload)
      };
    case 'SET_SELECTED_CARD':
      return { ...state, selectedCard: action.payload };
    case 'TOGGLE_MODAL':
      return { ...state, isModalOpen: action.payload };
    default:
      return state;
  }
}

export function CardsProvider({ children }) {
  const [state, dispatch] = useReducer(cardsReducer, initialState);

  return (
    <CardsContext.Provider value={{ state, dispatch }}>
      {children}
    </CardsContext.Provider>
  );
}

export function useCardsContext() {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error('useCardsContext must be used within a CardsProvider');
  }
  return context;
}
