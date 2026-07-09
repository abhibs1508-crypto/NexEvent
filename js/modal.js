/* 
   File: js/modal.js
   Purpose: Orchestrates custom modals, handles escape key binders, click overlays, body-scroll lock, and scale transitions.
*/

const ModalManager = (function() {
    // Open modal by ID
    function open(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Add active classes
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden'; // lock scroll

        // Focus trap or default focus
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }

    // Close modal by ID
    function close(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.remove('is-active');
        
        // Restore body scroll only if no other active modals
        const activeModals = document.querySelectorAll('.modal-overlay.is-active');
        if (activeModals.length === 0) {
            document.body.style.overflow = '';
        }
    }

    // Initialize triggers
    function init() {
        // Global close triggers
        document.addEventListener('click', (e) => {
            // Check if user clicked on overlay directly
            if (e.target.classList.contains('modal-overlay')) {
                close(e.target.id);
            }
            
            // Check if clicked close button
            const closeBtn = e.target.closest('.modal-close');
            if (closeBtn) {
                const modal = closeBtn.closest('.modal-overlay');
                if (modal) close(modal.id);
            }

            // Close button with data attributes
            const trigger = e.target.closest('[data-modal-close]');
            if (trigger) {
                const targetId = trigger.getAttribute('data-modal-close');
                close(targetId);
            }
        });

        // Keydown Esc listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                const activeModals = document.querySelectorAll('.modal-overlay.is-active');
                activeModals.forEach(modal => {
                    close(modal.id);
                });
            }
        });

        // Trigger open via custom triggers
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-modal-open]');
            if (trigger) {
                e.preventDefault();
                const targetId = trigger.getAttribute('data-modal-open');
                open(targetId);
            }
        });
    }

    // Run initialization
    document.addEventListener('DOMContentLoaded', init);

    return {
        open,
        close,
        init
    };
})();
