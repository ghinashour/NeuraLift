// src/utils/calendarHelpers.js
export const getWeekDates = (current = new Date()) => {
  // week starting on Sunday
  const date = new Date(current);
  // find Sunday
  const day = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - day);
  sunday.setHours(0,0,0,0);

  const arr = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    arr.push(d);
  }
  return arr;
};

export const getTimeSlots = () => {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    const t = new Date(1970,0,1,h);
    slots.push(t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }
  return slots;
};
