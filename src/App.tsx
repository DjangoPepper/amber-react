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

function int_all() {
	toast.info('INT_aLL', { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 5000 })
	
	const Init_catalogDATAS = window.localStorage.getItem("local_catalog");
	if(Init_catalogDATAS) {
		store.dispatch(DataAction.loaded_catalog(Init_catalogDATAS));

		}
	
	const Init_checkbox_state = window.localStorage.getItem("local_checkbox");
	if(Init_checkbox_state) {
		store.dispatch(DataAction.load_checkbox_state(Init_checkbox_state));
		}
	
	const Init_previous_qtt = window.localStorage.getItem("local_punit");
	if(Init_previous_qtt) {
		store.dispatch(DataAction.load_previous_qtt(Init_previous_qtt));
		}
	
	// const Init_previous_tons = window.localStorage.getItem("local_previous_tons");
	const Init_previous_tons = window.localStorage.getItem("local_pkilos");
	if(Init_previous_tons) {
		store.dispatch(DataAction.load_previous_tons(Init_previous_tons));
		}
	
	const Init_maxi_tons = window.localStorage.getItem("local_maxi");
	if(Init_maxi_tons) {
		store.dispatch(DataAction.load_maxi_tons(Init_maxi_tons));
		}

	setInterval(() => {
		store.dispatch(DataAction.save_catalog());
		store.dispatch(DataAction.save_checkbox_state());
		store.dispatch(DataAction.save_previous_qtt_state());
		store.dispatch(DataAction.save_previous_tons_state());
		store.dispatch(DataAction.save_maximum_tons_state());
		toast.warning('AutoSave catalog', { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 500 })
		}, 
	backupInterval);
	}

// function init_tally(){
// 	// const Init_tallyDATAS = window.localStorage.getItem("local_tally");
// 	// if(Init_tallyDATAS) {
// 	// 	store.dispatch(DataAction.loaded_tally(Init_tallyDATAS));
// 	// 	}
	
// 	const Init_checkbox_state = window.localStorage.getItem("local_checkbox_state");
// 	if(Init_checkbox_state) {
// 		store.dispatch(DataAction.load_checkbox_state(Init_checkbox_state));
// 		}
		
// 	setInterval(() => {
// 		store.dispatch(DataAction.save_tally());
// 		store.dispatch(DataAction.save_checkbox_state());
// 		store.dispatch(DataAction.save_previous_qtt_state());
// 		store.dispatch(DataAction.save_previous_tons_state());
// 		store.dispatch(DataAction.save_maxi_tons());
// 		toast.warning('AutoSave tally', { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 500 })
// 	}, 
// 	backupInterval);
// }

int_all();
// init_tally();

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
