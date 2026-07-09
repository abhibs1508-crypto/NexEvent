/* 
   File: js/counter.js
   Purpose: Handles counting animation for numerical stats panels using IntersectionObserver for scroll-reveal triggers.
*/

const CounterManager = (function() {
    function animate(el) {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const duration = 2000; // 2 seconds animation
        const start = 0;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Easing function: easeOutQuad
            const easeProgress = progress * (2 - progress);
            const current = Math.floor(easeProgress * (target - start) + start);
            
            el.textContent = current;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = target; // Ensure it ends exactly on the target
            }
        }

        window.requestAnimationFrame(step);
    }

    function init() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate(entry.target);
                        observer.unobserve(entry.target); // Animate once
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            counters.forEach(counter => observer.observe(counter));
        } else {
            // Fallback for older browsers
            counters.forEach(counter => {
                counter.textContent = counter.getAttribute('data-target');
            });
        }
    }

    // Trigger on load
    document.addEventListener('DOMContentLoaded', init);

    return {
        init,
        animate
    };
})();
