import { combineReducers } from "@reduxjs/toolkit";
import {dataReducer} from "./dataS/DataReducer";

export const reducers = {
        dataSS: dataReducer
    };

export default combineReducers(reducers);
