import { useMemo } from "react";
import useMockDataStore from "./useMockDataStore";
import type { ColumnData } from "../utils/MockDataStore";
import type { SearchTerm } from "slickgrid-react";

export type FilterColumn = {
    column: ColumnData;
    operator: string;
    searchTerms: SearchTerm[];
} | undefined;

const useFilteredIndices = (filters: FilterColumn[]) => {
    const { rowCount, columnData } = useMockDataStore();
    const filteredIndices = useMemo(() => {
        const indices = new Uint32Array(rowCount);
        let count = 0;

        // If no filters, return all indices
        const activeFilters = filters.filter(f => f !== undefined);
        if (activeFilters.length === 0) {
            for (let i = 0; i < rowCount; i++) {
                indices[i] = i;
            }
            return indices;
        }

        // Apply filters
        for (let i = 0; i < rowCount; i++) {
            let passes = true;

            for (const filter of activeFilters) {
                if (!filter) continue;
                
                const value = filter.column.data[i];
                const searchTerms = filter.searchTerms;
                
                if (!searchTerms || searchTerms.length === 0) {
                    continue;
                }

                // Simple filters implementation (only for numbers currently)
                // todo: update it for other datatypes like text
                let matches = false;
                const searchTerm = searchTerms[0];

                switch (filter.operator) {
                    case '=':
                        matches = value === searchTerm;
                        break;
                    case '!=':
                        matches = value !== searchTerm;
                        break;
                    case '>':
                        matches = Number(value) > Number(searchTerm);
                        break;
                    case '>=':
                        matches = Number(value) >= Number(searchTerm);
                        break;
                    case '<':
                        matches = Number(value) < Number(searchTerm);
                        break;
                    case '<=':
                        matches = Number(value) <= Number(searchTerm);
                        break;
                    default:
                        // contains
                        matches = String(value).toLowerCase().includes(String(searchTerm).toLowerCase());
                }

                if (!matches) {
                    passes = false;
                    break;
                }
            }

            if (passes) {
                indices[count++] = i;
            }
        }

        return indices.slice(0, count);
    }, [rowCount, filters, columnData]);

    return filteredIndices;
};

export default useFilteredIndices;