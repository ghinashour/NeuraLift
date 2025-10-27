export const getWeekDates = (currentDate) => {
  const start = new Date(currentDate);
  start.setDate(start.getDate() - start.getDay()); // Sunday
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    week.push(d);
  }
  return week;
};

export const getTimeSlots = () => {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
  }
  return slots;
};
