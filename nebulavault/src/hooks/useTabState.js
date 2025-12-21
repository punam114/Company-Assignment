import { useState } from 'react';

// Create separate state for each tab
const tabStates = {
    artifacts: { currentPage: 1, filter: '' },
    creatures: { currentPage: 1, filter: '' },
    logs: { currentPage: 1, filter: '' }
};

export function useTabState(tabName = 'artifacts') {
    const [currentPage, setCurrentPageState] = useState(tabStates[tabName].currentPage);
    const [filter, setFilterState] = useState(tabStates[tabName].filter);

    const setCurrentPage = (page) => {
        tabStates[tabName].currentPage = page;
        setCurrentPageState(page);
    };

    const setFilter = (filterValue) => {
        tabStates[tabName].filter = filterValue;
        setFilterState(filterValue);
    };

    return {
        currentPage,
        filter,
        setCurrentPage,
        setFilter
    };
}
