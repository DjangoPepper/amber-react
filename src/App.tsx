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
// import { affectation } from './utils/destination';
// import { toast, ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';


let backupInterval = 30 * 1000; //30 * 1000 ms = 30s
// let firstRender = false;

function init_cata() {	
	const Init_catalogDATAS = window.localStorage.getItem("local_catalog");
	if(Init_catalogDATAS) {
		store.dispatch(DataAction.loaded_catalog(Init_catalogDATAS));
		}
	setInterval(() => {
		store.dispatch(DataAction.save_catalog());
		// store.dispatch(DataAction.save_checkbox_state());
		// store.dispatch(DataAction.save_previous_qtt());
		// store.dispatch(DataAction.save_previous_tons());
		// store.dispatch(DataAction.save_maxi_tons());
		toast.warning('AutoSave catalog', { position: toast.POSITION.BOTTOM_LEFT, autoClose: 500 })
		}, 
	backupInterval);
	}

function init_tally(){
	const Init_tallyDATAS = window.localStorage.getItem("local_tally");
	if(Init_tallyDATAS) {
		store.dispatch(DataAction.loaded_tally(Init_tallyDATAS));
		}
		
	setInterval(() => {
		store.dispatch(DataAction.save_tally());
		store.dispatch(DataAction.save_checkbox_state());
		store.dispatch(DataAction.save_previous_qtt());
		store.dispatch(DataAction.save_previous_tons());
		store.dispatch(DataAction.save_maxi_tons());
		toast.warning('AutoSave tally', { position: toast.POSITION.BOTTOM_LEFT, autoClose: 500 })
	}, 
	backupInterval);
}

init_cata();
init_tally();

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
