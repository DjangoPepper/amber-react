// import React, {useEffect} from 'react';
import { Provider } from "react-redux";
import './styles/App.scss';
import Header from "./components/header";
import Main from "./components/main";
import {store} from "./stores/rootStore";
import { useLeavePageConfirm } from "./components/use-leave";
import DataAction from "./stores/data/DataAction";

function init() {
    const data = window.localStorage.getItem("data");
    if(data) {
        store.dispatch(DataAction.load(data));
    }
    setInterval(() => {
        store.dispatch(DataAction.save());
    }, 30 * 1000);
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
