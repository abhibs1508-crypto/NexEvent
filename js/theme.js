/* 
   File: js/theme.js
   Purpose: Manages light/dark themes, checks local storage, updates data-theme attribute, and syncs UI icons.
*/

(function() {
    const THEME_STORAGE_KEY = 'sem-theme';
    const THEME_ATTR = 'data-theme';

    // Get preferred theme from localStorage or system setting
    function getPreferredTheme() {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Set theme and save to localStorage
    function setTheme(theme) {
        document.documentElement.setAttribute(THEME_ATTR, theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        updateToggleIcons(theme);
    }

    // Update the toggler icons
    function updateToggleIcons(theme) {
        const toggles = document.querySelectorAll('.theme-toggle');
        toggles.forEach(toggle => {
            const moonIcon = toggle.querySelector('.fa-moon');
            const sunIcon = toggle.querySelector('.fa-sun');
            if (theme === 'dark') {
                if (moonIcon) moonIcon.style.display = 'none';
                if (sunIcon) sunIcon.style.display = 'block';
            } else {
                if (moonIcon) moonIcon.style.display = 'block';
                if (sunIcon) sunIcon.style.display = 'none';
            }
        });
    }

    // Initialize Theme immediately to prevent FOUC (Flash of Unstyled Content)
    const initialTheme = getPreferredTheme();
    document.documentElement.setAttribute(THEME_ATTR, initialTheme);

    // Bind events once DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        const toggles = document.querySelectorAll('.theme-toggle');
        
        // Sync active state UI icons
        updateToggleIcons(initialTheme);
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const currentTheme = document.documentElement.getAttribute(THEME_ATTR);
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                // Add temporary transition to body
                document.body.style.transition = 'background-color 0.4s ease, color 0.4s ease';
                setTheme(newTheme);
                
                // Remove transition after it's done
                setTimeout(() => {
                    document.body.style.transition = '';
                }, 400);
            });
        });
    });

    // Make global if needed
    window.AppTheme = {
        setTheme: setTheme,
        getTheme: () => document.documentElement.getAttribute(THEME_ATTR)
    };
})();
