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
	const Init_data_CHECKBOX_STATE = window.localStorage.getItem("CHECKBOX_data_storage");
	// const Init_data_STRING_CHECKBOX_STATE = window.localStorage.getItem("STRING_CHECKBOX_data_storage");
	const Init_data_PREV_QTT = window.localStorage.getItem("PREV_QTT_data_storage");
	const Init_data_PREV_TONS = window.localStorage.getItem("PREV_TONS_data_storage");
	const Init_data_MAXI = window.localStorage.getItem("MAXI_TONS_data_storage");

	if (Init_data_catalog) {
			// Si localStorage.getItem("data") existe, créez cet nouvel objet dans le state
			store.dispatch(DataAction.load_catalog(Init_data_catalog));
		}

	affectation.map((affectationItem) => {
				const destination = affectationItem.name;
				// const default_destinationValue: boolean = false;
				if (destination === "stock") {
				} else {
					// pour cahque destination differente de stock
					if (Init_data_CHECKBOX_STATE === null || Init_data_CHECKBOX_STATE === undefined) {
						// Si Init_data_CHECKBOX_STATE n'existe pas, créez un nouvel objet avec la nouvelle valeur par défaut (false)
						const newCheckboxState = { [destination]: false };
						store.dispatch(DataAction.change_checkbox_state(newCheckboxState));
						window.localStorage.setItem("CHECKBOX_data_storage", JSON.stringify(newCheckboxState));
					} else {
						// Si Init_data_CHECKBOX_STATE existe, récupérez l'état existant
						const parsedCheckboxState = JSON.parse(Init_data_CHECKBOX_STATE);
					
						// Vérifiez si la valeur existante est ni true ni false
						if (typeof parsedCheckboxState[destination] !== "boolean") {
							// Si la valeur n'est pas true ou false, définissez la valeur par défaut sur false
							parsedCheckboxState[destination] = false;
							// Ajoutez la nouvelle valeur à la propriété spécifiée
							// parsedCheckboxState[destination] = default_destinationValue;
						}

						// Mettez à jour l'état et le stockez (en tant que boolean, pas une chaîne)
						store.dispatch(DataAction.change_checkbox_state(parsedCheckboxState));
						window.localStorage.setItem("CHECKBOX_data_storage", JSON.stringify(parsedCheckboxState));
					}

					if (Init_data_PREV_QTT === null || Init_data_PREV_QTT === undefined){
						// Si Init_data_PREV_QTT n'existe pas, créez un nouvel objet avec la nouvelle valeur par défaut ici 0
						store.dispatch(DataAction.changePreviousQTT({ destination: destination, value: "0"}));
						window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify({[destination]: "0"}));
					} else {
						// Si Init_data_PREV_QTT existe, récupèrez l'état existant
						const parsedPrev_QTT = JSON.parse(Init_data_PREV_QTT);

						// Vérifiez si la valeur existe
						if (parsedPrev_QTT[destination] === null || parsedPrev_QTT[destination] === undefined) {
							// Si la valeur n'esxiste pas, définissez la valeur par défaut ici 0
							parsedPrev_QTT[destination] = "0";
							// Ajouter la nouvelle valeur à la proprièté spécifiée
							// parsedPrev_QTT[destination] = "0";
						}
						// Mettez à jour l'état et le stocker
						// store.dispatch(DataAction.changePreviousQTT({ destination: destination, value: "0"}));
						store.dispatch(DataAction.changePreviousQTT(parsedPrev_QTT[destination]));

						// window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify({[destination]: "0"}));
						window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify(parsedPrev_QTT[destination]));

					}
						// if(Init_data_PREV_QTT) {
						// 	const parsedPrev_QTT = JSON.parse(Init_data_PREV_QTT);
						// 	const destinationValue = parsedPrev_QTT[destination];
						// 	store.dispatch(DataAction.changePreviousQTT({[destination]: destinationValue}));
						// 	// window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify({[destination]: parsedPrev_QTT[destination]}));
						// }

						if(Init_data_PREV_TONS) {
							const parsedPrev_TONS = JSON.parse(Init_data_PREV_TONS);
							const destinationValue = parsedPrev_TONS[destination];
							store.dispatch(DataAction.changePreviousTONS({[destination]: destinationValue}));
							// window.localStorage.setItem("PREV_TONS_data_storage", JSON.stringify({[destination]: parsedPrev_TONS[destination]}));
						}

						if(Init_data_MAXI) {
							const parsedMaxi = JSON.parse(Init_data_MAXI);
							const destinationValue = parsedMaxi[destination];
							store.dispatch(DataAction.changeMaxiTONS({[destination]: destinationValue}));
							// window.localStorage.setItem("MAXI_TONS_data_storage", JSON.stringify({[destination]: parsedMaxi[destination]}));
						}
				}
			});

		setInterval(() => {
				store.dispatch(DataAction.save_catalog());
				store.dispatch(DataAction.save_checkbox_state()); //avec checkbox fait planter le navigateur ?
				store.dispatch(DataAction.save_string_checkbox_state()); 

				store.dispatch(DataAction.save_previous_qtt());
				store.dispatch(DataAction.save_previous_tons());
				store.dispatch(DataAction.save_maxi_tons());

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
