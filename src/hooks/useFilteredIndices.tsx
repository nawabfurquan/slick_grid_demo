import { useMemo } from "react";

const useFilteredIndices = (rowCount: number) => {
    const filteredIndices = useMemo(() => {
        const indices = new Uint32Array(rowCount);
        for (let i=0; i<rowCount; i++) {
            indices[i] = i;
        }
        return indices;
    }, [rowCount]);

    return filteredIndices;
};

export default useFilteredIndices;