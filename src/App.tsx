// import React, {useEffect} from 'react';
import React from 'react';
// import { Provider, useSelector, useDispatch } from "react-redux";
import { Provider} from "react-redux";
// import {RootState} from "./stores/rootStore";
import './styles/App.scss';
import Header from "./components/header";
import Main from "./components/main";
import {store} from "./stores/rootStore";
import { useLeavePageConfirm } from "./components/use-leave";
import DataAction from "./stores/dataS/DataAction";
import { affectation } from './utils/destination';
// import { toast, ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';


let backupInterval = 30 * 1000; //30 * 1000 ms = 30s
// let firstRender = false;

function init() {
		
	const Init_data_catalog = window.localStorage.getItem("data");
		
		if(Init_data_catalog) {
				store.dispatch(DataAction.loaded_catalog(Init_data_catalog));
				// store.dispatch(DataAction.load_checkbox_state(Init_data_catalog));
				// store.dispatch(DataAction.load_previous_qtt(Init_data_catalog));
				// store.dispatch(DataAction.load_previous_tons(Init_data_catalog));
				// store.dispatch(DataAction.load_maxi_tons(Init_data_catalog));
		}
		
		setInterval(() => {
				store.dispatch(DataAction.save_catalog());
				store.dispatch(DataAction.save_checkbox_state());
				store.dispatch(DataAction.save_previous_qtt());
				store.dispatch(DataAction.save_previous_tons());
				store.dispatch(DataAction.save_maxi_tons());
				toast.warning('AutoSave', { position: toast.POSITION.BOTTOM_LEFT, autoClose: 500 })
		}, 
		backupInterval);
		
		toast.info('Init Tally', { position: toast.POSITION.TOP_LEFT, autoClose: 500 })
		affectation.map((affectationItem) => {
			const k = affectationItem.name;

			store.dispatch(DataAction.change_checkbox_state({ [k]: false }));
			// store.dispatch(DataAction.save_checkbox_state());

			// store.dispatch(DataAction.changePreviousQTT({ destination: k, value: "0" }));
			store.dispatch(DataAction.changePreviousQTT({ [k]: 0:Number }));
			// store.dispatch(DataAction.save_previous_qtt());
			
			// store.dispatch(DataAction.changePreviousTONS({ destination: k, value: "0" }));
			store.dispatch(DataAction.changePreviousTONS({ [k]: "0" }));
			// store.dispatch(DataAction.save_previous_tons());
			
			// store.dispatch(DataAction.changeMaxiTONS({ destination: k, value: "0" }));
			store.dispatch(DataAction.changeMaxiTONS({ [k]: "0" }));
			// store.dispatch(DataAction.save_maxi_tons());

			// if (k === "stock") {
			// } else {
			// 	store.dispatch(DataAction.change_checkbox_state({ [k]: false }));
			// 	// store.dispatch(DataAction.load_checkbox_state)
			// }

			//public static load_checkbox_state(data: string): AnyAction {
			// 	return { type: DataAction.LOAD_PREV_QTT, payload: JSON.parse(data) };
			// }

			// public static change_checkbox_state(changecheckboxstate: { [destination: string]: boolean }): AnyAction {
			// 	return { type: DataAction.CHANGE_CHECKBOX_STATE, payload: changecheckboxstate };
			// }

			// public static save_checkbox_state(): AnyAction {
			// 	return { type: DataAction.SAVE_CHECKBOX_STATE };
			// }
		});
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
