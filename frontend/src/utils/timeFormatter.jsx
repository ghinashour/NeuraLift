export const timeFormatter = {
  formatTime: (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },
  
  formatMinutes: (minutes) => {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }
};