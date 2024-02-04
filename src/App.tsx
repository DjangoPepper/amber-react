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
	// Récupération	du local storage	
	const Init_data_catalog = window.localStorage.getItem("CATALOG_data_storage");
	let Init_data_CHECK_BOX = window.localStorage.getItem("CHECKBOX_data_storage");
	let Init_data_PREV_QTT  = window.localStorage.getItem("PREV_QTT_data_storage");
	let Init_data_PREV_TONS = window.localStorage.getItem("PREV_TONS_data_storage");
	let Init_data_MAXI_TONS = window.localStorage.getItem("MAXI_TONS_data_storage");

	// Enregistrement du catalog dans le state
	if (Init_data_catalog) {
			store.dispatch(DataAction.load_catalog(Init_data_catalog));
		}
	
		// Création des listes vides
		let EMPTYCheck_BOX = affectation.map(item => ({ [item.name]: false }));
		let EmptyPrev_QTT = affectation.map(item => ({ [item.name]: "0" }));
		let EmptyPrev_TONS = affectation.map(item => ({ [item.name]: "0" }));
		let EmptyMaxi_TONS = affectation.map(item => ({ [item.name]: "0" }));


		


		
		
		// let EmptyMaxi_TONS = affectation.map(item => ({ [String(item.name)]: "0" }));
		// let EmptyMaxi_TONS = affectation.map(item => ({ [String(item.name)]: "false" }));
		// let EmptyMaxi_TONS = affectation.map(item => ({ [item.name.toString()]: "0" }));
		// let EmptyMaxi_TONS = affectation.map(item => ({ ["" + item.name + "" ]: "0" }));

		// if (Init_data_CHECK_BOX) {
		// 	// Vérifiez si Init_data_CHECK_BOX est une chaîne JSON valide
		// 	try {
		// 		const parsedCheckboxState = JSON.parse(Init_data_CHECK_BOX);
		// 		EMPTYCheck_BOX = parsedCheckboxState;
		// 	} catch (error) {
		// 		console.error("Erreur de parsing JSON pour Init_data_CHECK_BOX :", error);
		// 	}
		// }
		

		// let defaultCheckboxState = affectation.map(item => ({ name: item.name, defaut_checked_box: false }));
		// Init_data_CHECK_BOX = JSON.stringify(defaultCheckboxState);
		
		// let updatedCheckboxState = affectation.map(item => (
		// 	item.defaut_checked_box !== undefined ? item.defaut_checked_box : false
		// ));

/* 
	//
	if (Init_data_CHECK_BOX) {
		// const parsedCheckboxState = JSON.parse(Init_data_CHECK_BOX);
		// store.dispatch(DataAction.change_checkbox_state(JSON.parse(parsedCheckboxState)));
		// store.dispatch(DataAction.change_checkbox_state(parsedCheckboxState));
		} else {
				const defaultCheckboxState = affectation.map(item => ({ name: item.name, defaut_checked_box: item.defaut_checked_box }));
				Init_data_CHECK_BOX = JSON.stringify(defaultCheckboxState);
				// const parsedCheckboxState = JSON.parse(Init_data_CHECK_BOX);
				// store.dispatch(DataAction.change_checkbox_state(parsedCheckboxState));
		}
	//
 */

/* 	// if (Init_data_CHECK_BOX) {
	// 	// Vérifiez si Init_data_CHECK_BOX est une chaîne JSON valide
	// 	try {
	// 		const parsedCheckboxState = JSON.parse(Init_data_CHECK_BOX);
	
	// 		// Vérifiez chaque couple name: etat et créez-le avec la valeur par défaut si nécessaire
	// 		const updatedCheckboxState = parsedCheckboxState.map(item => ({
	// 			name: item.name,
	// 			defaut_checked_box: item.defaut_checked_box !== undefined ? item.defaut_checked_box : false,
	// 		}));
	
	// 		// Mettez à jour Init_data_CHECK_BOX avec le nouveau tableau d'objets
	// 		Init_data_CHECK_BOX = JSON.stringify(updatedCheckboxState);
	
	// 		// Utilisez store.dispatch pour mettre à jour l'état dans votre application Redux si nécessaire
	// 		// store.dispatch(DataAction.change_checkbox_state(updatedCheckboxState));
	// 	} catch (error) {
	// 		// Gérez les erreurs de parsing JSON
	// 		console.error("Erreur de parsing JSON pour Init_data_CHECK_BOX :", error);
	// 		// const defaultCheckboxState = affectation.map(item => ({ name: item.name, defaut_checked_box: false }));
	// 		const defaultCheckboxState = affectation.map(item => ({ name: item.name, defaut_checked_box: false }));
	// 		Init_data_CHECK_BOX = JSON.stringify(defaultCheckboxState);
	// 	}
	// } else {
	// 	// Créez Init_data_CHECK_BOX avec la valeur par défaut
	// 	const defaultCheckboxState = affectation.map(item => ({ name: item.name, defaut_checked_box: false }));
	// 	Init_data_CHECK_BOX = JSON.stringify(defaultCheckboxState);
	
	// 	// Utilisez store.dispatch pour mettre à jour l'état dans votre application Redux si nécessaire
	// 	// store.dispatch(DataAction.change_checkbox_state(defaultCheckboxState));
	// } */
	
	// if (Init_data_CHECK_BOX) {
	// 	// Vérifiez si Init_data_CHECK_BOX est une chaîne JSON valide
	// 	try {
	// 		const parsedCheckboxState = JSON.parse(Init_data_CHECK_BOX);
	
	// 		// Vérifiez chaque objet dans le tableau et assurez-vous que la propriété "defaut_checked_box" est définie
	// 		const updatedCheckboxState = parsedCheckboxState.map(item => ({
	// 			name: item.name,
	// 			defaut_checked_box: item.defaut_checked_box !== undefined ? item.defaut_checked_box : false,
	// 		}));
	
	// 		// Mettez à jour Init_data_CHECK_BOX avec le nouveau tableau d'objets
	// 		Init_data_CHECK_BOX = JSON.stringify(updatedCheckboxState);
	
	// 		// Utilisez store.dispatch pour mettre à jour l'état dans votre application Redux si nécessaire
	// 		// store.dispatch(DataAction.change_checkbox_state(updatedCheckboxState));
	// 	} catch (error) {
	// 		// Gérez les erreurs de parsing JSON
	// 		console.error("Erreur de parsing JSON pour Init_data_CHECK_BOX :", error);
	// 	}
	// } else {
	// 	// Créez Init_data_CHECK_BOX avec la valeur par défaut
	// 	const defaultCheckboxState = affectation.map(item => ({ name: item.name, defaut_checked_box: false }));
	// 	Init_data_CHECK_BOX = JSON.stringify(defaultCheckboxState);
	
	// 	// Utilisez store.dispatch pour mettre à jour l'état dans votre application Redux si nécessaire
	// 	// store.dispatch(DataAction.change_checkbox_state(defaultCheckboxState));
	// }
	
	
	// if (Init_data_CHECK_BOX && Init_data_CHECK_BOX.trim() !== '{}' && isValidJson(Init_data_CHECK_BOX)) {
	// 	try {
	// 		const parsedCheckboxState = JSON.parse(Init_data_CHECK_BOX);
	
	// 		// Vérifiez si parsedCheckboxState est un tableau non vide
	// 		if (Array.isArray(parsedCheckboxState) && parsedCheckboxState.length > 0) {
	// 			// Vérifiez chaque objet dans le tableau et assurez-vous que la propriété "defaut_checked_box" est définie
	// 			// const updatedCheckboxState = parsedCheckboxState.map(item => ({
	// 			// 	name: item.name,
	// 			// 	defaut_checked_box: item.defaut_checked_box !== undefined ? item.defaut_checked_box : false,
	// 			// }));
	// 			const updatedCheckboxState = parsedCheckboxState.map(item => (
	// 				item.defaut_checked_box !== undefined ? item.defaut_checked_box : false
	// 			));
				
	
	// 			// Mettez à jour Init_data_CHECK_BOX avec le nouveau tableau d'objets
	// 			Init_data_CHECK_BOX = JSON.stringify(updatedCheckboxState);
	
	// 			// Utilisez store.dispatch pour mettre à jour l'état dans votre application Redux si nécessaire
	// 			// store.dispatch(DataAction.change_checkbox_state(updatedCheckboxState));
	// 		} else {
	// 			console.error("Le JSON parsé n'est pas un tableau non vide.");
	// 		}
	// 	} catch (error) {
	// 		// Gérez les erreurs de parsing JSON
	// 		console.error("Erreur de parsing JSON pour Init_data_CHECK_BOX :", error);
	// 	}
	// } else {
	// 	// Créez Init_data_CHECK_BOX avec la valeur par défaut
	// 	const defaultCheckboxState = affectation.map(item => ({ name: item.name, defaut_checked_box: false }));
	// 	Init_data_CHECK_BOX = JSON.stringify(defaultCheckboxState);
	
	// 	// Utilisez store.dispatch pour mettre à jour l'état dans votre application Redux si nécessaire
	// 	// store.dispatch(DataAction.change_checkbox_state(defaultCheckboxState));
	// }
	
	// Fonction utilitaire pour vérifier si une chaîne est une JSON valide
	// function isValidJson(str: string): boolean {
	// 	try {
	// 		JSON.parse(str);
	// 		return true;
	// 	} catch (e) {
	// 		return false;
	// 	}
	// }
	
	// if (Init_data_PREV_QTT) {
	// 	// const parsedPrev_QTT = JSON.parse(Init_data_PREV_QTT);
	// 	// store.dispatch(DataAction.change_previous_qtt_state(parsedPrev_QTT));
	// 	} else {
	// 			const defaultPrev_QTT = affectation.map(item => ({ name: item.name, prevQT_VALUE: item.previous_quantite }));
	// 			Init_data_PREV_QTT = JSON.stringify(defaultPrev_QTT);
	// 			// const parsedPrev_QTT = JSON.parse(Init_data_PREV_QTT);
	// 			// store.dispatch(DataAction.change_previous_qtt_state(parsedPrev_QTT));
	// 	}

	// if (Init_data_PREV_TONS) {
	// 	// const parsedPrev_TONS = JSON.parse(Init_data_PREV_TONS);
	// 	// store.dispatch(DataAction.change_previous_tons_state(parsedPrev_TONS));
	// 	} else {
	// 			const defaultPrev_TONS = affectation.map(item => ({ name: item.name, prevTO_VALUE: item.previous_tonnes }));
	// 			Init_data_PREV_TONS = JSON.stringify(defaultPrev_TONS);
	// 			// const parsedPrev_TONS = JSON.parse(Init_data_PREV_TONS);
	// 			// store.dispatch(DataAction.change_previous_tons_state(parsedPrev_TONS));
	// 	}

	// if (Init_data_MAXI_TONS) {
	// 	// const parsedMaxi = JSON.parse(Init_data_MAXI_TONS); 
	// 	// store.dispatch(DataAction.change_maxi_tons_state(parsedMaxi));
	// 	} else {
	// 			const defaultMaxi_TONS = affectation.map(item => ({ name: item.name, maxiTO_VALUE: item.maxis_tonnes }));
	// 			Init_data_MAXI_TONS = JSON.stringify(defaultMaxi_TONS);
	// 			// const parsedMaxi = JSON.parse(Init_data_MAXI_TONS);
	// 			// store.dispatch(DataAction.change_maxi_tons_state(parsedMaxi));
	// 	} 

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

	// affectation.map((affectationItem) => {
	// 			const destination = affectationItem.name;
	// 			if (destination === "stock") {
	// 			} else {
					
	// 				// let destinationValue:string = "false";
	// 				if(Init_data_CHECK_BOX === null || Init_data_CHECK_BOX === undefined) {
	// 					store.dispatch(DataAction.change_checkbox_state({[destination]: false}));
	// 					window.localStorage.setItem("CHECKBOX_data_storage", JSON.stringify({[destination]: false}));
	// 					} else {
	// 						const parsedCheckboxState = JSON.parse(Init_data_CHECK_BOX);
	// 						// let  default_destination_Value: boolean = false;
	// 						parsedCheckboxState[destination] = false;
							
	// 						store.dispatch(DataAction.change_checkbox_state(parsedCheckboxState));
	// 						window.localStorage.setItem("CHECKBOX_data_storage", JSON.stringify(parsedCheckboxState));	
	// 					}
	// 				///////////////////////////////////////////////////////////////////////////////////////////////////
	// 					if (Init_data_PREV_QTT === null || Init_data_PREV_QTT === undefined) {
	// 						store.dispatch(DataAction.change_previous_qtt_state({ [destination]: "0" }));
	// 						window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify({ [destination]: 0 }));
	// 					} else {
	// 						const parsedPrev_QTT = JSON.parse(Init_data_PREV_QTT);
	// 						let destinationValue = parsedPrev_QTT[destination];
						
	// 						if (destinationValue === undefined || destinationValue === null) {
	// 						destinationValue = "0";
	// 						}
						
	// 						// Ajouter la destination au lieu de la remplacer
	// 						const updatedPrev_QTT = { ...parsedPrev_QTT, [destination]: destinationValue };
						
	// 						store.dispatch(DataAction.change_previous_qtt_state(updatedPrev_QTT));
	// 						window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify(updatedPrev_QTT));
	// 					}
						
	// 				// if(Init_data_PREV_QTT === null || Init_data_PREV_QTT === undefined) {
	// 				// 	store.dispatch(DataAction.change_previous_qtt_state({[destination]: "0"}));
	// 				// 	window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify({[destination]: 0}));
	// 				// } else {
	// 				// 	const parsedPrev_QTT = JSON.parse(Init_data_PREV_QTT);
	// 				// 	let destinationValue = parsedPrev_QTT[destination];
	// 				// 	if (destinationValue === undefined || destinationValue === null) {
	// 				// 		destinationValue = "0";
	// 				// 	}
	// 				// 	store.dispatch(DataAction.change_previous_qtt_state({[destination]: destinationValue}));
	// 				// 	window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify({[destination]: destinationValue}));
	// 				// 	// window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify(parsedPrev_QTT));	
	// 				// }

	// 				///////////////////////////////////////////////////////////////////////////////////////////////////
	// 				// if(Init_data_PREV_QTT) {
	// 				// 	const parsedPrev_QTT = JSON.parse(Init_data_PREV_QTT);
	// 				// 	let destinationValue = parsedPrev_QTT[destination];
	// 				// 	store.dispatch(DataAction.change_previous_qtt_state({[destination]: destinationValue}));
	// 				// 	// window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify({[destination]: parsedPrev_QTT[destination]}));
	// 				// }


	// 				if(Init_data_PREV_TONS) {
	// 					const parsedPrev_TONS = JSON.parse(Init_data_PREV_TONS);
	// 					const destinationValue = parsedPrev_TONS[destination];
	// 					store.dispatch(DataAction.change_previous_tons_state({[destination]: destinationValue}));
	// 					// window.localStorage.setItem("PREV_TONS_data_storage", JSON.stringify({[destination]: parsedPrev_TONS[destination]}));
	// 				}

	// 				if(Init_data_MAXI_TONS) {
	// 					const parsedMaxi = JSON.parse(Init_data_MAXI_TONS);
	// 					const destinationValue = parsedMaxi[destination];
	// 					store.dispatch(DataAction.change_maxi_tons_state({[destination]: destinationValue}));
	// 					// window.localStorage.setItem("MAXI_TONS_data_storage", JSON.stringify({[destination]: parsedMaxi[destination]}));
	// 				}
	// 			}
	// 		});

		setInterval(() => {
				store.dispatch(DataAction.save_catalog());
				store.dispatch(DataAction.save_checkbox_storage()); //avec checkbox fait planter le navigateur ?
				store.dispatch(DataAction.save_checkbox_state()); 

				store.dispatch(DataAction.save_previous_qtt_storage());
				store.dispatch(DataAction.save_previous_tons_storage());
				store.dispatch(DataAction.save_maxi_tons_storage());


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

// init();

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
