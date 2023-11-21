import React, {useEffect} from 'react';
import { Provider } from "react-redux";
import './styles/App.scss';
import Header from "./components/header";
import Main from "./components/main";
import {store} from "./stores/rootStore";
import { useLeavePageConfirm } from "./components/use-leave";
import DataAction from "./stores/dataS/DataAction";
import { affectation } from './utils/destination';

let backupInterval = 30 * 1000; //30 * 1000 ms = 30s

function init() {
    
  const Init_data_catalog = window.localStorage.getItem("data");
    if(Init_data_catalog) {
        store.dispatch(DataAction.load_catalog(Init_data_catalog));
    }
    affectation.map((affectationItem) => {
      const k = affectationItem.name;
      if (k === "stock") {
      } else {
          // const numericValue = parseFloat(k) || 0;
          // const statistics_array = statistics[affectationItem.name] || {}; //
          // store.dispatch(DataAction.load_previous_qtt({ destination: k, value: numericValue }));
          store.dispatch(DataAction.load_previous_qtt({ destination: k }));
          // store.dispatch(DataAction.load_previous_tons({ destination: k, value: numericValue }));
          store.dispatch(DataAction.load_previous_tons({ destination: k }));
          // store.dispatch(DataAction.load_maxis({ destination: k, value: numericValue }));
          store.dispatch(DataAction.load_maxis({ destination: k }));
        }
    });

    setInterval(() => {
        store.dispatch(DataAction.save_catalog());
        store.dispatch(DataAction.save_previous_qtt());
        store.dispatch(DataAction.save_previous_tons());
        store.dispatch(DataAction.save_maxis());
    }, backupInterval);
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
