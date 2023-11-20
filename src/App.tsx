import React, {useEffect} from 'react';
import { Provider } from "react-redux";
import './styles/App.scss';
import Header from "./components/header";
import Main from "./components/main";
import {store} from "./stores/rootStore";
import { useLeavePageConfirm } from "./components/use-leave";
import DataAction from "./stores/dataS/DataAction";

let backupInterval = 99 * 1000; //30 * 1000 ms = 30s

function init() {
    const data = window.localStorage.getItem("data");
    if(data) {
        store.dispatch(DataAction.load_catalog(data));
    }
    setInterval(() => {
        store.dispatch(DataAction.save_catalog());
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
