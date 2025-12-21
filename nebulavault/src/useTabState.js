import { useState } from "react";

export function useTabState(){
    const [currentPage , setCurrentPage] = useState(1);
    const [filter , setFilter] = useState('');

    return {
        currentPage,
        filter,
        setCurrentPage,
        setFilter
    }
}