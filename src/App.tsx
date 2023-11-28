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
		
	const Init_data_catalog = window.localStorage.getItem("data");
		
		if(Init_data_catalog) {
				store.dispatch(DataAction.load_catalog(Init_data_catalog));
				// store.dispatch(DataAction.load_checkbox_state());
				// store.dispatch(DataAction.load_previous_qtt());
				// store.dispatch(DataAction.load_previous_tons());
				// store.dispatch(DataAction.load_maxi_tons());	

		}
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
