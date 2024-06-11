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
	// const Init_tallyDATAS = window.localStorage.getItem("local_tally");
	// if(Init_tallyDATAS) {
	// 	store.dispatch(DataAction.loaded_tally(Init_tallyDATAS));
	// 	}
	
	const Init_tally_checkbox = window.localStorage.getItem("local_chkbox");
	if(Init_tally_checkbox) {
		store.dispatch(DataAction.load_checkbox_state(Init_tally_checkbox));
		}

	const Init_tally_punits = window.localStorage.getItem("local_pqtt");
	if(Init_tally_punits) {
		store.dispatch(DataAction.load_previous_qtt(Init_tally_punits));
		}

	const Init_tally_tons = window.localStorage.getItem("local_tons");
	if(Init_tally_tons) {
		store.dispatch(DataAction.load_previous_tons(Init_tally_tons));
		}

	const Init_tally_maxi = window.localStorage.getItem("local_maxi");
	if(Init_tally_maxi) {
		store.dispatch(DataAction.load_maxi_tons(Init_tally_maxi));
		}
	
		const Init_Extended = window.localStorage.getItem("local_Ext");
		if(Init_Extended) {
			store.dispatch(DataAction.load_Extended(Init_Extended));
			}

	setInterval(() => {
		// store.dispatch(DataAction.save_tally());
		store.dispatch(DataAction.save_extended())
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
