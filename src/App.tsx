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

let backupInterval = 60 * 1000; //30 * 1000 ms = 30s
// let firstRender = false;

function init() {
		
	// const Init_data_catalog = window.localStorage.getItem("data");
	const Init_data_catalog = window.localStorage.getItem("CATALOG_data_storage");
	const Init_data_CHECKBOX_STATE = window.localStorage.getItem("CHECKBOX_STATE_data_storage");
	const Init_data_STRING_CHECKBOX_STATE = window.localStorage.getItem("STRING_CHECKBOX_STATE_data_storage");
	const Init_data_PREV_QTT = window.localStorage.getItem("PREV_QTT_data_storage");
	const Init_data_PREV_TONS = window.localStorage.getItem("PREV_TONS_data_storage");
	const Init_data_MAXI = window.localStorage.getItem("MAXI_data_storage");

	if(Init_data_catalog) {
			store.dispatch(DataAction.load_catalog(Init_data_catalog));
		}
	/* 
			// if(Init_data_CHECKBOX_STATE) {
			// 		store.dispatch(DataAction.load_checkbox_state(JSON.parse(Init_data_CHECKBOX_STATE)));
			// 		// store.dispatch(DataAction.change_checkbox_state());
			// }
	*/		
	affectation.map((affectationItem) => {
		const k = affectationItem.name;
		if (k === "stock") {
		} else {
		// store.dispatch(DataAction.change_CHECKBOX_STATE({ key: k, value: false }));
		// store.dispatch(DataAction.changePreviousQTT({ destination: k, value: 0 }));
		// store.dispatch(DataAction.changePreviousTONS({ destination: k, value: 0 }));
		// store.dispatch(DataAction.changeMaxiTONS({ destination: k, value: 1000 }));

		// if (Init_data_STRING_CHECKBOX_STATE) {
		// 	const parsedStringCheckboxState = JSON.parse(Init_data_STRING_CHECKBOX_STATE);
		// 	//
		// 	store.dispatch(DataAction.change_checkbox_state(parsedStringCheckboxState));
		// }

		// if(Init_data_CHECKBOX_STATE) {
		// 		const parsedCheckboxState = JSON.parse(Init_data_CHECKBOX_STATE);
		// 		// store.dispatch(DataAction.load_checkbox_state(JSON.parse(Init_data_CHECKBOX_STATE)));
		// 		store.dispatch(DataAction.change_checkbox_state(JSON.parse(parsedCheckboxState)));
		// }
		/* 		// if(Init_data_PREV_QTT) {
				// 		const parsedPrev_QTT = JSON.parse(Init_data_PREV_QTT);
				// 		// store.dispatch(DataAction.load_previous_qtt(JSON.parse(Init_data_PREV_QTT)));
				// 		store.dispatch(DataAction.changePreviousQTT(JSON.parse(parsedPrev_QTT)));
				// }
				*/
		/* 
		if (Init_data_PREV_QTT) {
			const parsedPrevQTT = JSON.parse(Init_data_PREV_QTT);
		
			const qttEntries = Object.entries(parsedPrevQTT);
			const qttPayload = qttEntries.reduce((acc, [key, value]) => {
				// Supprimez les espaces indésirables autour de la valeur
				const trimmedValue = value.trim();
				// Ajoutez la paire clé-valeur au payload
				acc[key] = trimmedValue;
				return acc;
			}, {});

			store.dispatch(DataAction.changePreviousQTT(qttPayload));
		}
		*/
		// Assurez-vous d'importer le type approprié depuis votre code
		// Si DataAction.CHANGE_PREVIOUS_QTT est défini quelque part, assurez-vous de l'importer ici.
		// Exemple d'import : import { DataAction } from 'chemin/vers/votre/module';

		// public static changePreviousQTT(changeqtt: { [destination: string]: string }): AnyAction {
		// 	return { type: DataAction.CHANGE_PREVIOUS_QTT, payload: changeqtt };
		// }
		// type ChangePreviousQTTAction = {
		// 	type: typeof DataAction.CHANGE_PREVIOUS_QTT;
		// 	payload: { [destination: string]: string };
		// };

		// ...

		// if (Init_data_PREV_QTT) {
		//     const parsedPrevQTT = JSON.parse(Init_data_PREV_QTT);

		//     const qttEntries = Object.entries(parsedPrevQTT);
		//     const qttPayload: { [destination: string]: string } = qttEntries.reduce((acc, [key, value]) => {
		//         acc[key] = value.trim() as string;
		//         return acc;
		//     }, {});

		//     // Utilisez l'annotation de type dans votre action
		//     store.dispatch<ChangePreviousQTTAction>({
		//         type: DataAction.CHANGE_PREVIOUS_QTT,
		//         payload: qttPayload,
		//     });
		// }

		// if (Init_data_PREV_QTT) {
		//     const qttPayload: { [destination: string]: string } = JSON.parse(Init_data_PREV_QTT);

		const qttPayload: { [destination: string]: string } = JSON.parse(Init_data_PREV_QTT);
		const keyZ: string = "H1";  // Remplacez cela par la vraie valeur ou la logique pour obtenir keyZ

		// Obtenir toutes les paires clé-valeur de qttPayload sous forme de tableau
		const entries = Object.entries(qttPayload);

		// Filtrer les paires pour obtenir celle correspondant à keyZ
		const matchingEntry = entries.find(([key]) => key === keyZ);

		if (matchingEntry) {
			const [matchingKey, matchingValue] = matchingEntry;
			console.log(`La paire clé-valeur associée à ${keyZ} est : ${matchingKey}:${matchingValue}`);
		} else {
			console.log(`La clé ${keyZ} n'existe pas dans qttPayload.`);
		}


//     // Utilisez l'annotation de type dans votre action
//     store.dispatch<ChangePreviousQTTAction>({
//         type: DataAction.CHANGE_PREVIOUS_QTT,
//         payload: qttPayload,
//     });
// }



		if(Init_data_PREV_TONS) {
			const parsedPrev_TONS = JSON.parse(Init_data_PREV_TONS);
				// store.dispatch(DataAction.load_previous_tons(JSON.parse(Init_data_PREV_TONS)));
			store.dispatch(DataAction.changePreviousTONS(JSON.parse(parsedPrev_TONS)));
		}
		if(Init_data_MAXI) {
			const parsedMaxi = JSON.parse(Init_data_MAXI); 
				// store.dispatch(DataAction.load_maxi_tons(JSON.parse(Init_data_MAXI)));
			store.dispatch(DataAction.changeMaxiTONS(JSON.parse(parsedMaxi)));
		} 
		// else {
		// 		// store.dispatch(DataAction.load_maxi_tons(Init_data_MAXI));	
		// }
		} //else
	}); //affectation

		setInterval(() => {
				store.dispatch(DataAction.save_catalog());
				store.dispatch(DataAction.save_checkbox_state()); //avec checkbox fait planter le navigateur ?
				store.dispatch(DataAction.save_string_checkbox_state()); 

				store.dispatch(DataAction.save_previous_qtt());
				store.dispatch(DataAction.save_previous_tons());
				store.dispatch(DataAction.save_maxi_tons());


				// affectation.map((affectationItem) => {
				// 	const k = affectationItem.name;
				// 	if (k === "stock") {
				// 	} else {
				// 	// store.dispatch(DataAction.change_CHECKBOX_STATE({ key: k, value: false }));
				// 	// store.dispatch(DataAction.changePreviousQTT({ destination: k, value: 0 }));
				// 	// store.dispatch(DataAction.changePreviousTONS({ destination: k, value: 0 }));
				// 	// store.dispatch(DataAction.changeMaxiTONS({ destination: k, value: 1000 }));
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
