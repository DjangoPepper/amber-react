import { useSelector, useDispatch} from "react-redux";
import { RootState } from "../stores/rootStore";
import DataAction from "../stores/data/DataAction";
import { Data } from "../stores/data/DataReducer";
import { Table } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import { affectation} from "../utils/destination"
import { updateAffectationVisibility } from '../stores/data/destinationActions';
import Button from 'react-bootstrap/Button';



export default function Statistics() {

	let totalCount = 0;
	let totalWeight = 0;

	let totalCalesCount = 0;
	let totalCalesWeight = 0;

	let totalstockCount = 0;
	let totalstockWeight = 0;
	
	const dispatch = useDispatch();	
	const [previous_Values_TO, set_previous_Values_TO] = useState<{ [key: string]: { prevTO: string; previous_TONS: string } }>({});
	const [previous_Values_QT, set_previous_Values_QT] = useState<{ [key: string]: { prevQT: string; previous_QT: string } }>({});
	const [maxi_Values, set_maxi_Values] = useState<{ [key: string]: { maxi_To: string } }>({});
	const data = useSelector<RootState, Data[]>((state) => state.data.data);
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
		let unckeckable_available = true;
		//verif verif si prev_q & prev_t not null
		//previous_Values_TO
		if (previous_Values_TO[k] === undefined || previous_Values_TO[k].prevTO >= '0' ) { unckeckable_available = false; }
		if (previous_Values_QT[k] === undefined || previous_Values_QT[k].prevQT >= '0' ) { unckeckable_available = false; }
		
		if (unckeckable_available === true) {
			const updatedCheckboxState = { ...checkbox_Hold_State };
			if (updatedCheckboxState[k] !== undefined) {
					updatedCheckboxState[k] = !updatedCheckboxState[k];
			} else {
					updatedCheckboxState[k] = true;
				}
				set_checkbox_Hold_State(updatedCheckboxState);
				};
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

	const handle_prevQT_Change = (k: string, value: string) => {
		set_previous_Values_QT((previous_Values_Qt) => ({
			...previous_Values_Qt,
			[k]: { prevQT: value, previous_QT: previous_Values_Qt[k] ? previous_Values_Qt[k].previous_QT : '0' },
		}));
		let numericValue = parseFloat(value) || 0;
		dispatch(DataAction.changePreviousQTT({ destination: k, value: numericValue }));
	};

	const handle_PrevTo_Change = (k: string, value: string) => {
		set_previous_Values_TO((previous_Values_TO) => ({
			...previous_Values_TO,
			[k]: { prevTO: previous_Values_TO[k] ? previous_Values_TO[k].prevTO : '0', previous_TONS: value },
		}));
		let numericValue = parseFloat(value) || 0;
		dispatch(DataAction.changePreviousTONS({ destination: k, value: numericValue }));
	};
	
	const totalMaxiCalesWeight = Object.keys(maxi_Values).reduce((total, k) => {
		return total + (maxi_Values[k] ? parseFloat(maxi_Values[k].maxi_To) : 0);
	}, 0);
	
	const totalPreviousCalesCount = Object.keys(previous_Values_QT).reduce((total, k) => {
		return total + (previous_Values_QT[k] ? parseFloat(previous_Values_QT[k].prevQT) : 0);
	}, 0);
	
	const totalPreviousCalesWeight = Object.keys(previous_Values_TO).reduce((total, k) => {
		return total + (previous_Values_TO[k]?.previous_TONS ? parseFloat(previous_Values_TO[k].previous_TONS) : 0);
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

	useEffect(() => {
		affectation.forEach((item) => {
		dispatch(updateAffectationVisibility(item.name, item.visibleState));
		});
	}, [dispatch]);
	
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

				const statistics_array = statistics[affectationItem.name] || {};
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
														previous_Values_QT[affectationItem.name] ? 
															previous_Values_QT[affectationItem.name].prevQT 
															: 
															0
													}
													onChange={(e) => handle_prevQT_Change(affectationItem.name, e.target.value)}
												/>
											</td>
													
{/* PREV_T */}
											<td>
												<input
													type="text"
													style={{ width: '80px' }}
													value={
														previous_Values_TO[affectationItem.name] ? 
															previous_Values_TO[affectationItem.name].previous_TONS 
															: 
															0
													}
													onChange={(e) => handle_PrevTo_Change(affectationItem.name, e.target.value)}
												/>
											</td>

{/* TTL_Q */}
											<td>
												{(
													(statistics[affectationItem.name]?.count ?? 0) +
													(previous_Values_QT[affectationItem.name]?.prevQT
													? parseFloat(previous_Values_QT[affectationItem.name].prevQT)
													: 0)
												)
												}
											</td>
													
{/* TTL_T */}											
											<td>
												{(
													(statistics[affectationItem.name]?.weight ?? 0) +
													(previous_Values_TO[affectationItem.name]?.previous_TONS
													? parseFloat(previous_Values_TO[affectationItem.name].previous_TONS)
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
{/* K */}
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
					console.log("visible : ", affectationItem.name)
					
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
														(previous_Values_TO[affectationItem.name]?.previous_TONS
														? parseFloat(previous_Values_TO[affectationItem.name].previous_TONS)
														: 0)
													)
													// .toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })
													/
													(
													(statistics[affectationItem.name]?.count ?? 0 
														+ 
													(previous_Values_QT[affectationItem.name]?.prevQT ? parseFloat(previous_Values_QT[affectationItem.name].prevQT) : 0))
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
																(parseFloat(previous_Values_TO[affectationItem.name]?.previous_TONS) || 0)
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
													(parseFloat(previous_Values_TO[affectationItem.name]?.previous_TONS) || 0)
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
													const prevTO = parseFloat(previous_Values_TO[affectationItem.name]?.previous_TONS) || 0;
													const prevQT = parseFloat(previous_Values_QT[affectationItem.name]?.prevQT) || 0;

													const result = (maxiTo - statsWeight - prevTO) / (
														(statsWeight + prevTO) /
														(statistics[affectationItem.name]?.count + prevQT)
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
													const prevTO = parseFloat(previous_Values_TO[affectationItem.name]?.previous_TONS) || 0;
													const prevQT = parseFloat(previous_Values_QT[affectationItem.name]?.prevQT) || 0;

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


