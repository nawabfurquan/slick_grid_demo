import { useMemo, useState } from 'react';
import { SlickgridReact } from 'slickgrid-react';
import type { Column, GridOption } from 'slickgrid-react';

const ROWS = 10_000_000;
const COLUMNS = 50;

const randomNum = () => Math.floor((Math.random() * 100) + 1);

console.log(`Creating ${COLUMNS} x ${ROWS} values`);

const columnLists: Float32Array[] = [];
for (let col = 0; col < COLUMNS; col++) {
  const list = new Float32Array(ROWS);
  for (let i = 0; i < ROWS; i++) {
    list[i] = randomNum();
  }
  columnLists.push(list);
}

console.log('Lists created!');

const rowIndexes: Array<number> = [];
for (let i = 0; i < ROWS; i++) {
  rowIndexes.push(i);
}

const LargeDataDemo = () => {
  const [isReady] = useState(true);

  // Column definitions
  const columns = useMemo<Column[]>(() => {
    const cols: Column[] = [];
    
    // Add ID column
    cols.push({
      id: 'id',
      name: 'ID',
      field: 'id',
      sortable: true,
      width: 80,
    });
    
    // Add data columns
    for (let i = 0; i < COLUMNS; i++) {
      cols.push({
        id: `col${i + 1}`,
        name: `Column ${i + 1}`,
        field: `col${i + 1}`,
        sortable: true,
        filterable: true,
        width: 120,
        formatter: (_row, _cell, value, _columnDef, dataContext) => {
          // Access the row index from dataContext
          const rowIndex = dataContext.id;
          if (typeof rowIndex === 'number') {
            return columnLists[i][rowIndex].toString();
          }
          return value;
        },
      });
    }
    
    return cols;
  }, []);

  // Dataset is an array of objects with id field
  // SlickGrid requires each row to have an id property
  const dataset = useMemo(() => {
    console.log('Creating dataset with row objects');
    return rowIndexes.map(index => ({ id: index }));
  }, []);

  const gridOptions: GridOption = {
    darkMode: true,
    enableAutoResize: true,
    enableSorting: true,
    enableFiltering: true,
    autoHeight: false,
    gridHeight: 600,
    enableCellNavigation: true,
    enableColumnReorder: true,
    forceFitColumns: false,
    // Performance optimizations
    enableAsyncPostRender: false,
    enableTextSelectionOnCells: false,
  };

  if (!isReady) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Preparing Large Dataset...</h2>
        <p>Generating {ROWS.toLocaleString()} rows x {COLUMNS} columns...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h2 style={{ marginBottom: '15px' }}>Large Dataset Demo (10M Rows)</h2>
      <p style={{ color: '#888', marginBottom: '10px' }}>
        <strong>{ROWS.toLocaleString()} rows</strong> x <strong>{COLUMNS} columns</strong> | 
        Memory-efficient Float32Array storage
      </p>
      
      <SlickgridReact
        gridId="large-data-grid"
        columns={columns}
        options={gridOptions}
        dataset={dataset}
      />
    </div>
  );
};

export default LargeDataDemo;

