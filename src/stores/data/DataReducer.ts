import { AnyAction } from "redux";
import DataAction from "./DataAction";
import {Reducer} from "@reduxjs/toolkit";

export type Data = {
    weight: number
    position: string
    prepa: number
    rank: number
    reference: string
    destination: string
}

interface DataState {
    data: Data[];
    selectedCale: string;
    loaded: boolean;
}

const initialState: DataState = {
    data: [],
    selectedCale: "Stock",
    loaded: false
};

export const dataReducer: Reducer<DataState> = (state = initialState, action: AnyAction): DataState => {
        switch (action.type) {
            case DataAction.IMPORT_DATA:
                return {
                    ...state,
                    data: action.payload,
                    loaded: true
                };
            case DataAction.CHANGE_CALE:
                return {
                    ...state,
                    selectedCale: action.payload
                }
            case DataAction.MOVE_ROW:
                const d = state.data.find(r => r.reference === action.payload);
                if(!d) return state;
                return {
                    ...state,
                    data: [...state.data.filter(r => r.reference !== action.payload), {...d, destination: state.selectedCale}]
                }
            default:
                return state;
        }
    };
