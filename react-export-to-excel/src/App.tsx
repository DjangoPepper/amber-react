import axios from "axios";
import React from "react";
import { ExcelExport } from "./Excel/ExcelExport";
import { ExportCSV } from "./Excel/ExportToCSV";
// import "./styles.css";

const App: React.FC = () => {
  const [data, setData] = React.useState([]);
  const fileName = "dama-test-report"; // here enter filename for your excel file

  // const exportDataToCSV = () => {
  //   ExcelExport(fileName, data);
  // };

  React.useEffect(() => {
    const fetchData = () => {
      axios
        .get("https://jsonplaceholder.typicode.com/posts")
        .then((r) => setData(r.data));
    };
    fetchData();
  }, []);

  return (
    <div>
      <ExportCSV csvData={data} fileName="text-excel-doc" />
      {/* <button onClick={exportDataToCSV}>export to csv</button> */}
    </div>
  );
};

export default App;
