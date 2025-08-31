import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../styles/CalendarComponentStyle.css';
import api from '../js/APIClient';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null); 

  useEffect(() => {
    setError(null);

    api.getCalendarEvents()
      .then(data => {
        setEvents(data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setError('Could not load calendar events.');
      });
  }, []);

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        events={events}  
      />
    </div>
  );
};

export default CalendarComponent;
