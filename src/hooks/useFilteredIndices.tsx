import { useMemo } from "react";
import useMockDataStore from "./useMockDataStore";

const useFilteredIndices = () => {
    const { rowCount, columnCount } = useMockDataStore();
    const filteredIndices = useMemo(() => {
        const indices = new Uint32Array(rowCount);
        for (let i=0; i<rowCount; i++) {
            indices[i] = i;
        }
        return indices;
    }, [rowCount, columnCount]);

    return filteredIndices;
};

export default useFilteredIndices;