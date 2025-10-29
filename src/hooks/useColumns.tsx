import { useContext } from "react";
import { MockDataStoreContext } from "../utils/MockDataStore";

const useColumns = () => {
    const context = useContext(MockDataStoreContext);
    if (context) {
        return context.columnData;
    } else {
        throw new Error("No context found");
    }
};

export default useColumns;