import React, { useRef, useState } from 'react';
import {
  Aggregators,
  type Column,
  type GridOption,
  type Grouping,
  GroupTotalFormatters,
  SortDirectionNumber,
  SortComparers,
  SlickgridReact,
  type SlickgridReactInstance,
} from 'slickgrid-react';

interface CellData {
  id: number;
  cell_id: string;
  donor_id: string;
  tissue: string;
  cell_type: string;
  n_genes: number;
  total_counts: number;
  pct_counts_mt: number;
  disease: string;
  age: number;
}

const GroupingDemo: React.FC = () => {
  const [dataset] = useState<CellData[]>(generateSampleData(1000));
  const reactGridRef = useRef<SlickgridReactInstance | null>(null);

  const columnDefinitions: Column[] = [
    {
      id: 'id',
      name: 'ID',
      field: 'id',
      width: 80,
      sortable: true,
    },
    {
      id: 'cell_id',
      name: 'Cell ID',
      field: 'cell_id',
      width: 150,
      sortable: true,
    },
    {
      id: 'donor_id',
      name: 'Donor ID',
      field: 'donor_id',
      width: 200,
      sortable: true,
    },
    {
      id: 'tissue',
      name: 'Tissue',
      field: 'tissue',
      width: 120,
      sortable: true,
    },
    {
      id: 'cell_type',
      name: 'Cell Type',
      field: 'cell_type',
      width: 150,
      sortable: true,
    },
    {
      id: 'n_genes',
      name: 'N Genes',
      field: 'n_genes',
      width: 100,
      sortable: true,
      type: 'number',
      groupTotalsFormatter: GroupTotalFormatters.sumTotals,
      params: { groupFormatterPrefix: 'Total: ' },
    },
    {
      id: 'total_counts',
      name: 'Total Counts',
      field: 'total_counts',
      width: 120,
      sortable: true,
      type: 'number',
      groupTotalsFormatter: GroupTotalFormatters.avgTotals,
      params: { groupFormatterPrefix: 'Avg: ' },
    },
    {
      id: 'pct_counts_mt',
      name: '% Counts MT',
      field: 'pct_counts_mt',
      width: 120,
      sortable: true,
      type: 'number',
      formatter: (_row, _cell, value) => value?.toFixed(2),
      groupTotalsFormatter: GroupTotalFormatters.avgTotalsPercentage,
      params: { groupFormatterPrefix: 'Avg: ' },
    },
    {
      id: 'disease',
      name: 'Disease',
      field: 'disease',
      width: 120,
      sortable: true,
    },
    {
      id: 'age',
      name: 'Age',
      field: 'age',
      width: 80,
      sortable: true,
      type: 'number',
      groupTotalsFormatter: GroupTotalFormatters.avgTotals,
      params: { groupFormatterPrefix: 'Avg: ' },
    },
  ];

  const gridOptions: GridOption = {
    autoResize: {
      container: '#grouping-demo-container',
      rightPadding: 10,
    },
    enableGrouping: true,
    darkMode: true,
    enableAutoResize: true,
    gridHeight: 600,
    enableCellNavigation: true,
  };

  function reactGridReady(reactGrid: SlickgridReactInstance) {
    reactGridRef.current = reactGrid;
    // Auto-group by cell type on load
    groupByCellType();
  }

  function groupByCellType() {
    reactGridRef.current?.filterService?.setSortColumnIcons([{ columnId: 'cell_type', sortAsc: true }]);
    reactGridRef.current?.dataView?.setGrouping({
      getter: 'cell_type',
      formatter: (g) => `Cell Type: ${g.value} <span style="color:green">(${g.count} cells)</span>`,
      comparer: (a, b) => SortComparers.string(a.value, b.value, SortDirectionNumber.asc),
      aggregators: [
        new Aggregators.Avg('n_genes'),
        new Aggregators.Avg('total_counts'),
        new Aggregators.Sum('n_genes')
      ],
      aggregateCollapsed: false,
      lazyTotalsCalculation: true,
    } as Grouping);
    reactGridRef.current?.slickGrid?.invalidate();
  }

  function generateSampleData(count: number): CellData[] {
    const donors = ['Donor_A', 'Donor_B', 'Donor_C', 'Donor_D', 'Donor_E'];
    const tissues = ['Lung', 'Heart', 'Liver', 'Kidney', 'Brain'];
    const cellTypes = ['T-cell', 'B-cell', 'Macrophage', 'Epithelial', 'Fibroblast'];
    const diseases = ['Healthy', 'COVID-19', 'Fibrosis', 'Cancer'];
    
    const data: CellData[] = [];
    
    for (let i = 0; i < count; i++) {
      data.push({
        id: i+1,
        cell_id: `AAACATAC${i.toString().padStart(8, '0')}-1`,
        donor_id: donors[Math.floor(Math.random() * donors.length)],
        tissue: tissues[Math.floor(Math.random() * tissues.length)],
        cell_type: cellTypes[Math.floor(Math.random() * cellTypes.length)],
        n_genes: Math.floor(Math.random() * 3000) + 500,
        total_counts: Math.floor(Math.random() * 10000) + 1000,
        pct_counts_mt: Math.random() * 5,
        disease: diseases[Math.floor(Math.random() * diseases.length)],
        age: Math.floor(Math.random() * 50) + 20,
      });
    }
    
    return data;
  }

  return (
    <div id="grouping-demo-container" style={{ width: '100%', height: '100%' }}>
      <h2 style={{ marginBottom: '15px' }}>Grouping Demo</h2>

      <SlickgridReact
        gridId="grouping-grid"
        columns={columnDefinitions}
        options={gridOptions}
        dataset={dataset}
        onReactGridCreated={(e) => reactGridReady(e.detail)}
      />
    </div>
  );
};

export default GroupingDemo;

