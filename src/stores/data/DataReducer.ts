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
    selectedPrepa: string;
    loaded: boolean;
}

const initialState: DataState = {
    data: [],
    selectedCale: "Stock",
    selectedPrepa: "_",
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
            case DataAction.UPDATE_ROW:
                const currentRow = state.data.find(r => r.reference === action.payload.reference);
                if(!currentRow) return state;
                return {
                    ...state,
                    data: [
                        ...state.data.filter(r => r.reference !== action.payload.reference),
                        {...currentRow, [action.payload.columnId]: action.payload.value}
                    ]
                }
            case DataAction.CHANGE_PREPA:
                return {
                    ...state,
                    selectedPrepa: action.payload

                }
            default:
                return state;
        }
    };
