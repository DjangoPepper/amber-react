import { useSelector, useDispatch} from "react-redux";
import { RootState } from "../stores/rootStore";
import DataAction from "../stores/dataS/DataAction";
import { stepe_Data } from "../stores/dataS/DataReducer";
import { Table } from "react-bootstrap";
import React, { useState, useEffect,ChangeEvent } from 'react';
import { affectation} from "../utils/destination";
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { stringify } from "querystring";

export default function Statistics() {

	let totalCount = 0;
	let totalWeight = 0;

	let totalCalesCount = 0;
	let totalCalesWeight = 0;

	let totalstockCount = 0;
	let totalstockWeight = 0;


	const dispatch = useDispatch();	
	const [Extended_Tally_Value, set_Extended_Tally_Value] = React.useState(false);
	const [Initiate_Rendering, set_Initiate_Rendering]     = React.useState(true);
	

	const [checkbox_Hold_State, set_checkbox_Hold_State] 				= useState<{ [key: string]: boolean }>({});	
	// const [string_checkbox_Hold_State, set_string_checkbox_Hold_State]	= useState<{ [key: string]: { chckBX_VALUE: string } }>({});
	const [previous_Value_QT, set_previous_Value_QT]					= useState<{ [key: string]: { prevQT_VALUE: string } }>({});
	const [previous_Value_TO, set_previous_Value_TO]					= useState<{ [key: string]: { prevTO_VALUE: string } }>({});
	const [maxi_Value_TO, set_maxi_Values]								= useState<{ [key: string]: { maxiTO_VALUE: string } }>({});
	
	const selectedColors = useSelector<RootState, { [key: string]: string }>((state) => state.data.pickerColors);

	const Toggle_checkbox_boolean = (k: string) => {

		// Créez une copie de l'état actuel des cases à cocher
		const updatedCheckboxState = { ...checkbox_Hold_State };
	
		// Vérifiez si la destination k est déjà dans l'état des cases à cocher
		if (updatedCheckboxState[k] !== undefined) {
		  // Si oui, basculez simplement la valeur (true devient false, false devient true)
			updatedCheckboxState[k] = !updatedCheckboxState[k];
		} else {
		  // Si la destination n'est pas dans l'état, ajoutez-la et définissez-la comme cochée (true)
			// updatedCheckboxState[k] = true;
			updatedCheckboxState[k] = false;
		}
		// Mettez à jour l'état des cases à cocher avec la nouvelle valeur
		set_checkbox_Hold_State(updatedCheckboxState);
		// dispatch(DataAction.change_checkbox_state ( true ));
		dispatch(DataAction.change_checkbox_state({ [k]: updatedCheckboxState[k] }));
		dispatch(DataAction.save_checkbox_state())
		};

	const handle_checkBOX_Change = (destination: string, value: boolean) => {
		// const [checkbox_Hold_State, set_checkbox_Hold_State] = useState<{ [key: string]: boolean }>({});	
		set_checkbox_Hold_State((checkbox_Hold_State) => ({
			...checkbox_Hold_State,
			[destination]: value,
		}));
		dispatch(DataAction.change_checkbox_state({ [destination]: value }));
		dispatch(DataAction.save_checkbox_state());
		};

	const handle_prevQT_VALUE_Change = (destination: string, value: string) => {
		if(value !== undefined && value !== null && value !== "") { 
			// 
			set_previous_Value_QT((previous_Value_QT) => ({
				...previous_Value_QT,
				[destination]: { 
					prevQT_VALUE: value, 
				},
			}));
			// 
		}

		// let numericValue = parseFloat(value) || 0;
		dispatch(DataAction.changePreviousQTT({ destination: destination, value: value }));
		dispatch(DataAction.save_previous_qtt())
	};
	const handle_PrevTO_VALUE_Change = (destination: string, value: string) => {
		if(value !== undefined && value !== null && value !== "") { 
			set_previous_Value_TO((previous_Value_TO) => ({
				...previous_Value_TO,
				[destination]: { 
					prevTO_VALUE: value, 
				},
			}));
		}
		dispatch(DataAction.changePreviousTONS({ destination: destination, value: value }));
		dispatch(DataAction.save_previous_tons())
	};
	const handle_maxiTO_VALUE_Change = (destination: string, value: string) => {
		if(value !== undefined && value !== null && value !== "") { 
			// 
			set_maxi_Values((maxi_Value_TO: any) => ({
				...maxi_Value_TO,
				[destination]: { 
					maxiTO_VALUE: value, 
				},
			}));
			dispatch(DataAction.changeMaxiTONS({ destination: destination, value: value }));
			dispatch(DataAction.save_maxi_tons())
			// 
		}
		};

	const Toggle_Extended_Tally = () => {
		set_Extended_Tally_Value((prevValue) => {
			return !prevValue;
		});
	};
	const Toggle_Initiate_Rendering = () => {
		set_Initiate_Rendering((prevValue) => {
			return !prevValue;
		});
	};
	const handle_Initiate_Rendering = (prevValue: boolean) => {
		set_Initiate_Rendering(prevValue);
	};

	const catalog_data = useSelector<RootState, stepe_Data[]>((state) => state.data.catalog_data_state);

	const totalPreviousCalesCount = Object.keys(previous_Value_QT).reduce((total, k) => {
		return total + (previous_Value_QT[k] ? parseFloat(previous_Value_QT[k].prevQT_VALUE) : 0);
		}, 0);
	
	const totalPreviousCalesWeight = Object.keys(previous_Value_TO).reduce((total, k) => {
		return total + (previous_Value_TO[k]?.prevTO_VALUE ? parseFloat(previous_Value_TO[k].prevTO_VALUE) : 0);
		}, 0);

		//MANQUE LES INPUTS AU DEMARRAGE

	function init_statistiques() {
		affectation.forEach((affectationItem) => {
			const k = affectationItem.name as string;
			if (k !== "stock") {
				const jsonStringM: string | null = localStorage.getItem("MAXI_TONS_data_storage");
				if (jsonStringM !== null && jsonStringM !== undefined) {
					try {
						const storageObject: Record<string, string> = JSON.parse(jsonStringM);
						const Init_value: string | undefined = storageObject[k];
						if (k !== undefined && Init_value !== undefined) {
							console.log(`La valeur de ${k} est : ${Init_value}`);
							// loaded_HOLD_maxi_TONS:true;
							set_maxi_Values((newvaluefromstorage) => ({
								...newvaluefromstorage,
								[k]: { 
									maxiTO_VALUE: Init_value, 
								},
							}));
						} else {
							console.log(`La clé ${k} n'a pas été trouvée dans l'objet du MAXI_TONS_data_storage`);
							// loaded_HOLD_maxi_TONS:false;
						}
					} catch (error) {
						console.error("Erreur lors de la conversion de la chaîne JSON en objet JavaScript :", error);
					}
				} else {
					console.log("Aucune valeur trouvée dans MAXI_TONS_data_storage");
				}
			// }
				const jsonString: string | null = localStorage.getItem("PREV_TONS_data_storage");
				if (jsonString !== null && jsonString !== undefined) {
					try {
						const storageObject: Record<string, string> = JSON.parse(jsonString);
						const Init_value: string | undefined = storageObject[k];
						if (k !== undefined && Init_value !== undefined) {
							console.log(`La valeur de ${k} est : ${Init_value}`);
							// loaded_HOLD_prev_TONS:true;
							set_previous_Value_TO((newvaluefromstorage) => ({
								...newvaluefromstorage,
								[k]: { 
									prevTO_VALUE: Init_value, 
								},
							}));
						} else {
							console.log(`La clé ${k} n'a pas été trouvée dans l'objet du PREV_TONS_data_storage`);
						}
					} catch (error) {
						console.error("Erreur lors de la conversion de la chaîne JSON en objet JavaScript :", error);
					}
				} else {
					console.log("Aucune valeur trouvée dans PREV_TONS_data_storage");
				}

				const Jsonstring: string | null = localStorage.getItem("PREV_QTT_data_storage");
				if (Jsonstring !== null && Jsonstring !== undefined) {
					try {
						const storageObject: Record<string, string> = JSON.parse(Jsonstring);
						const Init_value: string | undefined = storageObject[k];
						if (k !== undefined && Init_value !== undefined) {
							console.log(`La valeur de ${k} est : ${Init_value}`);
							// loaded_HOLD_prev_QTT:true;
							set_previous_Value_QT((newvaluefromstorage) => ({
								...newvaluefromstorage,
								[k]: { 
									prevQT_VALUE: Init_value, 
								},
							}));
						} else {
							console.log(`La clé ${k} n'a pas été trouvée dans l'objet du PREV_QTT_data_storage`);
						}
					} catch (error) {
						console.error("Erreur lors de la conversion de la chaîne JSON en objet JavaScript :", error);
					}
				} else {
					console.log("Aucune valeur trouvée dans PREV_QTT_data_storage");
				}

				const JsonString: string | null = localStorage.getItem("CHECKBOX_data_storage");
				if (JsonString !== null && JsonString !== undefined) {
					try {
						const storageObject: Record<string, string> = JSON.parse(JsonString);
						const Init_value: string | undefined = storageObject[k];
						if (k !== undefined && Init_value !== undefined) {
							console.log(`La checkbox de ${k} est : ${Init_value}`);
							// loaded_HOLD_checkbox:true;
							// onChange={(e) => handle_PrevTO_VALUE_Change(affectationItem.name, e.target.value)}
							set_checkbox_Hold_State((checkbox_Hold_State) => ({
								...checkbox_Hold_State,
								// [destination]: value,
								[k]: Init_value === "true" ? true : false,
							}));
						} else {
							console.log(`La clé ${k} n'a pas été trouvée dans l'objet du CHECKBOX_data_storage`);
						}
					} catch (error) {
						console.error("Erreur lors de la conversion de la chaîne JSON en objet JavaScript :", error);
					}
				} else {
					console.log("Aucune valeur trouvée dans CHECKBOX_data_storage");
					set_checkbox_Hold_State((checkbox_Hold_State) => ({
						...checkbox_Hold_State,
						[k]: false,
					}));
				}
			}
		});
	}
	useEffect(() => {
		if (Initiate_Rendering) {
			init_statistiques();
			toast.error('init Tally', { position: toast.POSITION.TOP_LEFT, autoClose: 500 });
		}
	}
	, [Initiate_Rendering]);

	const statistics = catalog_data.reduce<any>((p, row) => {
		if (!p[row.destination]) {
			p[row.destination] = { count: 0, weight: 0  };
		}
		p[row.destination].count += 1;
		p[row.destination].weight += parseFloat((row.weight).toFixed(3));
		return p;
		}, {});

	
//
	Object.values(statistics).forEach((destinationStats: any ) => {    
		totalCount += destinationStats.count;
		totalWeight += destinationStats.weight;
		totalCalesCount = totalCount ;
		totalCalesWeight = totalWeight;
//
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
// 
		return (
		<div>
		<Table>
			{/* ... En-tête de table ... */}		
			<thead>
				<tr>
					<th style={{ textAlign: 'left' }}>DesT</th>
					{/* <th style={{ textAlign: 'center' }}>K</th> */}
					<th style={{ textAlign: 'center' }}>
					<Button variant="info" onClick={Toggle_Extended_Tally}>T</Button>
					</th>
					<th style={{ textAlign: 'center' }}>DAY_Q</th>
					<th style={{ textAlign: 'center' }}>DAY_T</th>
					{Extended_Tally_Value && (
					<>
						<th style={{ textAlign: 'center', backgroundColor: 'gray' }}>PREV_Q</th>
						<th style={{ textAlign: 'center', backgroundColor: 'gray' }}>PREV_T</th>
					</>
					)}
					<th style={{ textAlign: 'center' }}>TT_Q</th>
					<th style={{ textAlign: 'center' }}>TT_T</th>
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
							<td style={{ backgroundColor: selectedColors[affectationItem.name], textAlign: 'left' }}>{affectationItem.name}
							{/* </td> */}
{/* CHECKBOX */} <>  </>
							{/* <td> */}
							{ affectationItem.name !== 'stock' ? ( 
								<input
								type="checkbox" 
								checked={checkbox_Hold_State[affectationItem.name] } 
								onChange={(e: ChangeEvent<HTMLInputElement>) => Toggle_checkbox_boolean(affectationItem.name)}
								// onChange={(e) => Toggle_checkbox_boolean(affectationItem.name)}
								// onChange={(e: ChangeEvent<HTMLInputElement>) => handle_prevQT_VALUE_Change(affectationItem.name, e.target.value)}
								// onChange={(e: ChangeEvent<HTMLInputElement>) => Toggle_checkbox_boolean(affectationItem.name)}

								/>
							):null}							
							</td>
							<td> <> </></td>

{/* DAY_Q */}				
							{/* <tr> */}
								<td style={{ textAlign: 'center'}}>
									{statistics[affectationItem.name] ? statistics[affectationItem.name].count : 0}
								</td>
							{/* </tr> */}

{/* DAY_T */}
							<td style={{ textAlign: 'center'}}>
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
{Extended_Tally_Value && (
					<>
											<td style={{ textAlign: 'center',backgroundColor: 'gray' }}>		
												<input
													type="text"
													style={{ width: '45px' }}
													value={
														previous_Value_QT[affectationItem.name] ? 
															previous_Value_QT[affectationItem.name].prevQT_VALUE 
															: 
															0
													}
													onChange={(e: ChangeEvent<HTMLInputElement>) => handle_prevQT_VALUE_Change(affectationItem.name, e.target.value)}
													
												/>
											</td>

													
{/* PREV_T */}
											{/* <td style={{ backgroundColor: 'gray' }}>	 */}
											<td style={{ textAlign: 'center',backgroundColor: 'gray' }}>			
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
													// <input type="text" value={inputValue} onChange={handleInputChange} />
													// const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
													// 	const value = e.target.value;
													// 	// Mettre à jour le state avec la nouvelle valeur
													// 	setInputValue(value);
													// 	};

												/>
											</td>
											</>
				)}
{/* TTL_Q */}
											<td style={{ textAlign: 'center'}}>
												{(
													(statistics[affectationItem.name]?.count ?? 0) +
													(previous_Value_QT[affectationItem.name]?.prevQT_VALUE
													? parseFloat(previous_Value_QT[affectationItem.name].prevQT_VALUE)
													: 0)
												)
												}
											</td>
											
{/* TTL_T */}											
											<td style={{ textAlign: 'center'}}>
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
				// console.log("Invisible : ", affectationItem.name)
				return null;
			})}
				{/* PARTIE calcul */}
				<tr>
				{/* K */}
				<td style={{ textAlign: 'left'}}>Total</td>
				{/* Q */}
				<td style={{ textAlign: 'center'}}> </td>					 									
				<td style={{ textAlign: 'center'}}>{isNaN(totalCalesCount) ? 0 : totalCalesCount}</td>										
				{/* T */}
				<td style={{ textAlign: 'center'}}>{isNaN(totalCalesWeight) ? 0 : totalCalesWeight.toLocaleString("en-US")}</td>				
				{Extended_Tally_Value && (
					<>
						{/*PREV_Q */}
						<td style={{ textAlign: 'center',backgroundColor: 'gray' }}>{isNaN(totalPreviousCalesCount) ? 0 : totalPreviousCalesCount}</td>
						{/*PREV_T */}
						<td style={{ textAlign: 'center',backgroundColor: 'gray' }}>{isNaN(totalPreviousCalesWeight) ? 0 : totalPreviousCalesWeight.toLocaleString("en-US")}</td>
					</>
				)}
				{/* TT_Q */}
				<td style={{ textAlign: 'center' }}>{totalCalesCount + totalPreviousCalesCount}</td>
				{/* TT_T */}
				<td style={{ textAlign: 'center' }}>{(totalCalesWeight + totalPreviousCalesWeight).toLocaleString("en-US")}</td>

				</tr><tr>
				</tr>
			</tbody>
		</Table>
{/* *********************************************************************************************** */}
{/* *********************************************************************************************** */}
{Extended_Tally_Value && (
<Table>
			{/* ... En-tête de table ... */}		
			<thead>
				<tr>
					<th>DesT</th>
					<th> </th>
					<th style={{ textAlign: 'center'}}> PU  </th>
					<th style={{ textAlign: 'center'}}> MAX </th>
					<th style={{ textAlign: 'center'}}>DIFF T</th>
					<th style={{ textAlign: 'center'}}>DIFF Q</th>
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
											<td style={{ textAlign: 'center'}}>
												{
													(
														(
															(statistics[affectationItem.name]?.weight ??  0) 
															+
															(previous_Value_TO[affectationItem.name]?.prevTO_VALUE ?
																parseFloat(previous_Value_TO[affectationItem.name].prevTO_VALUE) : 0)
														)
														/
														(
															(statistics[affectationItem.name]?.count ?? 0) 
															+ 
															(previous_Value_QT[affectationItem.name]?.prevQT_VALUE ?
																parseFloat(previous_Value_QT[affectationItem.name].prevQT_VALUE) : 0)
														)
														// (totalCalesCount + totalPreviousCalesCount) / (totalCalesWeight + totalPreviousCalesWeight) 
													).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })
												}
											</td>

											
{/* MAXI_TONS */}
											<td style={{ textAlign: 'center'}}>
												<input
													type="text"
													style={{ width: '80px' }}
													value={maxi_Value_TO[affectationItem.name] ? maxi_Value_TO[affectationItem.name].maxiTO_VALUE : 0} // Utilisez prevValues[affectationItem.name].prevTo pour la valeur 
													onChange={(e) => handle_maxiTO_VALUE_Change(affectationItem.name, e.target.value)}
												/>
											</td>


 {/* DIFF_T */}
											<td style={{ textAlign: 'center'}} 
												className={
												(
														(parseFloat(maxi_Value_TO[affectationItem.name]?.maxiTO_VALUE ?? 0) - 
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
													parseFloat(maxi_Value_TO[affectationItem.name]?.maxiTO_VALUE ?? 0) - 
													(
													(parseFloat(statistics[affectationItem.name]?.weight) || 0) +
													(parseFloat(previous_Value_TO[affectationItem.name]?.prevTO_VALUE) || 0)
													)
												).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })
											}
											</td>


{/* DIFF_Q */}
											<td style={{ textAlign: 'center'}}
												className={
												(() => {
													try {
													const maxiTo_VALUE = parseFloat(maxi_Value_TO[affectationItem.name]?.maxiTO_VALUE) || 0;
													const statsWeight = parseFloat(statistics[affectationItem.name]?.weight) || 0;
													const prevTO_VALUE = parseFloat(previous_Value_TO[affectationItem.name]?.prevTO_VALUE) || 0;
													const prevQT_VALUE = parseFloat(previous_Value_QT[affectationItem.name]?.prevQT_VALUE) || 0;

													const result = (maxiTo_VALUE - statsWeight - prevTO_VALUE) / (
														(statsWeight + prevTO_VALUE) /
														(statistics[affectationItem.name]?.count + prevQT_VALUE)
													);

													return Math.floor(isNaN(result) ? 0 : result) < 0 ? 'red-text' : 'blue-text';
													} catch (error) {
													return 'red-text';
													}
												})()
												}>
												{(() => {
													try {
													const maxiTo_VALUE = parseFloat(maxi_Value_TO[affectationItem.name]?.maxiTO_VALUE) || 0;
													const statsWeight = parseFloat(statistics[affectationItem.name]?.weight) || 0;
													const prevTO_VALUE = parseFloat(previous_Value_TO[affectationItem.name]?.prevTO_VALUE) || 0;
													const prevQT_VALUE = parseFloat(previous_Value_QT[affectationItem.name]?.prevQT_VALUE) || 0;

													const result = (maxiTo_VALUE - statsWeight - prevTO_VALUE) / (
														(statsWeight + prevTO_VALUE) /
														(statistics[affectationItem.name]?.count + prevQT_VALUE)
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
				// console.log("Invisible : ", affectationItem.name)
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


