import React, { createContext, useContext, useReducer } from 'react';

const UnifiedContext = createContext();

const initialState = {
  currentDate: new Date(),
  items: [
    {
      id: '1',
      title: 'TechTalks with Hasan Nahle',
      description: 'We are proud to host Major Nahle\'s Trustees meeting discussing the latest in technology trends, innovation strategies, and digital transformation. Join us for an insightful session that will reshape how we think about technology in business.',
      color: '#3a86ff',
      author: 'Hasan Nahle',
      location: 'Online Event',
      time: '6:00 AM - 2:00 PM',
      // Calendar specific fields
      start: '2024-07-10T06:00:00',
      end: '2024-07-10T14:00:00',
      category: 'conference',
      type: 'card' // This identifies it as a card that also appears on calendar
    },
    {
      id: '2',
      title: 'Daily Standup',
      description: 'Team sync meeting to discuss project progress and blockers.',
      start: '2024-07-11T09:00:00',
      end: '2024-07-11T09:30:00',
      category: 'meeting',
      location: 'Conference Room',
      color: '#ff006e',
      type: 'event' // This is calendar-only event
    }
  ],
  selectedItem: null,
  isModalOpen: false
};

function unifiedReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
    case 'ADD_ITEM':
      return { 
        ...state, 
        items: [...state.items, { ...action.payload, id: Date.now().toString() }]
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'SET_SELECTED_ITEM':
      return { ...state, selectedItem: action.payload };
    case 'TOGGLE_MODAL':
      return { ...state, isModalOpen: action.payload };
    default:
      return state;
  }
}

export function UnifiedProvider({ children }) {
  const [state, dispatch] = useReducer(unifiedReducer, initialState);

  return (
    <UnifiedContext.Provider value={{ state, dispatch }}>
      {children}
    </UnifiedContext.Provider>
  );
}

export function useUnifiedContext() {
  const context = useContext(UnifiedContext);
  if (!context) {
    throw new Error('useUnifiedContext must be used within a UnifiedProvider');
  }
  return context;
}