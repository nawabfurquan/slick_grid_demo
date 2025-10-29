import { useMemo, useRef } from "react";
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz, colorSchemeDark } from 'ag-grid-community';
import type { ColDef, ValueGetterParams } from 'ag-grid-community';
import useMockDataStore from "../hooks/useMockDataStore";


const AgGridDemo = () => {
    const gridRefClient = useRef<AgGridReact>(null);
    // Add column defs and row data
    // For getting the column data use a hook to get
    const { columnData, rowCount } = useMockDataStore();

    const columnDefs = useMemo(() => {
        const colDefs: ColDef[] = [];
        for (const col of columnData) {
            colDefs.push({
                headerName: col.name === 'id' ? 'ID' : col.name.replace('col', 'Column '),
                field: col.name,
                valueGetter: (params: ValueGetterParams) => {
                    return col.data[params.data?.index];
                },
                sortable: true,
                filter: true,
            })
        }
        return colDefs;
    }, [columnData]);

    const rowData = useMemo(() => {
        return Array.from({length: rowCount}, (_, i) => ({index: i}))
    }, [columnData, rowCount]);


    const defaultColDef = useMemo<ColDef>(() => ({
        width: 120,
        resizable: true,
    }), []);
    const myTheme = themeQuartz.withPart(colorSchemeDark);
    return (
        <div style={{ display: 'flex', flexDirection: "column", height: '700px', paddingBottom: "100px" }}>
        <h2 style={{ marginBottom: '15px' }}>AG Grid Demo</h2>
        <div style={{ flex: 1, minWidth: 0 }}>
            <AgGridReact
                ref={gridRefClient}
                theme={myTheme}
                columnDefs={columnDefs}
                rowData={rowData}
                defaultColDef={defaultColDef}
            />
        </div>
        </div>
    );
};

export default AgGridDemo;