/* 
   File: js/filter.js
   Purpose: Implements category-based filtering, allowing dynamic switches between event tags.
*/

const FilterManager = (function() {
    // Filter array by category field
    function filterByCategory(items, category, categoryField = 'category') {
        if (!category || category === 'all') {
            return items;
        }
        
        return items.filter(item => {
            const val = item[categoryField];
            if (!val) return false;
            return String(val).toLowerCase() === String(category).toLowerCase();
        });
    }

    return {
        filterByCategory
    };
})();
