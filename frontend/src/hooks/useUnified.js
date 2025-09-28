import { useUnifiedContext } from '../context/UnifiedContext';

export function useUnified() {
  const { state, dispatch } = useUnifiedContext();

  // Calendar navigation functions
  const goToDate = (date) => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: date });
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(state.currentDate);
    newDate.setDate(newDate.getDate() - 7);
    dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
  };

  const goToNextWeek = () => {
    const newDate = new Date(state.currentDate);
    newDate.setDate(newDate.getDate() + 7);
    dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
  };

  const goToToday = () => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: new Date() });
  };

  // Item management functions
  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const updateItem = (item) => {
    dispatch({ type: 'UPDATE_ITEM', payload: item });
  };

  const deleteItem = (itemId) => {
    dispatch({ type: 'DELETE_ITEM', payload: itemId });
  };

  const setSelectedItem = (item) => {
    dispatch({ type: 'SET_SELECTED_ITEM', payload: item });
  };

  const toggleModal = (isOpen) => {
    dispatch({ type: 'TOGGLE_MODAL', payload: isOpen });
  };

  // Get items filtered by type
  const getCards = () => {
    return state.items.filter(item => item.type === 'card' || !item.type);
  };

  const getEvents = () => {
    return state.items.filter(item => item.start && item.end); // All items with calendar data
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return state.items.filter(item => {
      if (!item.start) return false;
      const eventDate = new Date(item.start).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  return {
    // State
    currentDate: state.currentDate,
    items: state.items,
    selectedItem: state.selectedItem,
    isModalOpen: state.isModalOpen,
    
    // Calendar functions
    goToDate,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
    
    // Item management
    addItem,
    updateItem,
    deleteItem,
    setSelectedItem,
    toggleModal,
    
    // Filtered getters
    getCards,
    getEvents,
    getEventsForDate
  };
}