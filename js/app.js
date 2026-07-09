/* 
   File: js/app.js
   Purpose: Global orchestrator. Controls loading transitions, toast alerts, progress bars, navigation locks, and body scroll locks when drawer is active.
*/

const App = (function() {
    const TOAST_CONTAINER_ID = 'app-toast-container';
    const FAVORITES_KEY = 'sem-favorite-events';

    // Get list of favorited event IDs
    function getFavorites() {
        const stored = localStorage.getItem(FAVORITES_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    // Toggle Favorite status in LocalStorage
    function toggleFavorite(eventId) {
        let favs = getFavorites();
        const index = favs.indexOf(eventId);
        
        if (index === -1) {
            favs.push(eventId);
            showToast("Added to Bookmarks", "Event is saved to your profile.", "success");
        } else {
            favs.splice(index, 1);
            showToast("Removed Bookmarks", "Event is removed from your profile.", "info");
        }
        
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
        updateFavoriteIcons();
        return index === -1;
    }

    // Sync favorite icons in viewport
    function updateFavoriteIcons() {
        const favs = getFavorites();
        const favButtons = document.querySelectorAll('[data-fav-toggle]');
        
        favButtons.forEach(btn => {
            const eventId = btn.getAttribute('data-fav-toggle');
            const icon = btn.querySelector('i');
            
            if (favs.includes(eventId)) {
                btn.classList.add('is-favorite');
                if (icon) {
                    icon.className = 'fas fa-heart text-danger';
                }
            } else {
                btn.classList.remove('is-favorite');
                if (icon) {
                    icon.className = 'far fa-heart';
                }
            }
        });
    }

    // Initialize Toast Container dynamically if missing
    function initToastContainer() {
        let container = document.getElementById(TOAST_CONTAINER_ID);
        if (!container) {
            container = document.createElement('div');
            container.id = TOAST_CONTAINER_ID;
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    // Show Toast Notification
    function showToast(title, message, type = 'info', duration = 4000) {
        const container = initToastContainer();
        const toast = document.createElement('div');
        
        let typeClass = 'toast-info';
        let iconClass = 'fas fa-info-circle';

        if (type === 'success') {
            typeClass = 'toast-success';
            iconClass = 'fas fa-check-circle';
        } else if (type === 'warning') {
            typeClass = 'toast-warning';
            iconClass = 'fas fa-exclamation-triangle';
        } else if (type === 'error') {
            typeClass = 'toast-error';
            iconClass = 'fas fa-exclamation-circle';
        }

        toast.className = `toast ${typeClass}`;
        toast.innerHTML = `
            <div class="toast-icon"><i class="${iconClass}"></i></div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" style="background:none;border:none;color:var(--text-muted);cursor:pointer;min-height:30px;min-width:30px;" aria-label="Close Notification"><i class="fas fa-times"></i></button>
        `;

        container.appendChild(toast);

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => dismissToast(toast));

        const timer = setTimeout(() => {
            dismissToast(toast);
        }, duration);

        toast.dataset.dismissTimer = timer;
    }

    // Smoothly remove toast from viewport
    function dismissToast(toast) {
        clearTimeout(parseInt(toast.dataset.dismissTimer, 10));
        
        toast.style.transform = 'translateX(120%) scale(0.9)';
        toast.style.opacity = '0';
        toast.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }

    // Dismiss preloader
    function initPreloader() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    preloader.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.6s';
                }, 400);
            });
        }
    }

    // Back to top click actions
    function initBackToTop() {
        const btn = document.querySelector('.back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                btn.classList.add('is-active');
            } else {
                btn.classList.remove('is-active');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Scroll Progress bar tracker
    function initScrollProgress() {
        const bar = document.querySelector('.scroll-progress-bar');
        if (!bar) return;

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (window.scrollY / windowHeight) * 100;
            bar.style.width = `${scrollPercent}%`;
        });
    }

    // Navbar Scroll transformations
    function initNavbarScroll() {
        const nav = document.querySelector('.navbar');
        if (!nav) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // Hamburger Mobile Menu triggers with scroll lock
    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const menu = document.querySelector('.nav-menu');
        
        if (hamburger && menu) {
            hamburger.addEventListener('click', () => {
                const isActive = hamburger.classList.toggle('is-active');
                menu.classList.toggle('is-active');
                
                // Prevent body scroll when overlay drawer is active
                if (isActive) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            // Close menu and release scroll lock if a link is clicked
            const links = menu.querySelectorAll('.nav-link');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('is-active');
                    menu.classList.remove('is-active');
                    document.body.style.overflow = '';
                });
            });
        }
    }

    // Setup basic dynamic layout features
    function init() {
        initPreloader();
        initBackToTop();
        initScrollProgress();
        initNavbarScroll();
        initMobileMenu();

        // Favorite toggle binding delegation
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-fav-toggle]');
            if (btn) {
                e.preventDefault();
                e.stopPropagation();
                const eventId = btn.getAttribute('data-fav-toggle');
                toggleFavorite(eventId);
            }
        });

        updateFavoriteIcons();
    }

    document.addEventListener('DOMContentLoaded', init);

    return {
        init,
        showToast,
        toggleFavorite,
        getFavorites,
        updateFavoriteIcons
    };
})();
