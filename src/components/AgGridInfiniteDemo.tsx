import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz, colorSchemeDark } from 'ag-grid-community';
import type { ColDef, FilterChangedEvent, GridReadyEvent, IGetRowsParams, SortChangedEvent } from 'ag-grid-community';
import useMockDataStore from "../hooks/useMockDataStore";
import useSortedFilteredIndices from "../hooks/useSortedFilteredIndices";
import type { SortColumn } from "./SlickGridDemo";
import type { FilterColumn } from "../hooks/useFilteredIndices";


const AgGridInfiniteDemo = () => {
    const gridRefClient = useRef<AgGridReact>(null);
    const { columnData, rowCount } = useMockDataStore();
    const [sortColumn, setSortColumn] = useState<SortColumn>();
    const [filters, setFilters] = useState<FilterColumn[]>();
    const sortedFilteredIndices = useSortedFilteredIndices(sortColumn, filters);
    const columnDataRef = useRef(columnData);

    useEffect(() => {
      columnDataRef.current = columnData;
    }, [columnData]);

    useEffect(() => {
        console.log("Column data changed, clearing sort");
        setSortColumn(undefined);
        setFilters([]);
        
        const api = gridRefClient.current?.api;
        if (api) {
            api.applyColumnState({
                defaultState: { sort: null },
                state: []
            });
            api.setFilterModel(null);
        }
      }, [columnData]);

    const columnDefs = useMemo(() => {
        const colDefs: ColDef[] = [];
        for (const col of columnData) {
            colDefs.push({
                headerName: col.name === 'id' ? 'ID' : col.name.replace('col', 'Column '),
                field: col.name,
                pinned: col.name === 'id' ? 'left' : undefined,
                sortable: true,
                filter: col.name === 'id' ? false : true,
            })
        }
        return colDefs;
    }, [columnData]);

    const datasource = useMemo(() => {
        return {
            getRows: (params: IGetRowsParams) => {
                const rowBlock = [];
                for (let i = params.startRow; i < params.endRow; i++) {
                    if (i >= sortedFilteredIndices.length) break;

                    const row: any = {};
                    const index = sortedFilteredIndices[i];

                    for (const col of columnData) {
                        row[col.name] = col.data[index];
                    }
                    rowBlock.push(row);
                }
                params.successCallback(rowBlock, sortedFilteredIndices.length)
            }
        };
    }, [columnData, sortedFilteredIndices]);

    const onGridReady = useCallback((params: GridReadyEvent) => {
        params.api.setGridOption('datasource', datasource);
    }, [datasource]);

    useEffect(() => {
        const api = gridRefClient.current?.api;
        if (api && datasource) {
            api.setGridOption('datasource', datasource);

            api.refreshInfiniteCache();
        }
    }, [datasource]);

    const onSortChanged = useCallback((e: SortChangedEvent<any, any>) => {
        if (e.columns && e.columns.length > 0) {
            const columnToSort = e.columns[0];
            const colId = columnToSort.getColId();
            const col = columnDataRef.current.find((c) => c.name === colId);

            if (col) {

                if (columnToSort.getSort()) {
                    const ascending = columnToSort.getSort() === 'asc';
                    console.log("Sorting: ", col.name, "Ascending: ", ascending);
                    setSortColumn({
                        column: col,
                        ascending,
                    });
                } else {
                    setSortColumn(undefined);
                }
            }
        }
    }, []);

    const onFilterChanged = useCallback((e: FilterChangedEvent) => {
        const filterModel = e.api.getFilterModel();
        const filterColumn: FilterColumn[] = [];

        for (const [colId, filterValue] of Object.entries(filterModel)) {
            const col = columnDataRef.current.find((c) => c.name === colId);
            if (!col || !filterValue) continue;

            let operator = '';
            let searchTerms: (string | number | null)[] = [];

            if (typeof filterValue === 'object' && 'filter' in filterValue) {
                const filterType = filterValue.type || 'equals';
                
                // Map AG Grid operators to our operators
                switch (filterType) {
                    case 'equals':
                        operator = '=';
                        break;
                    case 'notEqual':
                        operator = '!=';
                        break;
                    case 'greaterThan':
                        operator = '>';
                        break;
                    case 'greaterThanOrEqual':
                        operator = '>=';
                        break;
                    case 'lessThan':
                        operator = '<';
                        break;
                    case 'lessThanOrEqual':
                        operator = '<=';
                        break;
                    case 'contains':
                    case 'startsWith':
                    case 'endsWith':
                    default:
                        operator = 'contains';
                        break;
                }

                if (filterValue.filter !== null && filterValue.filter !== undefined) {
                    searchTerms = [filterValue.filter];
                }
            }

            if (searchTerms.length > 0 && searchTerms[0] !== null && searchTerms[0] !== undefined) {
                filterColumn.push({
                    column: col,
                    operator,
                    searchTerms,
                });
            }
        }
        console.log("Filters changed:", filterColumn);
        setFilters(filterColumn);
    }, []);


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
                onSortChanged={onSortChanged}
                onFilterChanged={onFilterChanged}
            />
        </div>
        </div>
    );
};

export default AgGridInfiniteDemo;