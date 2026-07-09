/* 
   File: js/events.js
   Purpose: Events mock database. Contains expanded metadata (difficulty, coordinates) and helper rendering functions for SVG seat progress rings.
*/

const EventManager = (function() {
    const INITIAL_EVENTS = [
        {
            id: "EV-001",
            title: "National Coding Hackathon 2026",
            category: "tech",
            difficulty: "hard",
            date: "2026-09-15",
            time: "09:00 AM - 09:00 PM",
            venue: "APJ Abdul Kalam Computer Lab",
            seatsTotal: 100,
            seatsLeft: 14,
            coordinator: "Dr. Alok Verma",
            phone: "+91 98765 43210",
            requirements: [
                "Bring your own laptop & charger",
                "Team size: 2-4 members",
                "Basic knowledge of HTML/CSS/JS or Python"
            ],
            image: "images/hackathon.png",
            fallbackImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
            description: "An intensive 12-hour sprint where students from across the country collaborate to solve real-world problems. Develop prototypes, network with tech leaders, and win prizes worth ₹1,50,000."
        },
        {
            id: "EV-002",
            title: "Annual Sports Meet & Athletics",
            category: "sports",
            difficulty: "medium",
            date: "2026-10-02",
            time: "08:00 AM - 06:00 PM",
            venue: "Main Sports Arena & Track",
            seatsTotal: 250,
            seatsLeft: 84,
            coordinator: "Coach Rajesh Dev",
            phone: "+91 98765 09876",
            requirements: [
                "Sports uniform is mandatory",
                "Submit medical fitness certificate",
                "Spikes allowed for track events only"
            ],
            image: "images/sports_meet.png",
            fallbackImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
            description: "The ultimate testing ground for collegiate athletics. Events include 100m, 400m, high jump, shot put, football championship, and basketball qualifiers. Medals and certificates awarded to all winners."
        },
        {
            id: "EV-003",
            title: "Fusion Fest - Cultural Showcase",
            category: "cultural",
            difficulty: "easy",
            date: "2026-08-25",
            time: "05:00 PM - 10:00 PM",
            venue: "Open Air Amphitheatre",
            seatsTotal: 600,
            seatsLeft: 142,
            coordinator: "Prof. Nandini Sharma",
            phone: "+91 91234 56789",
            requirements: [
                "Student ID card required for entry",
                "Prior audition needed for stage performers",
                "Strict adherence to event dress code"
            ],
            image: "images/cultural_fest.png",
            fallbackImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
            description: "A magical evening celebrating music, dance, fashion, and theatrical arts. Featuring guest performances by top artists, student bands, cultural displays, and food stalls from across the country."
        },
        {
            id: "EV-004",
            title: "Autonomous Robotics Workshop",
            category: "tech",
            difficulty: "hard",
            date: "2026-09-02",
            time: "10:00 AM - 04:00 PM",
            venue: "Robotics & IoT Research Center",
            seatsTotal: 50,
            seatsLeft: 0,
            coordinator: "Dr. Vikram Sethi",
            phone: "+91 94567 12345",
            requirements: [
                "Laptops with Arduino IDE installed",
                "Hardware kits will be provided",
                "Pre-requisite: Basics of C programming"
            ],
            image: "images/robotics_workshop.png",
            fallbackImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
            description: "Learn how to build, program, and calibrate line-following and obstacle-avoidance robots. Hands-on training on microcontrollers, sensors, and actuator motor drivers."
        },
        {
            id: "EV-005",
            title: "Global Research Symposium",
            category: "academic",
            difficulty: "medium",
            date: "2026-11-12",
            time: "09:30 AM - 04:30 PM",
            venue: "Tagore Auditorium",
            seatsTotal: 200,
            seatsLeft: 120,
            coordinator: "Dr. Elena Gilbert",
            phone: "+91 95432 10987",
            requirements: [
                "Submit abstract by August 30th",
                "Formal wear required",
                "Powerpoint presentations limited to 10 mins"
            ],
            image: "images/symposium.png",
            fallbackImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80",
            description: "A prestigious platform for presenting research papers on AI, Sustainable Development, Nano-Technology, and Econometrics. Evaluated by panel of scientists and industry researchers."
        },
        {
            id: "EV-006",
            title: "Inter-College Debate & MUN",
            category: "academic",
            difficulty: "hard",
            date: "2026-08-18",
            time: "10:00 AM - 05:00 PM",
            venue: "Senate Block Conference Hall",
            seatsTotal: 80,
            seatsLeft: 8,
            coordinator: "Prof. James Carter",
            phone: "+91 96543 21098",
            requirements: [
                "Prior allocation of country profiles",
                "Formal diplomatic dress code",
                "Submit research dossiers before event"
            ],
            image: "images/debate.png",
            fallbackImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80",
            description: "Simulating the United Nations General Assembly, this debate challenges students to deliberate on global geopolitical crises, craft resolutions, and defend national stances."
        }
    ];

    // Initialize LocalStorage database
    function init() {
        const stored = StorageManager.getEvents();
        if (stored.length === 0) {
            StorageManager.saveEvents(INITIAL_EVENTS);
        }
    }

    // Return all events
    function loadEvents() {
        init();
        return StorageManager.getEvents();
    }

    // Get specific event
    function getEventById(id) {
        const events = loadEvents();
        return events.find(e => e.id === id);
    }

    // SVG Seats remaining ring builder
    function getSeatsRingHTML(seatsLeft, seatsTotal) {
        const pct = seatsTotal > 0 ? (seatsLeft / seatsTotal) : 0;
        const radius = 15;
        const circumference = 2 * Math.PI * radius; // ~94.24
        const offset = circumference - (pct * circumference);
        
        // Return structured string
        return `
            <div class="seats-progress-ring">
                <svg class="seats-ring-svg" viewBox="0 0 36 36">
                    <circle class="seats-ring-circle-bg" cx="18" cy="18" r="15"/>
                    <circle class="seats-ring-circle" cx="18" cy="18" r="15" 
                            stroke-dasharray="${circumference}" 
                            stroke-dashoffset="${offset}"
                            style="stroke: ${seatsLeft === 0 ? 'var(--danger)' : 'var(--primary)'}"/>
                </svg>
            </div>
        `;
    }

    // Render contents inside the detail modal
    function fillDetailsModal(eventId) {
        const event = getEventById(eventId);
        if (!event) return;

        const modal = document.getElementById('event-detail-modal');
        if (!modal) return;

        const img = modal.querySelector('.event-modal-img');
        const title = modal.querySelector('.event-modal-title');
        const category = modal.querySelector('.event-modal-category');
        const desc = modal.querySelector('.event-modal-description');
        const date = modal.querySelector('.event-modal-date');
        const time = modal.querySelector('.event-modal-time');
        const venue = modal.querySelector('.event-modal-venue');
        const coordinator = modal.querySelector('.event-modal-coordinator');
        const phone = modal.querySelector('.event-modal-phone');
        const reqsList = modal.querySelector('.event-modal-reqs');
        const ringContainer = modal.querySelector('.event-modal-ring-container');
        const seatsLeftText = modal.querySelector('.event-modal-seats-text');
        const registerBtn = modal.querySelector('.event-modal-register-btn');

        if (img) {
            img.src = event.image;
            img.onerror = () => { img.src = event.fallbackImage; };
        }
        if (title) title.textContent = event.title;
        if (category) {
            category.textContent = `${event.category} • ${event.difficulty}`;
            category.className = `badge badge-${event.category} event-modal-category`;
        }
        if (desc) desc.textContent = event.description;
        if (date) date.textContent = new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (time) time.textContent = event.time;
        if (venue) venue.textContent = event.venue;
        if (coordinator) coordinator.textContent = event.coordinator;
        
        if (phone) {
            phone.textContent = event.phone;
            phone.href = `tel:${event.phone.replace(/\s+/g, '')}`;
        }
        
        if (reqsList) {
            reqsList.innerHTML = '';
            event.requirements.forEach(req => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-arrow-right text-primary" style="margin-right: 8px; font-size:0.75rem;"></i> ${req}`;
                reqsList.appendChild(li);
            });
        }

        // Render seats ring
        if (ringContainer) {
            ringContainer.innerHTML = getSeatsRingHTML(event.seatsLeft, event.seatsTotal);
        }
        if (seatsLeftText) {
            seatsLeftText.textContent = `${event.seatsLeft} / ${event.seatsTotal} Seats Left`;
        }

        if (registerBtn) {
            if (event.seatsLeft === 0) {
                registerBtn.textContent = 'Sold Out';
                registerBtn.disabled = true;
                registerBtn.className = 'btn btn-danger disabled w-full';
            } else {
                registerBtn.textContent = 'Confirm Seat Reservation';
                registerBtn.disabled = false;
                registerBtn.className = 'btn btn-primary w-full';
                registerBtn.onclick = () => {
                    window.location.href = `registration.html?event=${event.id}`;
                };
            }
        }
    }

    return {
        loadEvents,
        getEventById,
        getSeatsRingHTML,
        fillDetailsModal,
        init
    };
})();
