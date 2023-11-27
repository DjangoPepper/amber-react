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


let backupInterval = 90 * 1000; //30 * 1000 ms = 30s
// let firstRender = false;

function init() {
		
	const Init_data_catalog = window.localStorage.getItem("data");
		
		if(Init_data_catalog) {
				store.dispatch(DataAction.loaded_catalog(Init_data_catalog));
				store.dispatch(DataAction.load_checkbox_state(Init_data_catalog));
				store.dispatch(DataAction.load_previous_qtt(Init_data_catalog));
				store.dispatch(DataAction.load_previous_tons(Init_data_catalog));
				store.dispatch(DataAction.load_maxi_tons(Init_data_catalog));
		}
		
		setInterval(() => {
				store.dispatch(DataAction.save_catalog());
				store.dispatch(DataAction.save_checkbox_state());
				// store.dispatch(DataAction.save_previous_qtt());
				// store.dispatch(DataAction.save_previous_tons());
				// store.dispatch(DataAction.save_maxi_tons());

				toast.warning('AutoSave', { position: toast.POSITION.BOTTOM_LEFT, autoClose: 500 })
		}, 
		backupInterval);
		
		affectation.map((affectationItem) => {
			const k = affectationItem.name;
			if (k === "stock") {
			} else {
				store.dispatch(DataAction.change_checkbox_state({ [k]: false }));
				// store.dispatch(DataAction.load_checkbox_state)
			}
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
