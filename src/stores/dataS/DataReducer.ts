import { AnyAction } from "redux";
import DataAction from "./DataAction";
import {Reducer} from "@reduxjs/toolkit";
import { colors } from "../../utils/destination";

export type stepe_Data = {
    rank: number
    reference: string
    weight: number
    destination: string
    position: string
    prepa: string
}

interface DataState {
    catalog_data_state: stepe_Data[];
    selectedCale: string;
    selectedPrepa: string;
    loaded_catalog_status: boolean;
    saved_catalog_status: boolean;
    pickerColors: { [key: string]: string };
}

const initialState: DataState = {
    catalog_data_state: [],
    selectedCale: "stock",
    selectedPrepa: "_",
    loaded_catalog_status: false,
    saved_catalog_status: true,
    pickerColors: colors,
};

export const dataReducer: Reducer<DataState> = (state = initialState, action: AnyAction): DataState => {
        switch (action.type) {
            case DataAction.IMPORT_DATA:
                return {
                    ...state,
                    catalog_data_state: action.payload,
                    loaded_catalog_status: true,
                    saved_catalog_status: false,
                };
            
            case DataAction.MOVE_ROW:
                const d = state.catalog_data_state.find(r => r.reference === action.payload);
                if(!d) return state;
                return {
                    ...state,
                    catalog_data_state: [...state.catalog_data_state.filter(r => r.reference !== action.payload), {...d, destination: state.selectedCale}],
                    saved_catalog_status: false,
                }
            case DataAction.UPDATE_ROW:
                const currentRow = state.catalog_data_state.find(r => r.reference === action.payload.reference);
                if(!currentRow) return state;
                return {
                    ...state,
                    catalog_data_state: [
                        ...state.catalog_data_state.filter(r => r.reference !== action.payload.reference),
                        {...currentRow, [action.payload.columnId]: action.payload.value}
                    ],
                    saved_catalog_status: false,
                }
            case DataAction.CHANGE_PREPA:
                return {
                    ...state,
                    selectedPrepa: action.payload
                }

            case DataAction.CHANGE_CALE:
                return {
                    ...state,
                    selectedCale: action.payload,
                };

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
            case DataAction.CHANGE_PICKCOLORS:                
                return {
                    ...state,
                    pickerColors: action.payload,
                }
            case DataAction.SAVE_CATALOG:
                if(state.saved_catalog_status) return state;
                window.localStorage.setItem("data", JSON.stringify(state.catalog_data_state));
                return {
                    ...state,
                    saved_catalog_status: false
                }

            case DataAction.LOAD_CATALOG:
                return {
                    ...state,
                    catalog_data_state: action.payload,
                    loaded_catalog_status: true,
                    saved_catalog_status: true,
                }

            case DataAction.CLEAR:
                return {
                    ...state,
                    loaded_catalog_status: false,
                }

            case DataAction.SET_TALLY_HOLD_CHECKBOX:
                return {
                    ...state,
                    // catalog_data_state: state.catalog_data_state.map((item) => {
                    catalog_data_state: state.catalog_data_state.map((item) => {
                        return {
                            ...item,
                            [action.payload.Tally_Hold]: action.payload.Tally_checkedBox
                        }
                    })
                }
            
            case DataAction.SET_TALLY_HOLD_PREVQTT:
                return {
                    ...state,
                    // catalog_data_state: state.catalog_data_state.map((item) => {
                    catalog_data_state: state.catalog_data_state.map((item) => {
                        return {
                            ...item,
                            [action.payload.Tally_Hold]: action.payload.value
                        }
                    })
                }    
            
            case DataAction.SET_TALLY_HOLD_MAXITONS:
                return {
                    ...state,
                    // catalog_data_state: state.catalog_data_state.map((item) => {
                    catalog_data_state: state.catalog_data_state.map((item) => {
                        return {
                            ...item,
                            [action.payload.Tally_Hold]: action.payload.value
                        }
                    })
                }

            default:
                return state;
        }
    };
export default dataReducer;