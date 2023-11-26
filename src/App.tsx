import React, {useEffect} from 'react';
import { Provider, useSelector, useDispatch } from "react-redux";
import {RootState} from "./stores/rootStore";
import './styles/App.scss';
import Header from "./components/header";
import Main from "./components/main";
import {store} from "./stores/rootStore";
import { useLeavePageConfirm } from "./components/use-leave";
import DataAction from "./stores/dataS/DataAction";
import { affectation } from './utils/destination';
import { toast, ToastContainer } from 'react-toastify';


let backupInterval = 90 * 1000; //30 * 1000 ms = 30s
// let firstRender = false;

function init() {
		
	const Init_data_catalog = window.localStorage.getItem("data");
		
		if(Init_data_catalog) {
				store.dispatch(DataAction.load_catalog(Init_data_catalog));
		}
		setInterval(() => {
				store.dispatch(DataAction.save_catalog());
				
				affectation.map((affectationItem) => {
					const k = affectationItem.name;
					if (k === "stock") {
					} else {
					// store.dispatch(DataAction.change_CHECKBOX_STATE({ key: k, value: false }));
					// store.dispatch(DataAction.changePreviousQTT({ destination: k, value: 0 }));
					// store.dispatch(DataAction.changePreviousTONS({ destination: k, value: 0 }));
					// store.dispatch(DataAction.changeMaxiTONS({ destination: k, value: 1000 }));
					}
				});
			// toast.info('AutoSave', { position: toast.POSITION.TOP_RIGHT, autoClose: 500 })
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
