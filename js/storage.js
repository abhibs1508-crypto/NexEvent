/* 
   File: js/storage.js
   Purpose: LocalStorage adapter for read, write, update, and statistics calculation operations for events and user registrations.
*/

const StorageManager = (function() {
    const EVENTS_KEY = 'sem-events';
    const REGISTRATIONS_KEY = 'sem-registrations';

    // Get all events from storage
    function getEvents() {
        const data = localStorage.getItem(EVENTS_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Save all events to storage
    function saveEvents(events) {
        localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    }

    // Get all registrations
    function getRegistrations() {
        const data = localStorage.getItem(REGISTRATIONS_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Save registrations list
    function saveRegistrations(registrations) {
        localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
    }

    // Register a student for an event
    function registerStudent(student) {
        const events = getEvents();
        const registrations = getRegistrations();
        const targetEvent = events.find(e => e.id === student.eventId);

        if (!targetEvent) {
            return { success: false, message: "Event not found." };
        }

        if (targetEvent.seatsLeft <= 0) {
            return { success: false, message: "No seats left for this event!" };
        }

        // Check if student already registered for this event
        const alreadyRegistered = registrations.some(
            r => r.enrollmentNo.toLowerCase() === student.enrollmentNo.toLowerCase() && 
                 r.eventId === student.eventId && 
                 r.status === 'registered'
        );

        if (alreadyRegistered) {
            return { success: false, message: "You are already registered for this event." };
        }

        // Update Event seats
        targetEvent.seatsLeft -= 1;
        saveEvents(events);

        // Add Registration entry
        const newRegistration = {
            id: 'REG-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            ...student,
            registrationDate: new Date().toISOString(),
            status: 'registered'
        };

        registrations.push(newRegistration);
        saveRegistrations(registrations);

        return { success: true, registration: newRegistration };
    }

    // Cancel registration
    function cancelRegistration(registrationId) {
        const registrations = getRegistrations();
        const regIndex = registrations.findIndex(r => r.id === registrationId);

        if (regIndex === -1) {
            return { success: false, message: "Registration record not found." };
        }

        if (registrations[regIndex].status === 'cancelled') {
            return { success: false, message: "Registration is already cancelled." };
        }

        // Mark cancelled
        registrations[regIndex].status = 'cancelled';
        saveRegistrations(registrations);

        // Refund event seat
        const events = getEvents();
        const targetEvent = events.find(e => e.id === registrations[regIndex].eventId);
        if (targetEvent) {
            targetEvent.seatsLeft += 1;
            saveEvents(events);
        }

        return { success: true, message: "Registration cancelled successfully!" };
    }

    // Check if student registered for specific event
    function isStudentRegistered(enrollmentNo, eventId) {
        const registrations = getRegistrations();
        return registrations.some(
            r => r.enrollmentNo.toLowerCase() === enrollmentNo.toLowerCase() && 
                 r.eventId === eventId && 
                 r.status === 'registered'
        );
    }

    // Get registration stats for dashboard
    function getRegistrationStats() {
        const regs = getRegistrations();
        
        let active = 0;
        let cancelled = 0;
        let upcoming = 0;
        let completed = 0;

        const now = new Date();

        regs.forEach(r => {
            if (r.status === 'cancelled') {
                cancelled++;
            } else if (r.status === 'registered') {
                active++;
                // Get event date to determine upcoming vs completed
                const events = getEvents();
                const ev = events.find(e => e.id === r.eventId);
                if (ev) {
                    const evDate = new Date(ev.date);
                    if (evDate >= now) {
                        upcoming++;
                    } else {
                        completed++;
                    }
                } else {
                    upcoming++; // fallback
                }
            }
        });

        return {
            total: regs.length,
            active,
            cancelled,
            upcoming,
            completed
        };
    }

    return {
        getEvents,
        saveEvents,
        getRegistrations,
        registerStudent,
        cancelRegistration,
        isStudentRegistered,
        getRegistrationStats
    };
})();
