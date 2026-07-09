/* 
   File: js/sort.js
   Purpose: Global sorting filters for catalog items by name, date chronological order, and seating availability.
*/

const SortManager = (function() {
    // Sort array by property
    function sortItems(items, key, direction = 'asc') {
        const sorted = [...items];
        
        sorted.sort((a, b) => {
            let valA = a[key];
            let valB = b[key];

            // Normalize strings for comparison
            if (typeof valA === 'string' && typeof valB === 'string') {
                if (key === 'date') {
                    // Compare timestamps
                    return direction === 'asc' 
                        ? new Date(valA) - new Date(valB) 
                        : new Date(valB) - new Date(valA);
                }
                
                valA = valA.toLowerCase().trim();
                valB = valB.toLowerCase().trim();
            }

            if (valA < valB) {
                return direction === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return sorted;
    }

    return {
        sortItems
    };
})();
