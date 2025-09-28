import { useState } from 'react';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  return {
    currentDate,
    goToToday,
    goToPreviousWeek,
    goToNextWeek
  };
};