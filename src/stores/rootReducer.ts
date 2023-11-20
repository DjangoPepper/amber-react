import { combineReducers } from "@reduxjs/toolkit";
import {dataReducer} from "./dataS/DataReducer";

export const reducers = {
        data: dataReducer
    };

export default combineReducers(reducers);
