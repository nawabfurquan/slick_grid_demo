import './App.css';
import useMockDataStore from './hooks/useMockDataStore';
import SlickGridDemo from './components/SlickGridDemo';
import AgGridDemo from './components/AgGridDemo';
import AgGridInfiniteDemo from './components/AgGridInfiniteDemo';

const App: React.FC = () => {
  const { columnCount, rowCount, setRowCount, setColumnCount } = useMockDataStore();

  return (
    <>
      <div>
        <label>
          Rows:
          <input
            type="number" 
            value={rowCount} 
            onChange={(e) => setRowCount(Number(e.target.value))}
            style={{ marginLeft: '10px', marginRight: '20px', padding: "5px" }}
          />
        </label>
        <label>
          Columns:
          <input
            type="number" 
            value={columnCount} 
            onChange={(e) => setColumnCount(Number(e.target.value))}
            style={{ marginLeft: '10px', marginRight: '20px', padding: "5px" }}
          />
        </label>
      </div>
      <div style={{ borderBottom: "1px solid white", marginTop: "20px" }}></div>
      <div style={{ display: 'flex', flexDirection: "column", gap: '100px', padding: '20px' }}>
        <div style={{ flex: 1 }}>
          <SlickGridDemo />
        </div>
        <div style={{ flex: 1 }}>
          <AgGridInfiniteDemo />
        </div>
      </div>
      {/* <div style={{ width: "100%", height: "100%", marginTop: "20px" }}> */}
        {/* <SlickGridDemo /> */}
        {/* <AgGridDemo /> */}
      {/* </div> */}
      </>
  );
}

export default App;