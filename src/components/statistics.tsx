import {useSelector} from "react-redux";
import {RootState} from "../stores/rootStore";
import {Data} from "../stores/data/DataReducer";
import {Table} from "react-bootstrap";
import {colors} from "../utils/destination";
import React from 'react';


export default function Statistics() {
	const data = useSelector<RootState, Data[]>((state) => state.data.data);
	const selectedColors = useSelector<RootState, { [key: string]: string }>((state) => state.data.pickerColors);
	
	let totalCount = 0;
	let totalWeight = 0;

	let totalCalesCount = 0;
	let totalCalesWeight = 0;

	let totalstockCount = 0;
	let totalstockWeight = 0;
  
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

		if (statistics.stock) {
			totalstockCount = statistics.stock.count;
			totalstockWeight = statistics.stock.weight;	
			totalCalesCount  = totalCount - totalstockCount;
			totalCalesWeight = totalWeight - totalstockWeight;
		}
		else {
			totalstockCount = 0;
			totalstockWeight = 0;	
			totalCalesCount  = totalCount;
			totalCalesWeight = totalWeight;
		}
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
				{/* <td style={{ backgroundColor: colors[k] }}>{k}</td> */}
				<td style={{ backgroundColor: selectedColors[k] }}>{k}</td>
				<td>{statistics[k].count}</td>
				<td>{statistics[k].weight.toLocaleString("en-US")}</td>
			  </tr>
			))}

			<tr>
			  <td>Total Cales</td>
			  <td>{totalCalesCount}</td>
			  <td>{totalCalesWeight.toLocaleString("en-US")}</td>
			</tr>

			{/* <tr>
			  <td>Total stock</td>
			  <td>{totalstockCount}</td>
			  <td>{totalstockWeight.toLocaleString("en-US")}</td>
			</tr> */}

			<tr>
			  <td>Total Général</td>
			  <td>{totalCount}</td>
			  <td>{totalWeight.toLocaleString("en-US")}</td>
			</tr>

		  </tbody>
		</Table>
	  );
	}
