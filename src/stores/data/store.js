// store.js

import { configureStore } from '@reduxjs/toolkit';
import destinationReducer from './reducers/destinationReducer';

const store = configureStore({
  reducer: {
    destination: destinationReducer,
  },
});

export default store;
