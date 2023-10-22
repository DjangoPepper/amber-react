import {useSelector, useDispatch} from "react-redux";
import {RootState} from "../stores/rootStore";
import DataAction from "../stores/data/DataAction";

import {Data} from "../stores/data/DataReducer";
import {Table} from "react-bootstrap";
import React, { useState } from 'react';
import {affectation} from "../utils/destination"


export default function Statistics() {

	let totalCount = 0;
	let totalWeight = 0;

	let totalCalesCount = 0;
	let totalCalesWeight = 0;

	let totalstockCount = 0;
	let totalstockWeight = 0;
	  
	const dispatch = useDispatch();	
	const [previous_Values_TO, set_previous_Values_TO] = useState<{ [key: string]: { prevTO: string; previous_Tons: string } }>({});
	const [previous_Values_QT, set_previous_Values_QT] = useState<{ [key: string]: { prevQt: string; previous_QT: string } }>({});
	const [maxi_Values, set_maxi_Values] = useState<{ [key: string]: { maxi_To: string } }>({});
	const data = useSelector<RootState, Data[]>((state) => state.data.data);
	const selectedColors = useSelector<RootState, { [key: string]: string }>((state) => state.data.pickerColors);
	
	//fred deprecated
	const [checkbox_Hold_State, set_checkbox_Hold_State] = useState<{ [key: string]: boolean }>({});
	const handleCheckboxChange = (k: string) => {
		// Créez une copie de l'état actuel des cases à cocher
		const updatedCheckboxState = { ...checkbox_Hold_State };
	  
		// Vérifiez si la destination k est déjà dans l'état des cases à cocher
		if (updatedCheckboxState[k] !== undefined) {
		  // Si oui, basculez simplement la valeur (true devient false, false devient true)
		  updatedCheckboxState[k] = !updatedCheckboxState[k];
		} else {
		  // Si la destination n'est pas dans l'état, ajoutez-la et définissez-la comme cochée (true)
		  updatedCheckboxState[k] = true;
		}
	  
		// Mettez à jour l'état des cases à cocher avec la nouvelle valeur
		set_checkbox_Hold_State(updatedCheckboxState);
	  }; 
	//fred deprecated
	

	
	const handlemaxi_ToChange = (k: string, value: string) => {
		set_maxi_Values((maxi_Values: any) => ({
		  ...maxi_Values,
		  [k]: { maxi_To: value },
		}));
		const numericValue = parseFloat(value);
		dispatch(DataAction.changeMaxiTONS({ destination: k, value: numericValue }));
	  };

	const handle_PrevQt_Change = (k: string, value: string) => {
		set_previous_Values_QT((previous_Values_Qt) => ({
		  ...previous_Values_Qt,
		  [k]: { prevQt: value, previous_QT: previous_Values_Qt[k] ? previous_Values_Qt[k].previous_QT : '0' },
		}));
		let numericValue = parseFloat(value) || 0;
		dispatch(DataAction.changePreviousQTT({ destination: k, value: numericValue }));
	  };

	const handle_PrevTo_Change = (k: string, value: string) => {
		set_previous_Values_TO((previous_Values_TO) => ({
		  ...previous_Values_TO,
		  [k]: { prevTO: previous_Values_TO[k] ? previous_Values_TO[k].prevTO : '0', previous_Tons: value },
		}));
		let numericValue = parseFloat(value) || 0;
		dispatch(DataAction.changePreviousTONS({ destination: k, value: numericValue }));
	  };
	
	const totalMaxiCalesWeight = Object.keys(maxi_Values).reduce((total, k) => {
		return total + (maxi_Values[k] ? parseFloat(maxi_Values[k].maxi_To) : 0);
	  }, 0);
	
	const totalPreviousCalesCount = Object.keys(previous_Values_QT).reduce((total, k) => {
		return total + (previous_Values_QT[k] ? parseFloat(previous_Values_QT[k].prevQt) : 0);
	  }, 0);
	
	const totalPreviousCalesWeight = Object.keys(previous_Values_TO).reduce((total, k) => {
	return total + (previous_Values_TO[k]?.previous_Tons ? parseFloat(previous_Values_TO[k].previous_Tons) : 0);
	}, 0);


	const statistics = data.reduce<any>((p, row) => {
		if (!p[row.destination]) {
		p[row.destination] = { count: 0, weight: 0, checkbox: false };
		}
		p[row.destination].count += 1;
		p[row.destination].weight += row.weight;
		// p[row.destination].checkbox = true;
		return p;
	}, {});

  
	Object.values(statistics).forEach((destinationStats: any ) => {    
		totalCount += destinationStats.count;
		totalWeight += destinationStats.weight;
		totalCalesCount = totalCount ;
    	totalCalesWeight = totalWeight;


		if (statistics.stock) {
			totalstockCount = statistics.stock.count;
			totalstockWeight = statistics.stock.weight;	
			totalCalesCount  = totalCount   - totalstockCount;
			totalCalesWeight = totalWeight  - totalstockWeight;
			
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
		<div>
		<Table>
			{/* ... En-tête de table ... */}		
			<thead>
				<tr>
					<th>DesT</th>
					<th>KeeP</th> {/* Nouvelle colonne avec des cases à cocher */}
					<th>TD_Q</th>
					<th>TD_T</th>
					<th>PV_Q</th>
					<th>PV_T</th>
					<th>TT_Q</th>
					<th>TT_T</th>
					<th> PU  </th>
					<th>MAXI </th>
					<th> DIF </th>
					<th>LET_Q</th>
				</tr>
			</thead>
		  	<tbody>
			
			{/* PARTIE HAUTE */}
					
			{/* {keys.map((k) => { */}
			{/* {destination.affectation.map(k) => { */}
			{affectation.map((affectationItem) => {
				const k = affectationItem.name;
				// const statisticsForKCount = statistics[k].count || {};
				const statisticsForK = statistics[k] || {}; // Utilisez un objet vide par défaut
				// const local_updatedCheckboxState=updatedCheckboxState[k];
				// const local_checkbox_Hold_State[k];
				
				if (
					checkbox_Hold_State[k] ||
					(statisticsForK && 
						!isNaN(statisticsForK.count) 
						&& statisticsForK.count > 0)
				  ) {
					console.log("visible : ", affectationItem.name)
					
					return (
						<tr key={k}>
							
							{/* DEST */}
							<td style={{ backgroundColor: selectedColors[k] }}>{k}</td>
							
							{/* CHECKBOX */}
							<td>
							<input
							type="checkbox" 
							checked={checkbox_Hold_State [k]} 
							onChange={() => handleCheckboxChange(k)}
							/>
							</td>

							{/* DAY_Q */}
							<td>{statistics[k].count}</td>
							{/* DAY_T */}
							<td>
							{parseFloat(statistics[k].weight).toLocaleString("en-US", {minimumFractionDigits: 3, maximumFractionDigits: 3,})}
							</td>

								{/* si dest est stock passe 7 colonnes */}
								{k === 'stock' ? ( 
									<>
										<td colSpan={7}></td> 
										<td> </td> 
									</>
									) 
									: 
									
									(
										<> 					
											{/* sinon affiche toute les colonnes */}
											{/* PREV_Q */}
											<td>
											<input
												type="text"
												style={{ width: '45px' }}
												value={previous_Values_QT[k] ? previous_Values_QT[k].prevQt : 0}
												onChange={(e) => handle_PrevQt_Change(k, e.target.value)}
											/>
											</td>
													
											{/* PREV_T */}
											<td>
											<input
												type="text"
												style={{ width: '80px' }}
												value={previous_Values_TO[k] ? previous_Values_TO[k].previous_Tons : 0}
												onChange={(e) => handle_PrevTo_Change(k, e.target.value)}
											/>
											</td>

											{/* TTL_Q */}
											<td>
											{isNaN(statistics[k].count + (previous_Values_QT[k] ? parseFloat(previous_Values_QT[k].prevQt) : 0)) ? 0 : (statistics[k].count + (previous_Values_QT[k] ? parseFloat(previous_Values_QT[k].prevQt) : 0))}
											</td>
													
											{/* TTL_T */}
											<td>
											{isNaN(parseFloat(statistics[k].weight) + (previous_Values_TO[k]?.previous_Tons ? 
													parseFloat(previous_Values_TO[k].previous_Tons) : 0)) ? 0 : 
													(parseFloat(statistics[k].weight) + (previous_Values_TO[k]?.previous_Tons ? 
													parseFloat(previous_Values_TO[k].previous_Tons) : 0))
													.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
											</td>


											{/* PU */}
											<td>
											{(
												(
													parseFloat(statistics[k].weight) +
													(previous_Values_TO[k]?.previous_Tons ? parseFloat(previous_Values_TO[k].previous_Tons) : 0)
												) /
												(statistics[k].count + (previous_Values_QT[k]?.prevQt ? parseFloat(previous_Values_QT[k].prevQt) : 0))
												).toFixed(3)}
											</td>

											{/* MAXI_TO */}
											<td>
												<input
													type="text"
													style={{ width: '80px' }}
													value={maxi_Values[k] ? maxi_Values[k].maxi_To : 0} // Utilisez prevValues[k].prevTo pour la valeur 
													onChange={(e) => handlemaxi_ToChange(k, e.target.value)}
												/>
											</td>

											{/* DIFF_TO */}
											<td className={
													parseFloat(maxi_Values[k]?.maxi_To) - parseFloat(statistics[k].weight) - (previous_Values_TO[k]?.previous_Tons ? parseFloat(previous_Values_TO[k].previous_Tons) : 0) < 0 ? 'red-text' : '' }>
												{isNaN(
													parseFloat(maxi_Values[k]?.maxi_To) - parseFloat(statistics[k].weight) - (previous_Values_TO[k]?.previous_Tons ? parseFloat(previous_Values_TO[k].previous_Tons) : 0)) ? 0 : (
													parseFloat(maxi_Values[k]?.maxi_To) - parseFloat(statistics[k].weight) - (previous_Values_TO[k]?.previous_Tons ? parseFloat(previous_Values_TO[k].previous_Tons) : 0))
													.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })
												}
											</td>

											{/* LET_QT */}
											<td className={Math.floor(
											(
												isNaN(parseFloat(maxi_Values[k]?.maxi_To) - parseFloat(statistics[k].weight) - (previous_Values_TO[k]?.previous_Tons ? parseFloat(previous_Values_TO[k].previous_Tons) : 0)) ?
												0 :
												(
												parseFloat(maxi_Values[k]?.maxi_To) - parseFloat(statistics[k].weight) - (previous_Values_TO[k]?.previous_Tons ? parseFloat(previous_Values_TO[k].previous_Tons) : 0)
												) /
												(
												(
													parseFloat(statistics[k].weight) +
													(previous_Values_TO[k]?.previous_Tons ? parseFloat(previous_Values_TO[k].previous_Tons) : 0)
												) /
												(statistics[k].count + (previous_Values_QT[k]?.prevQt ? parseFloat(previous_Values_QT[k].prevQt) : 0))
												)
											)
											) < 0 ? 'red-text' : ''}>
											{(
												isNaN(parseFloat(maxi_Values[k]?.maxi_To) - parseFloat(statistics[k].weight) - (previous_Values_TO[k]?.previous_Tons ? parseFloat(previous_Values_TO[k].previous_Tons) : 0)) ?
												0 :
												Math.floor(
												(
													parseFloat(maxi_Values[k]?.maxi_To) - parseFloat(statistics[k].weight) - (previous_Values_TO[k]?.previous_Tons ? parseFloat(previous_Values_TO[k].previous_Tons) : 0)
												) /
												(
													(
													parseFloat(statistics[k].weight) +
													(previous_Values_TO[k]?.previous_Tons ? parseFloat(previous_Values_TO[k].previous_Tons) : 0)
													) /
													(statistics[k].count + (previous_Values_QT[k]?.prevQt ? parseFloat(previous_Values_QT[k].prevQt) : 0))
												)
												)
											).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
											</td>



										{/* retour de condition stock */}		
										</>
									)
								} {/* end stock	  */}
						</tr>
					);
				}
				console.log("Invisible : ", affectationItem.name)
				return null;
			})}




	{/* PARTIE BASSE */}

				<tr>
				<td>Totaux</td>
				<td> </td> 
				<td>{totalCalesCount}</td>
				<td>{totalCalesWeight.toLocaleString("en-US")}</td>
				
				<td>{totalPreviousCalesCount}</td>
				<td>{totalPreviousCalesWeight.toLocaleString("en-US")}</td>
				
				<td>{totalCalesCount + totalPreviousCalesCount}</td>
				<td>{(totalCalesWeight + totalPreviousCalesWeight).toLocaleString("en-US")}</td>
				
				{/* PU */}
					<td>{((totalCalesWeight + totalPreviousCalesWeight)/(totalCalesCount + totalPreviousCalesCount)).toLocaleString("en-US")}</td>
				{/* MAXI */}
					<td>{(totalMaxiCalesWeight).toLocaleString("en-US")}</td>
				
				{/* DIFFTO */}
					{/* <td>{(totalMaxiCalesWeight - (totalCalesWeight + totalPreviousCalesWeight)).toLocaleString("en-US")}</td> */}
					<td className={totalMaxiCalesWeight - (totalCalesWeight + totalPreviousCalesWeight) < 0 ? 'red-text' : ''}>
						{(
							totalMaxiCalesWeight - (totalCalesWeight + totalPreviousCalesWeight)
						).toLocaleString("en-US")}
					</td>

				{/* LETQT*/}
					<td className={Math.floor(
							(totalMaxiCalesWeight - (totalCalesWeight + totalPreviousCalesWeight)) /
							((totalCalesWeight + totalPreviousCalesWeight) / (totalCalesCount + totalPreviousCalesCount))
						) < 0 ? 'red-text' : ''}>
						{Math.floor(
							(totalMaxiCalesWeight - (totalCalesWeight + totalPreviousCalesWeight)) /
							((totalCalesWeight + totalPreviousCalesWeight) / (totalCalesCount + totalPreviousCalesCount))
						).toLocaleString("en-US")}
					</td>
				</tr>
			</tbody>
			</Table>
			</div>
		);
		}


