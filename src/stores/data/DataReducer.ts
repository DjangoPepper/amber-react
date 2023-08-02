import { AnyAction } from "redux";
import DataAction from "./DataAction";
import {Reducer} from "@reduxjs/toolkit";

export type Data = {
    rank: number
    prepa: string
    reference: string
    weight: number
    position: string
    destination: string
}

interface DataState {
    data: Data[];
    selectedCale: string;
    selectedPrepa: string;
    loaded: boolean;
    saved: boolean;
}

interface Statistics {
    [destination: string]: {
      count: number;
      weight: number;
    };
  }
  
const initialState: DataState = {
    data: [],
    selectedCale: "Stock",
    selectedPrepa: "_",
    loaded: false,
    saved: true
};

export const dataReducer: Reducer<DataState> = (state = initialState, action: AnyAction): DataState => {
        switch (action.type) {
            case DataAction.IMPORT_DATA:
                return {
                    ...state,
                    data: action.payload,
                    loaded: true,
                    saved: false,
                };
            case DataAction.CHANGE_CALE:
                return {
                    ...state,
                    selectedCale: action.payload,
                }
            case DataAction.CHANGE_ORIGINAL_POS:
                return {
                    ...state,
                    selectedCale: action.payload,
                }
            case DataAction.CHANGE_COULEUR:
                return {
                    ...state,
                    selectedCale: action.payload,
                }
            case DataAction.MOVE_ROW:
                const d = state.data.find(r => r.reference === action.payload);
                if(!d) return state;
                return {
                    ...state,
                    data: [...state.data.filter(r => r.reference !== action.payload), {...d, destination: state.selectedCale}],
                    saved: false,
                }
            case DataAction.UPDATE_ROW:
                const currentRow = state.data.find(r => r.reference === action.payload.reference);
                if(!currentRow) return state;
                return {
                    ...state,
                    data: [
                        ...state.data.filter(r => r.reference !== action.payload.reference),
                        {...currentRow, [action.payload.columnId]: action.payload.value}
                    ],
                    saved: false,
                }
            case DataAction.CHANGE_PREPA:
                return {
                    ...state,
                    selectedPrepa: action.payload

                }
            case DataAction.SAVE:
                if(state.saved) return state;
                console.log("saving...");
                window.localStorage.setItem("data", JSON.stringify(state.data));
                return {
                    ...state,
                    saved: false
                }
            case DataAction.LOAD:
                return {
                    ...state,
                    data: action.payload,
                    loaded: true,
                    saved: true,
                }
            case DataAction.CLEAR:
                return {
                    ...state,
                    loaded: false,
                }
            default:
                return state;
        }
    };
