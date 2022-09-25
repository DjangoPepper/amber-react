import { combineReducers } from "@reduxjs/toolkit";
import {dataReducer} from "./data/DataReducer";

export const reducers = {
        data: dataReducer
    };

export default combineReducers(reducers);
