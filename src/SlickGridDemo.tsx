import { useCallback, useMemo, useRef, useState } from 'react';
import { SlickgridReact } from 'slickgrid-react';
import type { Column, GridOption, SlickgridReactInstance } from 'slickgrid-react';

const ROWS = 10000000;
const COLUMNS = 50;

const createColumns = (): Column[] => {
  const cols: Column[] = [];
  cols.push({
    id: 'id',
    name: 'ID',
    field: 'id',
    sortable: true,
    minWidth: 100,
  });

  for (let i=0; i < COLUMNS; i++) {
    cols.push({
      id: `col${i + 1}`,
      name: `Column ${i + 1}`,
      field: `col${i + 1}`,
      sortable: true,
      filterable: true,
      minWidth: 150,
    })
  }

  return cols;
};

class DataProvider {
  private dataStore: Float32Array[];
  private numRows: number;
  private numCols: number;
  constructor (rows: number, cols: number) {
    this.numCols = cols;
    this.numRows = rows;
    this.dataStore = [];
    this.initializeData();
  }

  private initializeData() {
    console.time('Data Generation');
    for (let i = 0; i < this.numRows; i++) {
      this.dataStore[i] = new Float32Array(this.numCols);
      for (let j=0; j<this.numCols; j++) {
        this.dataStore[i][j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    console.timeEnd('Data Generation');
  }

  getLength(): number {
    return this.numRows;
  }

  getItem(index: number): any {
    if (index < 0 || index >= this.numRows) {
      return null;
    }

    const item: any = { id: index + 1 };
    
    for (let col = 0; col < this.numCols; col++) {
      item[`col${col + 1}`] = this.dataStore[index][col];
    }
    
    return item;
  }

  getItemMetadata(_index: number): any {
    return null;
  }
}

// 1D array approach
// class DataProvider {
//   private dataStore: Float32Array;
//   private numRows: number;
//   private numCols: number;
//   constructor (rows: number, cols: number) {
//     this.numCols = cols;
//     this.numRows = rows;
//     this.dataStore = new Float32Array(rows * cols);
//     this.initializeData();
//   }

//   private initializeData() {
//     console.time('Data Generation');
//     for (let i = 0; i < this.dataStore.length; i++) {
//       this.dataStore[i] = Math.floor((Math.random() * 100) + 1);
//     }
//     console.timeEnd('Data Generation');
//   }

//   getLength(): number {
//     return this.numRows;
//   }

//   getItem(index: number): any {
//     if (index < 0 || index >= this.numRows) {
//       return null;
//     }

//     const item: any = { id: index + 1 };
//     const offset = index * this.numCols;
    
//     for (let col = 0; col < this.numCols; col++) {
//       item[`col${col + 1}`] = this.dataStore[offset + col];
//     }
    
//     return item;
//   }

//   getItemMetadata(_index: number): any {
//     return null;
//   }
// }


const SlickGridDemo = () => {
  const [options] = useState<GridOption>(() => ({
    darkMode: true,
    enableAutoResize: false,
    gridHeight: 600, 
    gridWidth: "100%",
    enableSorting: true,
    multiColumnSort: false,
    enableCellNavigation: true,
    enableColumnReorder: false,
    asyncEditorLoading: false,
    enableAsyncPostRender: false,
    forceFitColumns: false,
    enableCellRowSpan: true,
    rowHeight: 30,
    rowTopOffsetRenderType: 'top',
    frozenColumn: 0,
  }));
  const columns = useMemo(() => createColumns(), []);
  const reactGridRef = useRef<SlickgridReactInstance | null>(null);
  
  const dataProvider = useMemo(() => {
    console.log('Creating virtual data provider...');
    return new DataProvider(ROWS, COLUMNS);
  }, []);

  const handleGridCreated = useCallback((e: CustomEvent<SlickgridReactInstance>) => {
    reactGridRef.current = e.detail;
    
    const grid = e.detail.slickGrid;
    if (grid) {
      grid.setData(dataProvider, true);
      grid.render();
      console.log(`Grid initialized with ${ROWS.toLocaleString()} virtual rows`);
    }
  }, [dataProvider]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h2 style={{ marginBottom: '15px' }}>Slick Grid Demo</h2>
      
      <SlickgridReact
        gridId="slick-grid-demo"
        columns={columns}
        options={options}
        dataset={[]}
        onReactGridCreated={handleGridCreated}
      />
    </div>
  );
};

export default SlickGridDemo;

