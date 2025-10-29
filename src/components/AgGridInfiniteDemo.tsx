import { useCallback, useEffect, useMemo, useRef } from "react";
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz, colorSchemeDark } from 'ag-grid-community';
import type { ColDef, GridReadyEvent, IGetRowsParams } from 'ag-grid-community';
import useMockDataStore from "../hooks/useMockDataStore";
import useFilteredIndices from "../hooks/useFilteredIndices";


const AgGridInfiniteDemo = () => {
    const gridRefClient = useRef<AgGridReact>(null);
    const { columnData, rowCount } = useMockDataStore();
    const filteredIndices = useFilteredIndices(rowCount);

    const columnDefs = useMemo(() => {
        const colDefs: ColDef[] = [];
        for (const col of columnData) {
            colDefs.push({
                headerName: col.name === 'id' ? 'ID' : col.name.replace('col', 'Column '),
                field: col.name,
                pinned: col.name === 'id' ? 'left' : undefined,
            })
        }
        return colDefs;
    }, [columnData]);

    const datasource = useMemo(() => {
        return {
            getRows: (params: IGetRowsParams) => {
                const rowBlock = [];
                for (let i = params.startRow; i < params.endRow; i++) {
                    const row: any = {};
                    const index = filteredIndices[i];

                    for (const col of columnData) {
                        row[col.name] = col.data[index];
                    }
                    rowBlock.push(row);
                }
                params.successCallback(rowBlock, rowCount)
            }
        };
    }, [columnData, rowCount, filteredIndices]);

    const onGridReady = useCallback((params: GridReadyEvent) => {
        params.api.setGridOption('datasource', datasource);
    }, [datasource]);

    useEffect(() => {
        const api = gridRefClient.current?.api;
        if (api && columnData.length > 0) {
            api.setGridOption('datasource', datasource);
        }
    }, [datasource, columnData]);


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
                defaultColDef={defaultColDef}
                rowModelType={'infinite'}
                cacheBlockSize={100}     
                cacheOverflowSize={2}    
                maxConcurrentDatasourceRequests={1}  
                infiniteInitialRowCount={rowCount} 
                maxBlocksInCache={10} 
                onGridReady={onGridReady}
            />
        </div>
        </div>
    );
};

export default AgGridInfiniteDemo;