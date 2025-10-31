import type { ColumnData } from "./MockDataStore";

class SGAdapter {
    private numRows: number;
    private colData: ColumnData[];
    private indices: Uint32Array;
    constructor (colData: ColumnData[], indices: Uint32Array) {
      this.colData = colData;
      this.numRows = indices.length;
      this.indices = indices;
    }
  
    getLength(): number {
      return this.numRows;
    }
  
    getItem(index: number): any {
      if (index < 0 || index >= this.numRows) {
        return null;
      }

      /// this is where you lookup the index from the sorted indices
      const i = this.indices[index]
      const item: any = {};
      
      for (const col of this.colData) {
        item[col.name] = col.data[i];
      }
      
      return item;
    }
  
    getItemMetadata(_index: number): any {
      return null;
    }

    sort() {

    }

    reSort() {
      
    }
}

export default SGAdapter;