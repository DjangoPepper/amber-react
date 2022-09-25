import {useSelector} from "react-redux";
import {RootState} from "../stores/rootStore";
import {Data} from "../stores/data/DataReducer";
import {Table} from "react-bootstrap";

export default function Statistics() {
    const data = useSelector<RootState, Data[]>(state => state.data.data);
    const statistics = data.reduce<any>((p, row) => {
        if(!p[row.destination]) {
            p[row.destination] = {count: 0, weight: 0};

        }
        p[row.destination] = {count: p[row.destination].count + 1, weight: p[row.destination].weight + row.weight}
        return p;
    }, {})
    const keys = Object.keys(statistics).sort();
    return (
        <Table>
            <thead>
                <th>Cale</th>
                <th>Nombre</th>
                <th>Poids</th>
            </thead>
            <tbody>
            {keys.map(k => <tr key={k}>
                <td>{k}</td>
                <td>{statistics[k].count}</td>
                <td>{statistics[k].weight}</td>
            </tr>)}
            </tbody>
        </Table>
    );
}
