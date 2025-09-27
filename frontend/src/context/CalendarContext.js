import React, { createContext, useContext, useReducer } from 'react';

const CalendarContext = createContext();

const initialState = {
  currentDate: new Date(),
  events: [
    {
      id: '1',
      title: 'TechTalks with Hasan Nahle',
      description: 'We are proud to host Major Nahle\'s Trustees meeting discussing the latest in technology trends and innovation.',
      start: '2024-07-10T06:00:00',
      end: '2024-07-10T14:00:00',
      category: 'conference',
      location: 'Online',
      color: '#3a86ff'
    },
    {
      id: '2',
      title: 'Daily Standup',
      description: 'Team sync meeting to discuss project progress and blockers.',
      start: '2024-07-11T09:00:00',
      end: '2024-07-11T09:30:00',
      category: 'meeting',
      location: 'Conference Room',
      color: '#ff006e'
    },
    {
      id: '3',
      title: 'Client Meeting',
      description: 'Weekly check-in with client to review deliverables.',
      start: '2024-07-12T10:00:00',
      end: '2024-07-12T11:00:00',
      category: 'meeting',
      location: 'Office',
      color: '#8b5cf6'
    },
    {
      id: '4',
      title: 'Code Review',
      description: 'Review pull requests and discuss architecture decisions.',
      start: '2024-07-13T14:00:00',
      end: '2024-07-13T15:00:00',
      category: 'work',
      location: 'Online',
      color: '#06d6a0'
    },
    {
      id: '5',
      title: 'Workshop: React Best Practices',
      description: 'Hands-on workshop covering React performance optimization.',
      start: '2024-07-14T10:00:00',
      end: '2024-07-14T12:00:00',
      category: 'workshop',
      location: 'Training Room A',
      color: '#f72585'
    }
  ],
  selectedEvent: null,
  isModalOpen: false
};

function calendarReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
    case 'ADD_EVENT':
      return { 
        ...state, 
        events: [...state.events, { ...action.payload, id: Date.now().toString() }]
      };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        )
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload)
      };
    case 'SET_SELECTED_EVENT':
      return { ...state, selectedEvent: action.payload };
    case 'TOGGLE_MODAL':
      return { ...state, isModalOpen: action.payload };
    default:
      return state;
  }
}

export function CalendarProvider({ children }) {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  return (
    <CalendarContext.Provider value={{ state, dispatch }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarProvider');
  }
  return context;
}