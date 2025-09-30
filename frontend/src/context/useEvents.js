import { useCalendarContext } from '../contexts/CalendarContext';

export function useEvents() {
  const { state, dispatch } = useCalendarContext();

  const addEvent = (event) => {
    dispatch({ type: 'ADD_EVENT', payload: event });
  };

  const updateEvent = (event) => {
    dispatch({ type: 'UPDATE_EVENT', payload: event });
  };

  const deleteEvent = (eventId) => {
    dispatch({ type: 'DELETE_EVENT', payload: eventId });
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return state.events.filter(event => {
      const eventDate = new Date(event.start).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  const setSelectedEvent = (event) => {
    dispatch({ type: 'SET_SELECTED_EVENT', payload: event });
  };

  const toggleModal = (isOpen) => {
    dispatch({ type: 'TOGGLE_MODAL', payload: isOpen });
  };

  return {
    events: state.events,
    selectedEvent: state.selectedEvent,
    isModalOpen: state.isModalOpen,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    setSelectedEvent,
    toggleModal
  };
}