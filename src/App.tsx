import React from 'react';
import { Provider } from "react-redux";

import './styles/App.scss';
import Header from "./components/header";
import Main from "./components/main";
import {store} from "./stores/rootStore";
import { useLeavePageConfirm } from "./components/use-leave";
import DataAction from "./stores/dataS/DataAction";
import { toast } from 'react-toastify';
import { affectation } from './utils/destination';
import { stringify } from 'querystring';


let backupInterval = 61 * 1000; //30 * 1000 ms = 30s
// let firstRender = false;

function init() {
		
	// const Init_data_catalog = window.localStorage.getItem("data");
	const Init_data_catalog = window.localStorage.getItem("CATALOG_data_storage");
	const Init_data_CHECK_BOX = window.localStorage.getItem("CHECKBOX_data_storage");
	const Init_data_PREV_QTT = window.localStorage.getItem("PREV_QTT_data_storage");
	const Init_data_PREV_TONS = window.localStorage.getItem("PREV_TONS_data_storage");
	const Init_data_MAXI_TONS = window.localStorage.getItem("MAXI_TONS_data_storage");

	if (Init_data_catalog) {
			store.dispatch(DataAction.load_catalog(Init_data_catalog));
		}
/* 
	if (Init_data_STRING_CHECKBOX_STATE) {
		const parsedStringCheckboxState = JSON.parse(Init_data_STRING_CHECKBOX_STATE);
		// store.dispatch(DataAction.load_string_checkbox_state(JSON.parse(Init_data_STRING_CHECKBOX_STATE)));
		store.dispatch(DataAction.change_checkbox_state(parsedStringCheckboxState));
		}

	if (Init_data_CHECK_BOX) {
			const parsedCheckboxState = JSON.parse(Init_data_CHECK_BOX);
			// store.dispatch(DataAction.load_checkbox_state(JSON.parse(Init_data_CHECK_BOX)));
			store.dispatch(DataAction.change_checkbox_state(JSON.parse(Init_data_CHECK_BOX)));
		}

	if (Init_data_PREV_QTT) {
			const parsedPrev_QTT = JSON.parse(Init_data_PREV_QTT);
			// store.dispatch(DataAction.load_previous_qtt_state(JSON.parse(Init_data_PREV_QTT)));
			store.dispatch(DataAction.change_previous_qtt_state(JSON.parse(parsedPrev_QTT)));
		}

	if (Init_data_PREV_TONS) {
		const parsedPrev_TONS = JSON.parse(Init_data_PREV_TONS);
			// store.dispatch(DataAction.load_previous_tons_state(JSON.parse(Init_data_PREV_TONS)));
		store.dispatch(DataAction.change_previous_tons_state(JSON.parse(parsedPrev_TONS)));
		}

	if (Init_data_MAXI_TONS) {
			const parsedMaxi = JSON.parse(Init_data_MAXI_TONS); 
				// store.dispatch(DataAction.load_maxi_tons_state(JSON.parse(Init_data_MAXI_TONS)));
			store.dispatch(DataAction.change_maxi_tons_state(JSON.parse(parsedMaxi)));
		} 

 */
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

	affectation.map((affectationItem) => {
				const destination = affectationItem.name;
				if (destination === "stock") {
				} else {
					
					// let destinationValue:string = "false";
					if(Init_data_CHECK_BOX === null || Init_data_CHECK_BOX === undefined) {
						store.dispatch(DataAction.change_checkbox_state({[destination]: false}));
						window.localStorage.setItem("CHECKBOX_data_storage", JSON.stringify({[destination]: false}));
						} else {
							const parsedCheckboxState = JSON.parse(Init_data_CHECK_BOX);
							// let  default_destination_Value: boolean = false;
							parsedCheckboxState[destination] = false;
							
							store.dispatch(DataAction.change_checkbox_state(parsedCheckboxState));
							window.localStorage.setItem("CHECKBOX_data_storage", JSON.stringify(parsedCheckboxState));	
						}
					///////////////////////////////////////////////////////////////////////////////////////////////////
						if (Init_data_PREV_QTT === null || Init_data_PREV_QTT === undefined) {
							store.dispatch(DataAction.change_previous_qtt_state({ [destination]: "0" }));
							window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify({ [destination]: 0 }));
						} else {
							const parsedPrev_QTT = JSON.parse(Init_data_PREV_QTT);
							let destinationValue = parsedPrev_QTT[destination];
						
							if (destinationValue === undefined || destinationValue === null) {
							destinationValue = "0";
							}
						
							// Ajouter la destination au lieu de la remplacer
							const updatedPrev_QTT = { ...parsedPrev_QTT, [destination]: destinationValue };
						
							store.dispatch(DataAction.change_previous_qtt_state(updatedPrev_QTT));
							window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify(updatedPrev_QTT));
						}
						
					// if(Init_data_PREV_QTT === null || Init_data_PREV_QTT === undefined) {
					// 	store.dispatch(DataAction.change_previous_qtt_state({[destination]: "0"}));
					// 	window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify({[destination]: 0}));
					// } else {
					// 	const parsedPrev_QTT = JSON.parse(Init_data_PREV_QTT);
					// 	let destinationValue = parsedPrev_QTT[destination];
					// 	if (destinationValue === undefined || destinationValue === null) {
					// 		destinationValue = "0";
					// 	}
					// 	store.dispatch(DataAction.change_previous_qtt_state({[destination]: destinationValue}));
					// 	window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify({[destination]: destinationValue}));
					// 	// window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify(parsedPrev_QTT));	
					// }

					///////////////////////////////////////////////////////////////////////////////////////////////////
					// if(Init_data_PREV_QTT) {
					// 	const parsedPrev_QTT = JSON.parse(Init_data_PREV_QTT);
					// 	let destinationValue = parsedPrev_QTT[destination];
					// 	store.dispatch(DataAction.change_previous_qtt_state({[destination]: destinationValue}));
					// 	// window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify({[destination]: parsedPrev_QTT[destination]}));
					// }


					if(Init_data_PREV_TONS) {
						const parsedPrev_TONS = JSON.parse(Init_data_PREV_TONS);
						const destinationValue = parsedPrev_TONS[destination];
						store.dispatch(DataAction.change_previous_tons_state({[destination]: destinationValue}));
						// window.localStorage.setItem("PREV_TONS_data_storage", JSON.stringify({[destination]: parsedPrev_TONS[destination]}));
					}

					if(Init_data_MAXI_TONS) {
						const parsedMaxi = JSON.parse(Init_data_MAXI_TONS);
						const destinationValue = parsedMaxi[destination];
						store.dispatch(DataAction.change_maxi_tons_state({[destination]: destinationValue}));
						// window.localStorage.setItem("MAXI_TONS_data_storage", JSON.stringify({[destination]: parsedMaxi[destination]}));
					}
				}
			});

		setInterval(() => {
				store.dispatch(DataAction.save_catalog());
				store.dispatch(DataAction.save_checkbox_storage()); //avec checkbox fait planter le navigateur ?
				store.dispatch(DataAction.save_string_checkbox_state()); 

				store.dispatch(DataAction.save_previous_qtt());
				store.dispatch(DataAction.save_previous_tons());
				store.dispatch(DataAction.save_maxi_tons());


				// affectation.map((affectationItem) => {
				// 	const k = affectationItem.name;
				// 	if (k === "stock") {
				// 	} else {
				// 	// store.dispatch(DataAction.change_CHECKBOX_STATE({ key: k, value: false }));
				// 	// store.dispatch(DataAction.change_previous_qtt_state({ destination: k, value: 0 }));
				// 	// store.dispatch(DataAction.change_previous_tons_state({ destination: k, value: 0 }));
				// 	// store.dispatch(DataAction.change_maxi_tons_state({ destination: k, value: 1000 }));
				// 	}
				// });
			toast.warning('AutoSave', { position: toast.POSITION.BOTTOM_LEFT, autoClose: 500 })
		}, 
		backupInterval);
}

init();

function App() {
	useLeavePageConfirm(true);
	return (
			<Provider store={store}>
				<Header />
				<Main />
			</Provider>
	);
}

export default App;
