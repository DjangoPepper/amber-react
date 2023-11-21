import { useSelector, useDispatch} from "react-redux";
import { RootState } from "../stores/rootStore";
import DataAction from "../stores/dataS/DataAction";
import { stepe_Data } from "../stores/dataS/DataReducer";
import { Table } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import { affectation} from "../utils/destination"
// import { updateAffectationVisibility } from '../stores/data/destinationActions';
import Button from 'react-bootstrap/Button';



export default function Statistics() {

	let totalCount = 0;
	let totalWeight = 0;

	let totalCalesCount = 0;
	let totalCalesWeight = 0;

	let totalstockCount = 0;
	let totalstockWeight = 0;
	
	const dispatch = useDispatch();	
	// const [previous_Value_TO, set_previous_Value_TO] = useState<{ [key: string]: { prevTO: string; prevTO_VALUE: string } }>({});
	const [previous_Value_TO, set_previous_Value_TO] = useState<{ [key: string]: { prevTO: string; prevTO_VALUE: string } }>({});
	// const [previous_Value_QT, set_previous_Value_QT] = useState<{ [key: string]: { prevQT: string; prevQT_Value: string } }>({});
	const [previous_Value_QT, set_previous_Value_QT] = useState<{ [key: string]: { prevQT_Value: string } }>({});
	const [maxi_Values, set_maxi_Values] = useState<{ [key: string]: { maxi_To: string } }>({});
	const data = useSelector<RootState, stepe_Data[]>((state) => state.data.data);
	const selectedColors = useSelector<RootState, { [key: string]: string }>((state) => state.data.pickerColors);
	const [Extended_Tally_Value, set_Extended_Tally_Value] = React.useState(false);

	const handle_Extended_Tally = () => {
			set_Extended_Tally_Value((prevValue) => {
				console.log("handle_Extended_Tally :", prevValue);
				return !prevValue;
			});
		};
	

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
		dispatch(DataAction.change_CHECKBOX_STATE({ key: k, value: updatedCheckboxState[k] }));
		};

	const checkboxHoldStateFromRedux = useSelector<RootState, { [key: string]: boolean }>(
		(state) => state.data.checkboxHoldState
		);

	//fred deprecated
	
	const handlemaxi_ToChange = (k: string, value: string) => {
		set_maxi_Values((maxi_Values: any) => ({
			...maxi_Values,
			[k]: { maxi_To: value },
		}));
		const numericValue = parseFloat(value);
		dispatch(DataAction.changeMaxiTONS({ destination: k, value: numericValue }));
		};

	const handle_prevQT_Value_Change = (k: string, value: string) => {
		set_previous_Value_QT((previous_Value_QT) => ({
			...previous_Value_QT,
			[k]: { 
				prevQT_Value: value, 
			},
		}));
		let numericValue = parseFloat(value) || 0;
		dispatch(DataAction.changePreviousQTT({ destination: k, value: numericValue }));
		
		};

	const handle_PrevTO_VALUE_Change = (k: string, value: string) => {
		set_previous_Value_TO((previous_Value_TO) => ({
			...previous_Value_TO,
			// [k]: { prevTO: previous_Value_TO[k] ? previous_Value_TO[k].prevTO : '0', prevTO_VALUE: value },
			[k]: { prevTO_VALUE: value,  prevTO: previous_Value_TO[k] ? previous_Value_TO[k].prevTO : '0' },
		}));
		let numericValue = parseFloat(value) || 0;
		dispatch(DataAction.changePreviousTONS({ destination: k, value: numericValue }));
		};
	
	// const totalMaxiCalesWeight = Object.keys(maxi_Values).reduce((total, k) => {
	// 	return total + (maxi_Values[k] ? parseFloat(maxi_Values[k].maxi_To) : 0);
	// 	}, 0);
	
	const totalPreviousCalesCount = Object.keys(previous_Value_QT).reduce((total, k) => {
		return total + (previous_Value_QT[k] ? parseFloat(previous_Value_QT[k].prevQT_Value) : 0);
		}, 0);
	
	const totalPreviousCalesWeight = Object.keys(previous_Value_TO).reduce((total, k) => {
		return total + (previous_Value_TO[k]?.prevTO_VALUE ? parseFloat(previous_Value_TO[k].prevTO_VALUE) : 0);
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

	
	// useEffect(() => {
	// // Parcoure le tableau affectation et envoyez chaque état "visibleState" dans Redux
	// 	affectation.forEach((item) => {
	// // Utilise  action  pour mettre à jour l'état dans Redux
	// // dispatch(updateAffectationVisibility(item.name, item.visibleState));
	// dispatch(DataAction.change_CHECKBOX_STATE({ key: item.name, value: item.visibleState }));
	// 	});
	// }, [affectation, dispatch]); // Assurez-vous de lister dispatch comme dépendance pour éviter les avertissements
		
	
	// updateAffectationVisibility(item.name, item.visibleState));

	// 	// });
	// }, [dispatch]); // Assurez-vous de lister dispatch comme dépendance pour éviter les avertissements
	
	// useEffect(() => {
	// 	set_checkbox_Hold_State(checkboxHoldStateFromRedux);
	// 	}, [checkboxHoldStateFromRedux]);
	

	return (
		<div>
		<Table>
			{/* ... En-tête de table ... */}		
			<thead>
				<tr>
					<th>DesT</th>
					<th>K</th> {/* Nouvelle colonne avec des cases à cocher */}
					<th> DAY_Q </th>
					<th> DAY_T </th>
					<th>PREV_Q</th>
					<th>PREV_T</th>
					<th>TT_Q</th>
					<th>TT_T</th>
					<Button variant="info" onClick={handle_Extended_Tally}>
						E
					</Button>
				</tr>
			</thead>
			<tbody>
			
{/* HEADERS */}
			{affectation.map((affectationItem) => {

				const statistics_array = statistics[affectationItem.name] || {}; // Utilise un objet vide par défaut
				let chsafin = checkbox_Hold_State[affectationItem.name] || false;
				if (
					chsafin || 
					(
						statistics_array && 
						!isNaN(statistics_array.count) && 
						statistics_array.count > 0
					)
				) {
					// console.log("visible : ", affectationItem.name)
					
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
							<td>
								{statistics[affectationItem.name] ? statistics[affectationItem.name].count : 0}
							</td>

{/* DAY_T */}
							<td>
								{statistics[affectationItem.name] ? parseFloat(statistics[affectationItem.name].weight).toLocaleString("en-US", {minimumFractionDigits: 3, maximumFractionDigits: 3,}) : "0.000"}
							</td>

								{/* si dest est stock passe x colonnes */}
								{affectationItem.name === 'stock' ? ( 
									<>
										<td colSpan={5}></td> 
										{/* <td> </td>  */}
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
													value={
														previous_Value_QT[affectationItem.name] ? 
															previous_Value_QT[affectationItem.name].prevQT_Value 
															: 
															0
													}
													onChange={(e) => handle_prevQT_Value_Change(affectationItem.name, e.target.value)}
												/>
											</td>
													
{/* PREV_T */}
											<td>
												<input
													type="text"
													style={{ width: '80px' }}
													value={
														previous_Value_TO[affectationItem.name] ? 
															previous_Value_TO[affectationItem.name].prevTO_VALUE 
															: 
															0
													}
													onChange={(e) => handle_PrevTO_VALUE_Change(affectationItem.name, e.target.value)}
												/>
											</td>

{/* TTL_Q */}
											<td>
												{(
													(statistics[affectationItem.name]?.count ?? 0) +
													(previous_Value_QT[affectationItem.name]?.prevQT_Value
													? parseFloat(previous_Value_QT[affectationItem.name].prevQT_Value)
													: 0)
												)
												}
											</td>
													
{/* TTL_T */}											
											<td>
												{(
													(statistics[affectationItem.name]?.weight ?? 0) +
													(previous_Value_TO[affectationItem.name]?.prevTO_VALUE
													? parseFloat(previous_Value_TO[affectationItem.name].prevTO_VALUE)
													: 0)
												).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
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


{/* PARTIE calcul */}

				<tr>
{/*ICI K */}
				<td>Totaux</td>
{/* Q */}
				<td> </td>					 									
				<td>{isNaN(totalCalesCount) ? 0 : totalCalesCount}</td>										
{/* T */}
				<td>{isNaN(totalCalesWeight) ? 0 : totalCalesWeight.toLocaleString("en-US")}</td>				
{/*PREV_Q */}				
				<td>{isNaN(totalPreviousCalesCount) ? 0 : totalPreviousCalesCount}</td>								
{/*PREV_T */}
				<td>{isNaN(totalPreviousCalesWeight) ? 0 : totalPreviousCalesWeight.toLocaleString("en-US")}</td>
{/*TT_Q */}				
				<td>{totalCalesCount + totalPreviousCalesCount}</td>							
{/*TT_T */}					
				<td>{(totalCalesWeight + totalPreviousCalesWeight).toLocaleString("en-US")}</td>
				
				</tr><tr>
				</tr>
			</tbody>
		</Table>
{/* *********************************************************************************************** */}
{/* *********************************************************************************************** */}
{/* *********************************************************************************************** */}
{/* *********************************************************************************************** */}
{/* *********************************************************************************************** */}
{/* *********************************************************************************************** */}
{Extended_Tally_Value && (
<Table>
			{/* ... En-tête de table ... */}		
			<thead>
				<tr>
					<th> DesT </th>
					<th></th>
					<th> PU  </th>
					<th> MAX </th>
					<th>DIFF T</th>
					<th>DIFF Q</th>
				</tr>
			</thead>
			<tbody>
			
{/* HEADERS */}
			{affectation.map((affectationItem) => {

				const statistics_array = statistics[affectationItem.name] || {}; // Utilisez un objet vide par défaut
				let chsafin = checkbox_Hold_State[affectationItem.name] || false;
				if (
					chsafin || 
					(
						statistics_array && 
						!isNaN(statistics_array.count) && 
						statistics_array.count > 0
					)
				) {
					// console.log("visible : ", affectationItem.name)
					
					return (
						<tr key={affectationItem.name}>
							
{/* DEST */}
							<td style={{ backgroundColor: selectedColors[affectationItem.name] }}>{affectationItem.name}</td>
							
{/* CHECKBOX */}
						<td></td>

{/* DAY_T */}
								{/* si dest est stock passe 7 colonnes */}
								{affectationItem.name === 'stock' ? ( 
									<>
										<td colSpan={3}></td> 
										<td> </td> 
									</>
									) 
									: 									
									(
										<> 					
											{/* sinon affiche toute les colonnes */}
{/* PU */}
											<td>
												{(
													(
														(statistics[affectationItem.name]?.weight ?? 0) +
														(previous_Value_TO[affectationItem.name]?.prevTO_VALUE
														? parseFloat(previous_Value_TO[affectationItem.name].prevTO_VALUE)
														: 0)
													)
													// .toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })
													/
													(
													(statistics[affectationItem.name]?.count ?? 0 
														+ 
													(previous_Value_QT[affectationItem.name]?.prevQT_Value ? parseFloat(previous_Value_QT[affectationItem.name].prevQT_Value) : 0))
													)
												).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
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


 {/* DIFF_T */}
											<td className={
												(
														(parseFloat(maxi_Values[affectationItem.name]?.maxi_To ?? 0) - 
															(
																(parseFloat(statistics[affectationItem.name]?.weight) || 0) +
																(parseFloat(previous_Value_TO[affectationItem.name]?.prevTO_VALUE) || 0)
															)
														) < 0 ? 'red-text' : 'blue-text'
												)
											}
												>
											{
												(
													parseFloat(maxi_Values[affectationItem.name]?.maxi_To ?? 0) - 
													(
													(parseFloat(statistics[affectationItem.name]?.weight) || 0) +
													(parseFloat(previous_Value_TO[affectationItem.name]?.prevTO_VALUE) || 0)
													)
												).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })
											}
											</td>


{/* DIFF_Q */}
											<td className={
												(() => {
													try {
													const maxiTo = parseFloat(maxi_Values[affectationItem.name]?.maxi_To) || 0;
													const statsWeight = parseFloat(statistics[affectationItem.name]?.weight) || 0;
													const prevTO = parseFloat(previous_Value_TO[affectationItem.name]?.prevTO_VALUE) || 0;
													const prevQT_Value = parseFloat(previous_Value_QT[affectationItem.name]?.prevQT_Value) || 0;

													const result = (maxiTo - statsWeight - prevTO) / (
														(statsWeight + prevTO) /
														(statistics[affectationItem.name]?.count + prevQT_Value)
													);

													return Math.floor(isNaN(result) ? 0 : result) < 0 ? 'red-text' : 'blue-text';
													} catch (error) {
													return 'red-text';
													}
												})()
												}>
												{(() => {
													try {
													const maxiTo = parseFloat(maxi_Values[affectationItem.name]?.maxi_To) || 0;
													const statsWeight = parseFloat(statistics[affectationItem.name]?.weight) || 0;
													const prevTO = parseFloat(previous_Value_TO[affectationItem.name]?.prevTO_VALUE) || 0;
													const prevQT_Value = parseFloat(previous_Value_QT[affectationItem.name]?.prevQT_Value) || 0;

													const result = (maxiTo - statsWeight - prevTO) / (
														(statsWeight + prevTO) /
														(statistics[affectationItem.name]?.count + prevQT_Value)
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


{/* PARTIE calcul */}

				<tr>
				</tr>
			</tbody>
		</Table>
)}
{/* *********************************************************************************************** */}
{/* *********************************************************************************************** */}



		
			</div>
		);
		}


