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

	// Créez un état pour stocker les valeurs prevQt et prevTo pour chaque destination
	// const [prevValues, setPrevValues] = useState<{ [key: string]: { prevQt: number; prevTo: number } }>({});
	const [prevValues, setPrevValues] = useState<{ [key: string]: { prevQt: string; prevTo: string } }>({});


  	const [prevQt, setPrevQt] = useState<number>(0);
  	const [prevTo, setPrevTo] = useState<number>(0);
	const handlePrevQtChange = (k: string, value: string) => {
	setPrevValues((prevValues) => ({
		...prevValues,
		[k]: { prevQt: value, prevTo: prevValues[k] ? prevValues[k].prevTo : '0' }, // Stockez la valeur en tant que chaîne
	}));
	const numericValue = parseFloat(value); // Convertissez la chaîne en nombre
	dispatch(DataAction.changePreviousQTT({ destination: k, value: numericValue }));
	};
	
	const handlePrevToChange = (k: string, value: string) => {
		setPrevValues((prevValues) => ({
		  ...prevValues,
		  [k]: { prevQt: prevValues[k] ? prevValues[k].prevQt : '0', prevTo: value }, // Stockez la valeur en tant que chaîne
		}));
		const numericValue = parseFloat(value); // Convertissez la chaîne en nombre
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
			  <th>TTL_QT</th>
	          <th>TTL_TO</th>
			</tr>
		  </thead>
		  <tbody>
		  {keys.map((k) => (
			<tr key={k}>
				<td style={{ backgroundColor: selectedColors[k] }}>{k}</td>
				<td>{statistics[k].count}</td>
				<td>
				{parseFloat(statistics[k].weight).toLocaleString("en-US", {
					minimumFractionDigits: 3,
					maximumFractionDigits: 3,
				})}
				</td>
				{k === 'stock' ? (
				<>
					<td colSpan={2}></td> {/* Colspan pour fusionner les deux colonnes */}
				</>
				) : (
				<>
					<td>
					<input
						type="text"
						style={{ width: '45px' }}
						value={prevValues[k] ? prevValues[k].prevQt : 0}
						onChange={(e) => handlePrevQtChange(k, e.target.value)}
					/>
					</td>
					<td>
					<input
						type="text"
						style={{ width: '80px' }}
						value={prevValues[k] ? prevValues[k].prevTo : 0}
						onChange={(e) => handlePrevToChange(k, e.target.value)}
					/>
					</td>
				</>
				)}
				<td>
				{statistics[k].count + (prevValues[k] ? parseFloat(prevValues[k].prevQt) : 0)}
				</td>
				<td>
				{(
					parseFloat(statistics[k].weight) +
					(prevValues[k] ? parseFloat(prevValues[k].prevTo) : 0)
				).toLocaleString("en-US", {
					minimumFractionDigits: 3,
					maximumFractionDigits: 3,
				})}
				</td>
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
