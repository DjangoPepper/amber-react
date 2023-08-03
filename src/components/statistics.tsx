import {useSelector} from "react-redux";
import {RootState} from "../stores/rootStore";
import {Data} from "../stores/data/DataReducer";
import {Table} from "react-bootstrap";
import {colors} from "../utils/destination";

// export default function Statistics() {
//     let totalCaleCount = 0;
//     let totalCaleWeight = 0;

//     const data = useSelector<RootState, Data[]>(state => state.data.data);
    
//     const statistics = data.reduce<any>((p, row) => {
//         if(!p[row.destination]) {
//             p[row.destination] = {count: 0, weight: 0};
//         }
//         // p[row.destination] = {count: p[row.destination].count + 1, weight: Math.round(p[row.destination].weight) + row.weight}
//         p[row.destination] = {
//             count: p[row.destination].count + 1, 
//             weight: (p[row.destination].weight + row.weight)}
//         return p;
//     }, {})

//     // Calcul du cumul total
//     Object.values(statistics).forEach((destinationStats) => {
//         totalCaleCount += destinationStats.count;
//         totalCaleWeight += destinationStats.weight;
//     });

//     const keys = Object.keys(statistics).sort();
    
// ...imports et autres codes

export default function Statistics() {
    const data = useSelector<RootState, Data[]>((state) => state.data.data);
    let totalCount = 0;
    let totalWeight = 0;

    let totalCalesCount = 0;
    let totalCalesWeight = 0;

    let totalStockCount = 0;
    let totalStockWeight = 0;
  
    const statistics = data.reduce<any>((p, row) => {
        if (!p[row.destination]) {
        p[row.destination] = { count: 0, weight: 0 };
        }
        p[row.destination].count += 1;
        p[row.destination].weight += row.weight;
        return p;
    }, {});
  
    // Calcul du cumul total
    Object.values(statistics).forEach((destinationStats: any ) => {
        
        totalCount += destinationStats.count;
        totalWeight += destinationStats.weight;
    
        totalStockCount  =  statistics.STK.count;
        totalStockWeight =  statistics.STK.weight;
    
        totalCalesCount = totalCount - totalStockCount;
        totalCalesWeight = totalWeight - totalStockWeight;
   
  });
    const keys = Object.keys(statistics).sort();
        
    return (
        <Table>
          <thead>
            <tr>
              <th>DesT</th>
              <th>QuanT</th>
              <th>TonS</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k}>
                <td style={{ color: colors[k] }}>{k}</td>
                <td>{statistics[k].count}</td>
                <td>{statistics[k].weight.toLocaleString("en-US")}</td>
              </tr>
            ))}

            <tr>
              <td>Total Cales</td>
              <td>{totalCalesCount}</td>
              <td>{totalCalesWeight.toLocaleString("en-US")}</td>
            </tr>

            <tr>
              <td>Total Stock</td>
              <td>{totalStockCount}</td>
              <td>{totalStockWeight.toLocaleString("en-US")}</td>
            </tr>

            <tr>
              <td>Total Général</td>
              <td>{totalCount}</td>
              <td>{totalWeight.toLocaleString("en-US")}</td>
            </tr>

          </tbody>
        </Table>
      );
    }
