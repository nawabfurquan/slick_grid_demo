import { useMemo } from "react";
import useFilteredIndices from "./useFilteredIndices";
import useMockDataStore from "./useMockDataStore";
import type { SortColumn } from "../components/SlickGridDemo";

const useSortedFilteredIndices = (sortColumn: SortColumn | undefined) => {
    const { rowCount } = useMockDataStore();
    const filteredIndices = useFilteredIndices(rowCount);
    const sortedFilteredIndices = useMemo(() => {
        const indices = filteredIndices.slice();

        if (sortColumn) {
            indices.sort((a, b) => {
                const valueA = sortColumn.column.data[a];
                const valueB = sortColumn.column.data[b];
                if (valueA === valueB) return 0;
    
                const comparison = valueA < valueB ? -1 : 1;
                return sortColumn.ascending ? comparison : -comparison;
            })
        }
        return indices;
    }, [filteredIndices, sortColumn]);

    return sortedFilteredIndices;
};

export default useSortedFilteredIndices;