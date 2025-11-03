import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SlickgridReact } from 'slickgrid-react';
import type { Column, GridOption, SlickgridReactInstance } from 'slickgrid-react';
import SGAdapter from '../utils/SGAdapter';
import useMockDataStore from '../hooks/useMockDataStore';
import useSortedFilteredIndices from '../hooks/useSortedFilteredIndices';
import type { ColumnData } from '../utils/MockDataStore';
import type { FilterColumn } from '../hooks/useFilteredIndices';

export type SortColumn = {
  column: ColumnData;
  ascending: boolean;
};

const SlickGridDemo = () => {
  const { columnData } = useMockDataStore();
  const reactGridRef = useRef<SlickgridReactInstance | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>();
  const [filters, setFilters] = useState<FilterColumn[]>([]);
  const sortedFilteredIndices = useSortedFilteredIndices(sortColumn, filters);
  const columnDataRef = useRef(columnData);

  useEffect(() => {
    columnDataRef.current = columnData;
  }, [columnData]);

  // Clear sort and filters when columnData changes
  useEffect(() => {
    console.log("Column data changed, clearing sort and filters");
    setSortColumn(undefined);
    setFilters([]);
    
    const grid = reactGridRef.current?.slickGrid;
    if (grid) {
      grid.setSortColumns([]);
    }
    const filterService = reactGridRef.current?.filterService;
    if (filterService) {
      filterService.clearFilters();
    }
  }, [columnData]);

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
    console.log('Creating data provider');
    return new SGAdapter(columnData, sortedFilteredIndices);
  }, [columnData, sortedFilteredIndices]);

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
    enableFiltering: true,
  }), []);

  useEffect(() => {
    const grid = reactGridRef.current?.slickGrid;
    if (grid && dataProvider) {
      grid.setData(dataProvider, true);
      grid.render();
      console.log(`Grid updated`);
    }
  }, [dataProvider]);

  useEffect(() => {
    const grid = reactGridRef.current?.slickGrid;
    if (!grid) return;

    const sortHandler: any = grid.onSort.subscribe((_e, args) => {
      
      if ("sortCol" in args && args.sortCol && "sortAsc" in args && 
          args.sortAsc !== null && args.sortAsc !== undefined) {
        // Use ref to get current columnData
        const col = columnDataRef.current.find((c) => c.name === args.sortCol?.field);
        if (col) {
          console.log("Setting sort:", col.name, args.sortAsc ? "asc" : "desc");
          setSortColumn({
            column: col,
            ascending: args.sortAsc,
          });
        }
      }
    });

    const removeSortHandler = grid.getPubSubService()?.subscribe("onHeaderMenuCommand", ({command}) => {      
      if (command === "clear-sort") {
        console.log("Clear sort");
        setSortColumn(undefined);
      }
    });

    const clearAllSortHandler = grid.getPubSubService()?.subscribe("onGridMenuCommand", ({command}) => {
      if (command === "clear-sorting") {
        console.log("Clear All sort");
        setSortColumn(undefined);
      }
    });

    const filterChangedHandler = grid.getPubSubService()?.subscribe("onFilterChanged", () => {
      const filterService = reactGridRef.current?.filterService;
      if (!filterService) return;

      const currentFilters = filterService.getCurrentLocalFilters();
      const filterColumn: FilterColumn[] = [];

      for (const filter of currentFilters) {
        // Find the column
        const col = columnDataRef.current.find((c) => c.name === filter.columnId);
        if (col && filter.searchTerms && filter.searchTerms.length > 0) {
          // Set the filter column
          if (filter.searchTerms.length > 0) {
            filterColumn.push({
              column: col,
              operator: filter.operator || '',
              searchTerms: filter.searchTerms,
            });
          }
        }
      }

      console.log("Filters changed:", filterColumn);
      setFilters(filterColumn);
    });

    const filterClearedHandler = grid.getPubSubService()?.subscribe("onFilterCleared", () => {
      console.log("Filters cleared");
      setFilters([]);
    });

    // Cleanup
    return () => {
      sortHandler?.unsubscribe();
      removeSortHandler?.unsubscribe();
      clearAllSortHandler?.unsubscribe();
      filterChangedHandler?.unsubscribe();
      filterClearedHandler?.unsubscribe();
    };
  }, []);

  const handleGridCreated = useCallback((e: CustomEvent<SlickgridReactInstance>) => {
    console.log("Grid created");
    reactGridRef.current = e.detail;
    
    const grid = e.detail.slickGrid;
    if (grid && dataProvider) {
      grid.setData(dataProvider, true);
      grid.render();
    }
  }, [dataProvider]);

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

