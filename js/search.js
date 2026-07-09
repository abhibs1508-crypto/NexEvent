/* 
   File: js/search.js
   Purpose: Live search controller with built-in debouncer to prevent excessive execution during keystrokes.
*/

const SearchManager = (function() {
    // Debounce helper
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Filters search match
    function filterByKeyword(items, keyword, fieldsToSearch) {
        const query = keyword.toLowerCase().trim();
        if (!query) return items;

        return items.filter(item => {
            return fieldsToSearch.some(field => {
                const value = item[field];
                if (value === undefined || value === null) return false;
                
                if (Array.isArray(value)) {
                    return value.some(subVal => String(subVal).toLowerCase().includes(query));
                }
                
                return String(value).toLowerCase().includes(query);
            });
        });
    }

    return {
        debounce,
        filterByKeyword
    };
})();
