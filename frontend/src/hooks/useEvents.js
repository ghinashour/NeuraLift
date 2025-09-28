// src/hooks/useEvents.js
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'app_events_v1';

export const useEvents = () => {
  const [events, setEvents] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (err) {
      console.error('[useEvents] load error', err);
    }

    // default initial events (ids are strings)
    return [
      {
        id: "1",
        title: "TeaTable with Hassan Matin",
        description: "In this video you will learn sharing minutes on teams... ",
        start: "2022-07-10T06:00:00",
        end: "2022-07-10T08:00:00",
        color: "#4A90E2"
      },
      {
        id: "2",
        title: "App Walk-through Feature",
        description: "",
        start: "2022-07-11T06:00:00",
        end: "2022-07-11T07:30:00",
        color: "#50C8E8"
      },
      // ...more initial events (truncated for brevity)
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (err) {
      console.error('[useEvents] save error', err);
    }
  }, [events]);

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: String(Date.now())
    };
    setEvents(prev => [...prev, newEvent]);
    console.log('[useEvents] added', newEvent);
  };

  const updateEvent = (id, updatedData) => {
    const stringId = String(id);
    setEvents(prev => prev.map(ev => ev.id === stringId ? { ...ev, ...updatedData } : ev));
    console.log('[useEvents] updated', stringId, updatedData);
  };

  const deleteEvent = (id) => {
    const stringId = String(id);
    setEvents(prev => prev.filter(ev => ev.id !== stringId));
    console.log('[useEvents] deleted', stringId);
  };

  return { events, addEvent, updateEvent, deleteEvent };
};

export default useEvents;
