import { useCalendarContext } from '../contexts/CalendarContext';

export function useCalendar() {
  const { state, dispatch } = useCalendarContext();

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

  return {
    currentDate: state.currentDate,
    goToDate,
    goToPreviousWeek,
    goToNextWeek,
    goToToday
  };
}