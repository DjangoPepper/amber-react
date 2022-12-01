import React from 'react';
import { Provider } from "react-redux";
import './styles/App.scss';
import Header from "./components/header";
import Main from "./components/main";
import {store} from "./stores/rootStore";

import { useLeavePageConfirm } from "./components/use-leave";
// export default function IndexPage() {
//     useLeavePageConfirm(true);
// }

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
