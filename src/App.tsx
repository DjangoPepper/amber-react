import React from 'react';
import { Provider } from "react-redux";

import './styles/App.scss';
import Header from "./components/header";
import Main from "./components/main";
import {store} from "./stores/rootStore";
import { useLeavePageConfirm } from "./components/use-leave";
import DataAction from "./stores/dataS/DataAction";
import { toast } from 'react-toastify';


let backupInterval = 60 * 1000; //30 * 1000 ms = 30s
// let firstRender = false;

function init() {
		
	// const Init_data_catalog = window.localStorage.getItem("data");
	const Init_data_catalog = window.localStorage.getItem("CATALOG_data_storage");
	const Init_data_CHECKBOX_STATE = window.localStorage.getItem("CHECKBOX_STATE_data_storage");
	const Init_data_PREV_QTT = window.localStorage.getItem("PREV_QTT_data_storage");
	const Init_data_PREV_TONS = window.localStorage.getItem("PREV_TONS_data_storage");
	const Init_data_MAXI = window.localStorage.getItem("MAXI_data_storage");

		if(Init_data_catalog) {
				store.dispatch(DataAction.load_catalog(Init_data_catalog));
			}

		if(Init_data_CHECKBOX_STATE) {
				store.dispatch(DataAction.load_checkbox_state(JSON.parse(Init_data_CHECKBOX_STATE)));
		}
		if(Init_data_PREV_QTT) {
				store.dispatch(DataAction.load_previous_qtt(JSON.parse(Init_data_PREV_QTT)));
		}
		if(Init_data_PREV_TONS) {
				store.dispatch(DataAction.load_previous_tons(JSON.parse(Init_data_PREV_TONS)));
		}
		if(Init_data_MAXI) {
				store.dispatch(DataAction.load_maxi_tons(JSON.parse(Init_data_MAXI)));
		} 
		// else {
		// 		// store.dispatch(DataAction.load_checkbox_state(Init_data_CHECKBOX_STATE));
		// 		// store.dispatch(DataAction.load_previous_qtt(Init_data_PREV_QTT));
		// 		// store.dispatch(DataAction.load_previous_tons(Init_data_PREV_TONS));
		// 		// store.dispatch(DataAction.load_maxi_tons(Init_data_MAXI));	

		// }
		setInterval(() => {
				store.dispatch(DataAction.save_catalog());
				// store.dispatch(DataAction.save_checkbox_state()); //savec checkbox fait planter le navigateur
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
