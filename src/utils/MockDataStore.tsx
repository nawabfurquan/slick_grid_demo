import { createContext, useEffect, useMemo, useState } from "react";

export type ColumnData = {
    name: string;
    data: Float32Array;
};

export type MockDataStoreType = {
    rowCount: number; 
    columnCount: number; 
    setRowCount: (rows: number) => void;
    setColumnCount: (cols: number) => void;
    columnData: ColumnData[];
};

export const MockDataStoreContext = createContext<MockDataStoreType | null>(null);

const MockDataStoreProvider = ({children}: {children: React.ReactNode}) => {
    const [rowCount, setRowCount] = useState(100000); // -> 100k defualt
    const [columnCount, setColumnCount] = useState(50); // -> 50 default

    const columnData = useMemo(() => {
        const cols: ColumnData[] = [];

        for (let col=0; col<columnCount; col++) {
            const colData = new Float32Array(rowCount);
            for (let row=0; row<rowCount; row++) {
                if (col === 0) {
                    colData[row] = row + 1;
                } else {
                    colData[row] = Math.floor(Math.random() * 100) + 1;
                }
            }
            cols.push({
                name: col === 0 ? "id" : `col${col}`,
                data: colData
            })
        }

        return cols;
    }, [columnCount, rowCount]);

    useEffect(() => {
        console.log("row count: ", rowCount);
        console.log("column count: ", columnCount);
        console.log("column data: ", columnData);
    }, [rowCount, columnCount, columnData]);

    return (
        <MockDataStoreContext.Provider value={{ rowCount, columnCount, setRowCount, setColumnCount, columnData }}>
            {children}
        </MockDataStoreContext.Provider>
    );
};

export default MockDataStoreProvider;