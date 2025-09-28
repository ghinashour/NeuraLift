export function validateEvent(event) {
  const errors = {};
  
  if (!event.title?.trim()) {
    errors.title = 'Title is required';
  }
  
  if (!event.start) {
    errors.start = 'Start time is required';
  }
  
  if (!event.end) {
    errors.end = 'End time is required';
  }
  
  if (event.start && event.end && new Date(event.start) >= new Date(event.end)) {
    errors.end = 'End time must be after start time';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}