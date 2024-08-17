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
		toast.warning('AutoSave catalog', { position: toast.POSITION.BOTTOM_LEFT, autoClose: 500 })
		}, 
	backupInterval);
	}

function init_tally(){
	// const Init_tallyDATAS = window.localStorage.getItem("local_tally");
	// if(Init_tallyDATAS) {
	// 	store.dispatch(DataAction.loaded_tally(Init_tallyDATAS));
	// 	}
	// const Init_TAllY_local_checkbox = window.localStorage.getItem("local_checkbox"); // check
	// if(Init_TAllY_local_checkbox) {
	// 	// store.dispatch(DataAction.loaded_checkbox(Init_TAllY_local_checkbox));
	// 	// store.dispatch(DataAction.load));
	// 	}
	const Init_TAllY_local_pchecks = window.localStorage.getItem("local_pchecks"); // check
	if(Init_TAllY_local_pchecks) {
		store.dispatch(DataAction.load_pchecks(Init_TAllY_local_pchecks));
		}

	const Init_TAllY_local_punits = window.localStorage.getItem("local_punits"); 
	if(Init_TAllY_local_punits) {
		store.dispatch(DataAction.load_punits(Init_TAllY_local_punits));
		}

	const Init_TAllY_local_pkilos = window.localStorage.getItem("local_pkilos");
	if(Init_TAllY_local_pkilos) {
		store.dispatch(DataAction.load_pkilos(Init_TAllY_local_pkilos));
		}

	const Init_TAllY_local_pmaxis = window.localStorage.getItem("local_pmaxis"); // check
	if(Init_TAllY_local_pmaxis) {
		store.dispatch(DataAction.load_pmaxis(Init_TAllY_local_pmaxis));
		}

	setInterval(() => {
		// store.dispatch(DataAction.save_tally());
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
