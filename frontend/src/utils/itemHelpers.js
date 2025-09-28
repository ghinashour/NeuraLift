export function parseTimeToDateTime(timeStr, baseDate = new Date()) {
  if (!timeStr) return null;
  
  // Parse formats like "6:00 AM - 2:00 PM"
  const timeRange = timeStr.split(' - ');
  if (timeRange.length !== 2) return null;
  
  const [startTimeStr, endTimeStr] = timeRange;
  
  const parseTime = (timeStr) => {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return null;
    
    let [, hours, minutes, period] = match;
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    
    if (period.toUpperCase() === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }
    
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };
  
  const startDate = parseTime(startTimeStr);
  const endDate = parseTime(endTimeStr);
  
  return {
    start: startDate?.toISOString(),
    end: endDate?.toISOString()
  };
}

export function formatTimeRange(start, end) {
  if (!start || !end) return '';
  
  const startTime = new Date(start).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const endTime = new Date(end).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return `${startTime} - ${endTime}`;
}
