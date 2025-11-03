import { useMemo } from "react";
import useFilteredIndices from "./useFilteredIndices";
import type { SortColumn } from "../components/SlickGridDemo";
import type { FilterColumn } from "./useFilteredIndices";

const useSortedFilteredIndices = (sortColumn: SortColumn | undefined, filters: FilterColumn[] = []) => {
    const filteredIndices = useFilteredIndices(filters);
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