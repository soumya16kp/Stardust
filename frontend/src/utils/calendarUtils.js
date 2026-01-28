/**
 * Generates a Google Calendar link for an event
 */
export const getGoogleCalendarLink = (event) => {
    const startTime = new Date(event.date_time).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endTime = event.end_time
        ? new Date(event.end_time).toISOString().replace(/-|:|\.\d\d\d/g, "")
        : new Date(new Date(event.date_time).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        dates: `${startTime}/${endTime}`,
        details: `${event.short_description || ''} \n\nView more: ${window.location.origin}/events/${event.slug || event.id}`,
        location: event.region || 'Global',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Downloads an ICS file for an event
 */
export const downloadICS = (event) => {
    const startTime = new Date(event.date_time).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endTime = event.end_time
        ? new Date(event.end_time).toISOString().replace(/-|:|\.\d\d\d/g, "")
        : new Date(new Date(event.date_time).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.origin}/events/${event.slug || event.id}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${event.title}
DESCRIPTION:${event.short_description || ''}
LOCATION:${event.region || 'Global'}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${event.slug || 'event'}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
