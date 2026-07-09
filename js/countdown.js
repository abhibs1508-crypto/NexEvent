/* 
   File: js/countdown.js
   Purpose: Implements ticking countdown timers for events, displaying remaining days, hours, and minutes dynamically.
*/

const CountdownManager = (function() {
    function startTimer(container, targetDateStr) {
        const targetDate = new Date(targetDateStr).getTime();
        const daysEl = container.querySelector('.countdown-days');
        const hoursEl = container.querySelector('.countdown-hours');
        const minsEl = container.querySelector('.countdown-mins');
        const secsEl = container.querySelector('.countdown-secs');
        const messageEl = container.querySelector('.countdown-expired');

        function update() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                // Timer expired
                if (daysEl) daysEl.parentElement.style.display = 'none';
                if (hoursEl) hoursEl.parentElement.style.display = 'none';
                if (minsEl) minsEl.parentElement.style.display = 'none';
                if (secsEl) secsEl.parentElement.style.display = 'none';
                
                if (messageEl) {
                    messageEl.style.display = 'block';
                    messageEl.textContent = 'Event has started / ended';
                }
                return true; // flag to stop
            }

            // Calculations
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display
            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
            if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');

            if (messageEl) messageEl.style.display = 'none';
            return false;
        }

        // Run immediately
        const stopped = update();
        if (!stopped) {
            const interval = setInterval(() => {
                const finished = update();
                if (finished) {
                    clearInterval(interval);
                }
            }, 1000);
            
            // Store interval ID on container to allow clear
            container.dataset.countdownInterval = interval;
        }
    }

    function init() {
        const timers = document.querySelectorAll('.event-countdown[data-date]');
        timers.forEach(timer => {
            // Clear existing if any
            if (timer.dataset.countdownInterval) {
                clearInterval(parseInt(timer.dataset.countdownInterval, 10));
            }
            const dateStr = timer.getAttribute('data-date');
            startTimer(timer, dateStr);
        });
    }

    return {
        init,
        startTimer
    };
})();
