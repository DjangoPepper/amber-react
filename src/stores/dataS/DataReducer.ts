// 27
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
    loaded_catalog: boolean;
    saved_catalog: boolean;
    pickerColors: { [key: string]: string };
    
    HOLD_checkbox_state: { [destination: string]: boolean };
    HOLD_previous_QTT:   { [destinbation: string]: string };
    HOLD_previous_TONS:  { [destinbation: string]: string };
    HOLD_maxi_TONS_state:      { [destinbation: string]: string };
    
    loaded_HOLD_checkbox_state: boolean,
    loaded_HOLD_previous_QTT: boolean;
    loaded_HOLD_previous_TONS: boolean;
    loaded_HOLD_maxi_TONS: boolean;
    
    saved_HOLD_checkbox_state: boolean;
    saved_HOLD_previous_QTT: boolean;
    saved_HOLD_previous_TONS: boolean;
    saved_HOLD_maxi_TONS: boolean;
}

const initialState: DataState = {
    catalog_data_state: [],
    selectedCale: "stock",
    selectedPrepa: "_",
    loaded_catalog: false,
    saved_catalog: true,
    pickerColors: colors,
    
    HOLD_checkbox_state: {},
    HOLD_previous_QTT: {},
    HOLD_previous_TONS: {}, 
    HOLD_maxi_TONS_state: {},

    loaded_HOLD_checkbox_state: false,
    loaded_HOLD_previous_QTT: false,
    loaded_HOLD_previous_TONS: false,
    loaded_HOLD_maxi_TONS: false,
    
    saved_HOLD_checkbox_state: false,
    saved_HOLD_previous_QTT: false,
    saved_HOLD_previous_TONS: false,
    saved_HOLD_maxi_TONS: false,

};

export const dataReducer: Reducer<DataState> = (state = initialState, action: AnyAction): DataState => {
        switch (action.type) {
            case DataAction.IMPORT_DATA:
                return {
                    ...state,
                    catalog_data_state: action.payload,
                    loaded_catalog: true,
                    saved_catalog: false,
                };
            
            case DataAction.MOVE_ROW:
                const d = state.catalog_data_state.find(r => r.reference === action.payload);
                if(!d) return state;
                return {
                    ...state,
                    catalog_data_state: [...state.catalog_data_state.filter(r => r.reference !== action.payload), {...d, destination: state.selectedCale}],
                    saved_catalog: false,
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
                    saved_catalog: false,
                }
            case DataAction.CHANGE_PREPA:
                return {
                    ...state,
                    selectedPrepa: action.payload
                }
//
            case DataAction.CHANGE_STATE_CHECKBOX:
                return {
                    ...state,
                    HOLD_checkbox_state: {
                        ...state.HOLD_checkbox_state,
                        ...action.payload,
                        // [action.payload.destination]: action.payload.value
                    },
                };
            case DataAction.CHANGE_STATE_PREVIOUS_QTT:
                return {
                    ...state,
                    HOLD_previous_QTT: {
                        ...state.HOLD_previous_QTT,
                        // ...action.payload,
                        [action.payload.destination]: action.payload.value
                    },
                };
            case DataAction.CHANGE_STATE_PREVIOUS_TONS:
                return {
                    ...state,
                    HOLD_previous_TONS: {
                        ...state.HOLD_previous_TONS,
                        // ...action.payload,
                        [action.payload.destination]: action.payload.value
                    },
                };
            case DataAction.CHANGE_STATE_MAXI_TONS:
                return {
                    ...state,
                    HOLD_maxi_TONS_state: {
                        ...state.HOLD_maxi_TONS_state,
                        // ...action.payload,
                        [action.payload.destination]: action.payload.value
                    },
                };
//
            case DataAction.CHANGE_ORIGINAL_POS:
                return {
                    ...state,
                    selectedCale: action.payload,
                }
            case DataAction.CHANGE_CALE:
                return {
                ...state,
                selectedCale: action.payload,
                };

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
//
            case DataAction.SAVE_CATALOG_STORAGE:
                // if(state.saved_catalog) return state;
                // console.log("saving catalog...");
                window.localStorage.setItem("CATALOG_data_storage", JSON.stringify(state.catalog_data_state));
                return {
                    ...state,
                    saved_catalog: false
                };
            case DataAction.SAVE_STORAGE_CHECKED_BOX:
                // if(state.saved_HOLD_checkbox_state) return state;
                window.localStorage.setItem("CHECKBOX_data_storage", JSON.stringify(state.HOLD_checkbox_state));
                return {
                    ...state,
                    saved_HOLD_checkbox_state: false
                };
            case DataAction.SAVE_STORAGE_PREV_QTT:
                // if(state.saved_HOLD_previous_QTT) return state;
                window.localStorage.setItem("PREV_QTT_data_storage", JSON.stringify(state.HOLD_previous_QTT));
                return {
                    ...state,
                    saved_HOLD_previous_QTT: false
                }
            case DataAction.SAVE_STORAGE_PREV_TONS:
                // if(state.saved_HOLD_previous_TONS) return state;
                window.localStorage.setItem("PREV_TONS_data_storage", JSON.stringify(state.HOLD_previous_TONS));
                return {
                    ...state,
                    saved_HOLD_previous_TONS: false
                }
            case DataAction.SAVE_STORAGE_MAXI_TONS:
                // if(state.saved_HOLD_maxi_TONS) return state;
                window.localStorage.setItem("MAXI_TONS_data_storage", JSON.stringify(state.HOLD_maxi_TONS_state));
                return {
                    ...state,
                    // saved_HOLD_maxi_TONS: false
                }
//
            case DataAction.LOAD_CATALOG:
                return {
                    ...state,
                    catalog_data_state: action.payload,
                    loaded_catalog: true,
                    saved_catalog: false,
                }
            case DataAction.LOAD_CHECKBOX_STATE:
                return {
                    ...state,
                    HOLD_checkbox_state: action.payload,
                    loaded_HOLD_checkbox_state: true,
                    saved_HOLD_checkbox_state: false,
                };
            case DataAction.LOAD_PREV_QTT:
                return {
                    ...state,
                    HOLD_previous_QTT: action.payload,
                    loaded_HOLD_previous_QTT: true,
                    saved_HOLD_previous_QTT: false,
                };
            case DataAction.LOAD_PREV_TONS:
                return {
                    ...state,
                    HOLD_previous_TONS: action.payload,
                    loaded_HOLD_previous_TONS: true,
                    saved_HOLD_previous_TONS: false,
                };
            case DataAction.LOAD_MAXI_TONS:
                return {
                    ...state,
                    HOLD_maxi_TONS_state: action.payload,
                    loaded_HOLD_maxi_TONS: true,
                    saved_HOLD_maxi_TONS: false,
                }
//
//
            case DataAction.CLEAR:
                return {
                    ...state,
                    loaded_catalog: false,
                }

            default:
                return state;
        }
    };
export default dataReducer;