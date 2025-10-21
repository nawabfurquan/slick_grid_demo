import { SlickgridReact } from 'slickgrid-react';
import type { Column, GridOption } from 'slickgrid-react';

interface Person {
  id: number;
  name: string;
  age: number;
  email: string;
  city: string;
}

const DataGrid = () => {
  const columns: Column[] = [
    { id: 'id', name: 'ID', field: 'id', sortable: true, width: 60 },
    { id: 'name', name: 'Name', field: 'name', sortable: true, width: 150 },
    { id: 'age', name: 'Age', field: 'age', sortable: true, width: 80 },
    { id: 'email', name: 'Email', field: 'email', sortable: true, width: 200 },
    { id: 'city', name: 'City', field: 'city', sortable: true, width: 150 },
  ];

  const dataset: Person[] = [
    { id: 1, name: 'John Doe', age: 28, email: 'john@example.com', city: 'New York' },
    { id: 2, name: 'Jane Smith', age: 34, email: 'jane@example.com', city: 'Los Angeles' },
    { id: 3, name: 'Bob Johnson', age: 45, email: 'bob@example.com', city: 'Chicago' },
    { id: 4, name: 'Alice Williams', age: 23, email: 'alice@example.com', city: 'Houston' },
    { id: 5, name: 'Charlie Brown', age: 31, email: 'charlie@example.com', city: 'Phoenix' },
    { id: 6, name: 'Diana Davis', age: 29, email: 'diana@example.com', city: 'Philadelphia' },
    { id: 7, name: 'Edward Miller', age: 38, email: 'edward@example.com', city: 'San Antonio' },
    { id: 8, name: 'Fiona Wilson', age: 27, email: 'fiona@example.com', city: 'San Diego' },
    { id: 9, name: 'George Moore', age: 42, email: 'george@example.com', city: 'Dallas' },
    { id: 10, name: 'Helen Taylor', age: 36, email: 'helen@example.com', city: 'San Jose' },
  ];

  const gridOptions: GridOption = {
    enableAutoResize: true,
    enableSorting: true,
    autoHeight: false,
    gridHeight: 400,
    gridWidth: '100%',
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '20px auto' }}>
      <h2 style={{ marginBottom: '20px' }}>SlickGrid Demo Table</h2>
      <SlickgridReact
        gridId="demo-grid"
        columns={columns}
        options={gridOptions}
        dataset={dataset}
      />
    </div>
  );
};

export default DataGrid;

