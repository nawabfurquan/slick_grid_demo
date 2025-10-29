import { useEffect, useState } from 'react';
import { SlickgridReact } from 'slickgrid-react';
import type { Column, GridOption } from 'slickgrid-react';

interface CellData {
  id: number;
  suspension_type: string;
  donor_id: string;
  is_primary_data: string;
  assay_ontology_term_id: string;
  cell_type_ontology_term_id: string;
  development_stage_ontology_term_id: string;
  disease_ontology_term_id: string;
  self_reported_ethnicity_ontology_term_id: string;
  tissue_ontology_term_id: string;
}

const CellDataDemo = () => {
  const [dataset, setDataset] = useState<CellData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const columns: Column[] = [
    { id: 'id', name: 'ID', field: 'id', sortable: true, width: 80, filterable: true },
    { id: 'suspension_type', name: 'Suspension Type', field: 'suspension_type', sortable: true, width: 120, filterable: true },
    { id: 'donor_id', name: 'Donor ID', field: 'donor_id', sortable: true, width: 200, filterable: true },
    { id: 'is_primary_data', name: 'Is Primary Data', field: 'is_primary_data', sortable: true, width: 130, filterable: true },
    { id: 'assay_ontology_term_id', name: 'Assay Ontology', field: 'assay_ontology_term_id', sortable: true, width: 150, filterable: true },
    { id: 'cell_type_ontology_term_id', name: 'Cell Type Ontology', field: 'cell_type_ontology_term_id', sortable: true, width: 180, filterable: true },
    { id: 'development_stage_ontology_term_id', name: 'Development Stage', field: 'development_stage_ontology_term_id', sortable: true, width: 180, filterable: true },
    { id: 'disease_ontology_term_id', name: 'Disease Ontology', field: 'disease_ontology_term_id', sortable: true, width: 150, filterable: true },
    { id: 'self_reported_ethnicity_ontology_term_id', name: 'Ethnicity Ontology', field: 'self_reported_ethnicity_ontology_term_id', sortable: true, width: 180, filterable: true },
    { id: 'tissue_ontology_term_id', name: 'Tissue Ontology', field: 'tissue_ontology_term_id', sortable: true, width: 150, filterable: true },
  ];

  const loadData = async () => {
    try {
      console.time('Data Loading');
      
      const MAX_ROWS = 100000; // Load only first 100K rows to prevent browser crash
      
      // Stream the file and parse incrementally
      const response = await fetch('/src/cells.txt');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) throw new Error('No reader available');
      
      let buffer = '';
      let data: CellData[] = [];
      let headersParsed = false;
      let rowCount = 0;
      
      while (rowCount < MAX_ROWS) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep last incomplete line in buffer
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          if (!headersParsed) {
            headersParsed = true;
            continue; // Skip header row
          }
          
          if (rowCount >= MAX_ROWS) break;
          
          const values = line.split('\t');
          
          // Parse first 10 columns (skip index at position 0, use columns 1-10)
          if (values.length >= 10) {
            data.push({
              id: rowCount + 1, // Use row number as ID
              suspension_type: values[1],
              donor_id: values[2],
              is_primary_data: values[3],
              assay_ontology_term_id: values[4],
              cell_type_ontology_term_id: values[5],
              development_stage_ontology_term_id: values[6],
              disease_ontology_term_id: values[7],
              self_reported_ethnicity_ontology_term_id: values[8],
              tissue_ontology_term_id: values[9],
            });
            rowCount++;
          }
        }
      }
      
      reader.cancel(); // Stop reading after MAX_ROWS
      
      console.timeEnd('Data Loading');
      console.log(`Loaded ${data.length.toLocaleString()} cells`);
      
      setDataset(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const gridOptions: GridOption = {
    darkMode: true,
    enableAutoResize: true,
    enableSorting: true,
    enableFiltering: true,
    autoHeight: false,
    gridHeight: 600,
    gridWidth: '100%',
    enableCellNavigation: true,
    enableColumnReorder: true,
    forceFitColumns: true,
  };

  // if (isLoading) {
  //   return (
  //     <div style={{ padding: '40px', textAlign: 'center' }}>
  //       <h2>Loading Data...</h2>
  //       <p>Please wait...</p>
  //     </div>
  //   );
  // }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h2 style={{ marginBottom: '15px' }}>Slick Grid Table Demo</h2>
      
      <SlickgridReact
        gridId="cell-data-grid"
        columns={columns}
        options={gridOptions}
        dataset={dataset}
      />
    </div>
  );
};

export default CellDataDemo;