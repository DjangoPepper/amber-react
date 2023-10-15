import {useSelector, useDispatch} from "react-redux";
import {RootState} from "../stores/rootStore";
import {Data} from "../stores/data/DataReducer";
import {Table} from "react-bootstrap";
import {colors} from "../utils/destination";
import React, { useState } from 'react';
//FRed
import DataAction from "../stores/data/DataAction";
//FRed

export default function Statistics() {
	//fred
	const dispatch = useDispatch();
	const handlePrevQtChange = (k: string, value: string) => {
    // Convertissez la valeur en nombre (type number)
    const numericValue = +value; // ou parseFloat(value)

    // Envoyez la valeur dans Redux en utilisant votre action
    dispatch(DataAction.changePreviousQTT({ destination: k, value: numericValue }));
};
	  
	  const handlePrevToChange = (k: string, value: string) => {
		// const numericValue = parseFloat(value);
		const numericValue = +value
		dispatch(DataAction.changePreviousTONS({ destination: k, value: numericValue }));
	  };
	  
	  
	//fred
	const data = useSelector<RootState, Data[]>((state) => state.data.data);
	const selectedColors = useSelector<RootState, { [key: string]: string }>((state) => state.data.pickerColors);
	
	let totalCount = 0;
	let totalWeight = 0;

	let totalCalesCount = 0;
	let totalCalesWeight = 0;

	let totalstockCount = 0;
	let totalstockWeight = 0;

	//FRED
	// let prevQt = 0;
	// let prevTo = 0;
	const [prevQt, setPrevQt] = useState<number>(0);
  	const [prevTo, setPrevTo] = useState<number>(0);
	//FRED
  
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
			  <th>ACTU_QT</th>
			  <th>ACTU_TO</th>
			  <th>PREV_QT</th>
			  <th>PREV_TO</th>
			</tr>
		  </thead>
		  <tbody>
			{keys.map((k) => (
			  <tr key={k}>
				{/* <td style={{ backgroundColor: colors[k] }}>{k}</td> */}
				<td style={{ backgroundColor: selectedColors[k] }}>{k}</td>
				<td>{statistics[k].count}</td>
				<td>{statistics[k].weight.toLocaleString("en-US")}</td>
				{/* //fred */}
				<td>
					<input
						type="text"
						style={{ width: '60px' }}
						value={prevQt} // Utilisez la valeur du state local pour le champ d'entrée
						onChange={(e) => handlePrevQtChange(k, e.target.value)} // Gérez les changements dans une fonction handlePrevQtChange
					/>
				</td>
				<td>
					<input
						type="text"
						style={{ width: '60px' }}
						value={prevTo} // Utilisez la valeur du state local pour le champ d'entrée
						onChange={(e) => handlePrevToChange(k, e.target.value)} // Gérez les changements dans une fonction handlePrevToChange
					/>
				</td>
				{/* //fred */}
			  </tr>
			))}



{/* PARTIE BASSE */}

			<tr>
			  <td>Total Cales</td>
			  <td>{totalCalesCount}</td>
			  <td>{totalCalesWeight.toLocaleString("en-US")}</td>
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
