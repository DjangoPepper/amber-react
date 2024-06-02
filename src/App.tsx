import React from 'react';
import { Provider} from "react-redux";
import './styles/App.scss';
import Header from "./components/header";
import Main from "./components/main";
import {store} from "./stores/rootStore";
import { useLeavePageConfirm } from "./components/use-leave";
import DataAction from "./stores/dataS/DataAction";
import { affectation } from './utils/destination';
import { toast } from 'react-toastify';

let backupInterval = 30 * 1000; //30 * 1000 ms = 30s


function init_catalog() {		
	const Init_data_catalog = window.localStorage.getItem("data");
	if(Init_data_catalog) {
			store.dispatch(DataAction.loaded_catalog(Init_data_catalog));
		}		
	setInterval(() => {
			store.dispatch(DataAction.save_catalog());
			toast.warning('AutoSave', { position: toast.POSITION.BOTTOM_LEFT, autoClose: 500 })
	}, 
	backupInterval);
	};

function init_tally() {
	const Init_data_tally = window.localStorage.getItem("tally");
	if(Init_data_tally==null) {
		toast.warning ('No Tally found', { position: toast.POSITION.BOTTOM_LEFT, autoClose: 500 })
		affectation.map((affectationItem) => {
			const k = affectationItem.name;
			// false pour checkbox
			store.dispatch(DataAction.set_Tally_Hold_Checkbox(k, false));
			// 0 pour prevqtt,prevtons,maxitons
			store.dispatch(DataAction.set_Tally_Hold_Prevqtt( k, 0));
			store.dispatch(DataAction.set_Tally_Hold_Prevtons(k, 0));
			store.dispatch(DataAction.set_Tally_Hold_Maxitons(k, 0));
			});
		} else {
				toast.success('Previous Tally found', { position: toast.POSITION.BOTTOM_LEFT, autoClose: 500 })
		}
	};



init_catalog();
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
