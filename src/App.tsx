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

function init_catalog() {		
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
				// store.dispatch(DataAction.save_checkbox_state());
				// store.dispatch(DataAction.save_previous_qtt());
				// store.dispatch(DataAction.save_previous_tons());
				// store.dispatch(DataAction.save_maxi_tons());
				toast.warning('AutoSave', { position: toast.POSITION.BOTTOM_LEFT, autoClose: 500 })
		}, 
		backupInterval);
		// affectation.map((affectationItem) => {
		// 	const k = affectationItem.name;
		// 	if (k === "stock") {
		// 	} else {
		// 		store.dispatch(DataAction.change_checkbox_state({ [k]: false }));
		// 		// store.dispatch(DataAction.load_checkbox_state)
		// 	}
		// });
	};

function init_tally() {
		const Init_data_tally = window.localStorage.getItem("tally");
		if(Init_data_tally!=null) {
				affectation.map((affectationItem) => {
					const k = affectationItem.name;
					// false pour checkbox
					store.dispatch(DataAction.set_checkbox({ [k]: false }));
					// 0 pour prevqtt,prevtons,maxitons
					store.dispatch(DataAction.set_prevqtt({ [k]: 0 }));
					store.dispatch(DataAction.set_prevtons({ [k]: 0 }));
					store.dispatch(DataAction.set_maxitons({ [k]: 0 }));
				});
		} else {
				// store.dispatch(DataAction.loaded_tally("0"));}			
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
