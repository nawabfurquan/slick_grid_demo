import { useContext } from "react";
import { MockDataStoreContext } from "../utils/MockDataStore";

const useMockDataStore = () => {
    const context = useContext(MockDataStoreContext);
    if (context) {
        return context;
    } else {
        throw new Error("No context found");
    }
}; 

export default useMockDataStore;