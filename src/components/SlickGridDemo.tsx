import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SlickgridReact } from 'slickgrid-react';
import type { Column, GridOption, SlickgridReactInstance } from 'slickgrid-react';
import SGAdapter from '../utils/SGAdapter';
import useMockDataStore from '../hooks/useMockDataStore';
import useSortedFilteredIndices from '../hooks/useSortedFilteredIndices';
import type { ColumnData } from '../utils/MockDataStore';

export type SortColumn = {
  column: ColumnData;
  ascending: boolean;
};

const SlickGridDemo = () => {
  const { columnData, rowCount } = useMockDataStore();
  const reactGridRef = useRef<SlickgridReactInstance | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>();
  const sortedFilteredIndices = useSortedFilteredIndices(sortColumn);

  useEffect(() => {
    console.log("rendering slick grid demo")
    });
  const columnDefs = useMemo(() => {
    const colDefs: Column[] = [];
    for (const col of columnData) {
      colDefs.push({
        id: col.name,
        name: col.name === 'id' ? 'ID' : col.name.replace('col', 'Column '),
        field: col.name,
        sortable: true,
        filterable: col.name !== 'id',
        minWidth: col.name === 'id' ? 100 : 150,
      })
    }
    return colDefs;
  }, [columnData]);

  const dataProvider = useMemo(() => {
    console.log('Creating virtual data provider...');
    return new SGAdapter(columnData, sortedFilteredIndices);
  }, [rowCount, columnData, sortedFilteredIndices]);

  const options = useMemo<GridOption>(() => ({
    darkMode: true,
    enableAutoResize: false,
    gridHeight: 600, 
    gridWidth: "100%",
    enableSorting: true,
    multiColumnSort: false,
    enableCellNavigation: true,
    enableColumnReorder: true,
    asyncEditorLoading: false,
    enableAsyncPostRender: false,
    forceFitColumns: false,
    enableCellRowSpan: true,
    rowHeight: 30,
    rowTopOffsetRenderType: 'top',
    frozenColumn: 0,
  }), []);

  useEffect(() => {
    const grid = reactGridRef.current?.slickGrid;
    if (grid && dataProvider) {
      grid.setData(dataProvider, true);
      grid.render();
      console.log(`Grid updated with ${rowCount.toLocaleString()} rows`);
    }
  }, [dataProvider, rowCount]);
  
  const handleGridCreated = useCallback((e: CustomEvent<SlickgridReactInstance>) => {
    reactGridRef.current = e.detail;
    
    const grid = e.detail.slickGrid;
    if (grid) {
      grid.setData(dataProvider, true);
      grid.render();

      grid.onSort.subscribe((e, args) => {
        console.log("Sort subscribe triggered", args);
        if ("sortCol" in args && args.sortCol && "sortAsc" in args && args.sortAsc !== null && args.sortAsc !== undefined) {
          const col = columnData.find((c) => c.name === args.sortCol?.field);
          if (col) {
            setSortColumn({
              column: col,
              ascending: args.sortAsc,
            })
          }
        } 
        else {
          console.log("Clearing sort");
          setSortColumn(undefined);
          grid.setSortColumns([]);
        }
      });
      console.log(`Grid initialized with ${rowCount.toLocaleString()} rows`);
    }
  }, [dataProvider, columnData, rowCount]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h2 style={{ marginBottom: '15px' }}>Slick Grid Demo</h2>
      
      <SlickgridReact
        gridId="slick-grid-demo"
        columns={columnDefs}
        options={options}
        dataset={[]}
        onReactGridCreated={handleGridCreated}
      />
    </div>
  );
};

export default SlickGridDemo;

