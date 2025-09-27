import React from 'react';
import Button from '../UI/Button/Button';
import { getWeekDates } from '../../utils/calendarHelpers';
import { formatShortDate } from '../../utils/dateHelpers';

const WeekNavigation = ({ currentDate, onPreviousWeek, onNextWeek, onToday }) => {
  const weekDates = getWeekDates(currentDate);
  const startDate = weekDates[0];
  const endDate = weekDates[6];

  const formatWeekRange = () => {
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    if (startMonth === endMonth && startYear === endYear) {
      return `${startDate.getDate()} - ${endDate.getDate()} ${startDate.toLocaleString('default', { month: 'long' })} ${startYear}`;
    } else {
      return `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`;
    }
  };

  return (
    <div className="week-navigation">
      <div className="week-controls">
        <Button onClick={onToday} className="today-btn">Today</Button>
        <Button onClick={onPreviousWeek} className="nav-btn">Back</Button>
        <Button onClick={onNextWeek} className="nav-btn">Next</Button>
        <span className="week-range">{formatWeekRange()}</span>
      </div>
      
      <div className="view-controls">
        <Button className="view-btn active">Month</Button>
        <Button className="view-btn active">Week</Button>
        <Button className="view-btn">Day</Button>
      </div>
    </div>
  );
};

export default WeekNavigation;