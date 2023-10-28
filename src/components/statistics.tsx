import { useSelector, useDispatch} from "react-redux";
import { RootState } from "../stores/rootStore";
import DataAction from "../stores/data/DataAction";
import { Data } from "../stores/data/DataReducer";
import { Table } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import { affectation} from "../utils/destination"
import { updateAffectationVisibility } from '../stores/data/destinationActions';


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
		p[row.destination] = { count: 0, weight: 0  };
		}
		p[row.destination].count += 1;
		p[row.destination].weight += parseFloat((row.weight).toFixed(3));
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
			totalstockWeight = parseFloat(totalstockWeight.toFixed(3))
			totalCalesCount  = totalCount   - totalstockCount;
			totalCalesWeight = totalWeight  - totalstockWeight;
			totalCalesWeight = parseFloat(totalCalesWeight.toFixed(3));
			
		}
		else {
			totalstockCount = 0;
			totalstockWeight = 0;	
			totalCalesCount  = totalCount;
			totalCalesWeight = totalWeight;
		}
	});

	// Cette fonction sera exécutée au démarrage du composant
	useEffect(() => {
		// Parcourez le tableau affectation et envoyez chaque état "visibleState" dans Redux
		affectation.forEach((item) => {
		// Utilisez votre action ou fonction pour mettre à jour l'état dans Redux
		dispatch(updateAffectationVisibility(item.name, item.visibleState));
		});
	}, [dispatch]); // Assurez-vous de lister dispatch comme dépendance pour éviter les avertissements

	// const keys = Object.keys(statistics).sort();
	
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
			{affectation.map((affectationItem) => {

				const statistics_array = statistics[affectationItem.name] || {}; // Utilisez un objet vide par défaut
				// let chsafin = checkbox_Hold_State[affectationItem.name] || {};
				let chsafin = checkbox_Hold_State[affectationItem.name] || false;
				
				if (
					chsafin || 
					(
						statistics_array && 
						!isNaN(statistics_array.count) && 
						statistics_array.count > 0
					)
				) {
					console.log("visible : ", affectationItem.name)
					
					return (
						<tr key={affectationItem.name}>
							
							{/* DEST */}
							<td style={{ backgroundColor: selectedColors[affectationItem.name] }}>{affectationItem.name}</td>
							
							{/* CHECKBOX */}
							<td>
							<input
							type="checkbox" 
							checked={checkbox_Hold_State[affectationItem.name]} 
							// checked={affectationItem.visibleState[k]} 
							onChange={() => handleCheckboxChange(affectationItem.name)}
							/>
							</td>

							{/* DAY_Q */}
							{/* <td>{ statistics[affectationItem.name].count}</td> */}
							<td>{statistics[affectationItem.name] ? statistics[affectationItem.name].count : 0}</td>

							{/* DAY_T */}
							<td>
							{/* {parseFloat(statistics[affectationItem.name].weight).toLocaleString("en-US", {minimumFractionDigits: 3, maximumFractionDigits: 3,})} */}
							{statistics[affectationItem.name] ? parseFloat(statistics[affectationItem.name].weight).toLocaleString("en-US", {minimumFractionDigits: 3, maximumFractionDigits: 3,}) : "0.000"}

							</td>

								{/* si dest est stock passe 7 colonnes */}
								{affectationItem.name === 'stock' ? ( 
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
												value={previous_Values_QT[affectationItem.name] ? previous_Values_QT[affectationItem.name].prevQt : 0}
												onChange={(e) => handle_PrevQt_Change(affectationItem.name, e.target.value)}
											/>
											</td>
													
											{/* PREV_T */}
											<td>
											<input
												type="text"
												style={{ width: '80px' }}
												value={previous_Values_TO[affectationItem.name] ? previous_Values_TO[affectationItem.name].previous_Tons : 0}
												onChange={(e) => handle_PrevTo_Change(affectationItem.name, e.target.value)}
											/>
											</td>

											{/* TTL_Q */}
											<td>
											{/* {isNaN(statistics[affectationItem.name].count + (previous_Values_QT[affectationItem.name] ? parseFloat(previous_Values_QT[affectationItem.name].prevQt) : 0)) ? 0 : (statistics[affectationItem.name].count + (previous_Values_QT[affectationItem.name] ? parseFloat(previous_Values_QT[affectationItem.name].prevQt) : 0))} */}
											{/* {statistics[affectationItem.name] ? (isNaN(statistics[affectationItem.name].count + (previous_Values_QT[affectationItem.name] ? parseFloat(previous_Values_QT[affectationItem.name].prevQt) : 0)) ? 0 : (statistics[affectationItem.name].count + (previous_Values_QT[affectationItem.name] ? parseFloat(previous_Values_QT[affectationItem.name].prevQt) : 0))): 0} */}
											{/* {statistics[affectationItem.name] ? (												isNaN(statistics[affectationItem.name].count) || isNaN(parseFloat(previous_Values_QT[affectationItem.name]?.prevQt))													? 0													: statistics[affectationItem.name].count + parseFloat(previous_Values_QT[affectationItem.name].prevQt)) : 0} */}
											{statistics[affectationItem.name]?.count ?? 0 
											+ 
											(previous_Values_QT[affectationItem.name]?.prevQt ? parseFloat(previous_Values_QT[affectationItem.name].prevQt) : 0)}


											</td>
													
											{/* TTL_T */}
											{/* <td>
											{isNaN(parseFloat(statistics[affectationItem.name].weight) + (previous_Values_TO[affectationItem.name]?.previous_Tons ? 
													parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0)) ? 0 : 
													(parseFloat(statistics[affectationItem.name].weight) + (previous_Values_TO[affectationItem.name]?.previous_Tons ? 
													parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0))
													.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
											</td> */}
											{/* <td>
											{statistics[affectationItem.name]?.weight ?? 0 +
												(previous_Values_TO[affectationItem.name]?.previous_Tons
												? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons)
												: 0).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })
											}
											</td> */}
											<td>
												{(
													(statistics[affectationItem.name]?.weight ?? 0) +
													(previous_Values_TO[affectationItem.name]?.previous_Tons
													? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons)
													: 0)
												).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
											</td>



											{/* PU */}
											{/* <td>
											{(
												(
													parseFloat(statistics[affectationItem.name].weight) +
													(previous_Values_TO[affectationItem.name]?.previous_Tons ? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0)
												) /
												(statistics[affectationItem.name].count + (previous_Values_QT[affectationItem.name]?.prevQt ? parseFloat(previous_Values_QT[affectationItem.name].prevQt) : 0))
												).toFixed(3)}
											</td> */}
											<td>
												{statistics[affectationItem.name] ? (
													(
													(
														parseFloat(statistics[affectationItem.name].weight) +
														(previous_Values_TO[affectationItem.name]?.previous_Tons ? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0)
													) /
													(statistics[affectationItem.name].count + (previous_Values_QT[affectationItem.name]?.prevQt ? parseFloat(previous_Values_QT[affectationItem.name].prevQt) : 0))
													).toFixed(3)
												) : 0}
											</td>


											{/* MAXI_TO */}
											<td>
												<input
													type="text"
													style={{ width: '80px' }}
													value={maxi_Values[affectationItem.name] ? maxi_Values[affectationItem.name].maxi_To : 0} // Utilisez prevValues[affectationItem.name].prevTo pour la valeur 
													onChange={(e) => handlemaxi_ToChange(affectationItem.name, e.target.value)}
												/>
											</td>

											{/* DIFF_TO */}
											{/* <td className={
													parseFloat(maxi_Values[affectationItem.name]?.maxi_To) - parseFloat(statistics[affectationItem.name].weight) - (previous_Values_TO[affectationItem.name]?.previous_Tons ? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0) < 0 ? 'red-text' : '' }>
												{isNaN(
													parseFloat(maxi_Values[affectationItem.name]?.maxi_To) - parseFloat(statistics[affectationItem.name].weight) - (previous_Values_TO[affectationItem.name]?.previous_Tons ? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0)) ? 0 : (
													parseFloat(maxi_Values[affectationItem.name]?.maxi_To) - parseFloat(statistics[affectationItem.name].weight) - (previous_Values_TO[affectationItem.name]?.previous_Tons ? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0))
													.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })
												}
											</td> */}
											<td className={
												statistics[affectationItem.name] &&
												parseFloat(maxi_Values[affectationItem.name]?.maxi_To) - parseFloat(statistics[affectationItem.name].weight) - (previous_Values_TO[affectationItem.name]?.previous_Tons ? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0) < 0 ? 'red-text' : ''
												}>
												{statistics[affectationItem.name] ? (
													isNaN(
													parseFloat(maxi_Values[affectationItem.name]?.maxi_To) - parseFloat(statistics[affectationItem.name].weight) - (previous_Values_TO[affectationItem.name]?.previous_Tons ? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0)
													) ? 0 : (
													parseFloat(maxi_Values[affectationItem.name]?.maxi_To) - parseFloat(statistics[affectationItem.name].weight) - (previous_Values_TO[affectationItem.name]?.previous_Tons ? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0)
													).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })
												) : 0}
											</td>


											{/* LET_QT */}
											{/* <td className={Math.floor(
												(
													isNaN(parseFloat(maxi_Values[affectationItem.name]?.maxi_To) - parseFloat(statistics[affectationItem.name].weight) - (previous_Values_TO[affectationItem.name]?.previous_Tons ? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0)) ?
													0 :
													(
													parseFloat(maxi_Values[affectationItem.name]?.maxi_To) - parseFloat(statistics[affectationItem.name].weight) - (previous_Values_TO[affectationItem.name]?.previous_Tons ? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0)
													) / (
													(
														parseFloat(statistics[affectationItem.name].weight) +
														(previous_Values_TO[affectationItem.name]?.previous_Tons ? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0)
													) /
													(statistics[affectationItem.name].count + (previous_Values_QT[affectationItem.name]?.prevQt ? parseFloat(previous_Values_QT[affectationItem.name].prevQt) : 0))
													)
												)
												) < 0 ? 'red-text' : ''}>
												{(
													isNaN(parseFloat(maxi_Values[affectationItem.name]?.maxi_To) - parseFloat(statistics[affectationItem.name].weight) - (previous_Values_TO[affectationItem.name]?.previous_Tons ? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0)) ?
													0 :
													Math.floor(
													(
														parseFloat(maxi_Values[affectationItem.name]?.maxi_To) - parseFloat(statistics[affectationItem.name].weight) - (previous_Values_TO[affectationItem.name]?.previous_Tons ? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0)
													) /
													(
														(
														parseFloat(statistics[affectationItem.name].weight) +
														(previous_Values_TO[affectationItem.name]?.previous_Tons ? parseFloat(previous_Values_TO[affectationItem.name].previous_Tons) : 0)
														) /
														(statistics[affectationItem.name].count + (previous_Values_QT[affectationItem.name]?.prevQt ? parseFloat(previous_Values_QT[affectationItem.name].prevQt) : 0))
													)
													)
												).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
											</td> */}
											<td className={
												(() => {
													try {
													const maxiTo = parseFloat(maxi_Values[affectationItem.name]?.maxi_To) || 0;
													const statsWeight = parseFloat(statistics[affectationItem.name]?.weight) || 0;
													const prevTO = parseFloat(previous_Values_TO[affectationItem.name]?.previous_Tons) || 0;
													const prevQT = parseFloat(previous_Values_QT[affectationItem.name]?.prevQt) || 0;

													const result = (maxiTo - statsWeight - prevTO) / (
														(statsWeight + prevTO) /
														(statistics[affectationItem.name]?.count + prevQT)
													);

													return Math.floor(isNaN(result) ? 0 : result) < 0 ? 'red-text' : '';
													} catch (error) {
													return 'red-text';
													}
												})()
												}>
												{(() => {
													try {
													const maxiTo = parseFloat(maxi_Values[affectationItem.name]?.maxi_To) || 0;
													const statsWeight = parseFloat(statistics[affectationItem.name]?.weight) || 0;
													const prevTO = parseFloat(previous_Values_TO[affectationItem.name]?.previous_Tons) || 0;
													const prevQT = parseFloat(previous_Values_QT[affectationItem.name]?.prevQt) || 0;

													const result = (maxiTo - statsWeight - prevTO) / (
														(statsWeight + prevTO) /
														(statistics[affectationItem.name]?.count + prevQT)
													);

													return isNaN(result) ? 0 : Math.floor(result).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
													} catch (error) {
													return '0';
													}
												})()}
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


