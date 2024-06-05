import { AnyAction } from "redux";
import DataAction from "./DataAction";
import {Reducer} from "@reduxjs/toolkit";
import { colors } from "../../utils/destination";

export type export_stepe_catalog_Data = {
    rank: number
    reference: string
    weight: number
    destination: string
    position: string
    prepa: string
}

export type export_stepe_tally_Data = {
    tally_Dest: number
    tally_PUnits: string
    tally_PKilos: number
    tally_Max: string
}

interface Interface_stepe_state {
    catalog_data_state: export_stepe_catalog_Data[];
    tally_data_state: export_stepe_tally_Data[];
    selectedCale: string;
    selectedPrepa: string;
    loaded_catalog_status: boolean;
    saved_catalog_status: boolean;
    pickerColors: { [key: string]: string };
    
    TAlly_HOLD_checkbox: { [destination: string]: boolean };
    TAlly_HOLD_previous_QTT:   { [destination: string]: string };
    TAlly_HOLD_previous_TONS:  { [destination: string]: string };
    TAlly_HOLD_maxi_TONS:      { [destination: string]: string };
    
    loaded_TAlly_HOLD_checkbox_status: boolean;
    loaded_TAlly_HOLD_previous_QTT_status: boolean;
    loaded_TAlly_HOLD_previous_TONS_status: boolean;
    loaded_TAlly_HOLD_maxi_TONS_status: boolean;
    
    saved_TAlly_HOLD_checkbox_status: boolean;
    saved_TAlly_HOLD_previous_QTT_status: boolean;
    saved_TAlly_HOLD_previous_TONS_status: boolean;
    saved_TAlly_HOLD_maxi_TONS_status: boolean;

    loaded_tally_status: boolean;
    saved_tally_status: boolean;
}

const initial_stepe_Data_State: Interface_stepe_state = {
    catalog_data_state: [],
    tally_data_state: [],
    selectedCale: "stock",
    selectedPrepa: "_",
    loaded_catalog_status: false,
    saved_catalog_status: true,
    pickerColors: colors,
    
    TAlly_HOLD_checkbox: {"H1": false, "H2": false, "H3": false, "H4": false, "H5": false, "H6": false, "H7": false, "H8": false, "H9": false, "H10": false},
    TAlly_HOLD_previous_QTT: {"H1": "0", "H2": "0", "H3": "0", "H4": "0", "H5": "0", "H6": "0", "H7": "0", "H8": "0", "H9": "0", "H10": "0"},
    TAlly_HOLD_previous_TONS: {"H1": "0", "H2": "0", "H3": "0", "H4": "0", "H5": "0", "H6": "0", "H7": "0", "H8": "0", "H9": "0", "H10": "0"}, 
    TAlly_HOLD_maxi_TONS: {"H1": "0", "H2": "0", "H3": "0", "H4": "0", "H5": "0", "H6": "0", "H7": "0", "H8": "0", "H9": "0", "H10": "0"},

    loaded_TAlly_HOLD_checkbox_status: false,
    loaded_TAlly_HOLD_previous_QTT_status: false,
    loaded_TAlly_HOLD_previous_TONS_status: false,
    loaded_TAlly_HOLD_maxi_TONS_status: false,

    saved_TAlly_HOLD_checkbox_status: false,
    saved_TAlly_HOLD_previous_QTT_status: false,
    saved_TAlly_HOLD_previous_TONS_status: false,
    saved_TAlly_HOLD_maxi_TONS_status: false,

    loaded_tally_status: false,
    saved_tally_status: true,
};

export const dataReducer: Reducer<Interface_stepe_state> = (state = initial_stepe_Data_State, action: AnyAction): Interface_stepe_state => {
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
            case DataAction.CHANGE_CHECKBOX_STATE:
                return {
                    ...state,
                    TAlly_HOLD_checkbox: {
                        ...state.TAlly_HOLD_checkbox,
                        ...action.payload,
                        // [action.payload.destination]: action.payload.value
                    },
                };
                

            case DataAction.CHANGE_PREVIOUS_QTT:
                return {
                    ...state,
                    TAlly_HOLD_previous_QTT: {
                        ...state.TAlly_HOLD_previous_QTT,
                        [action.payload.destination]: action.payload.value
                        // ...action.payload,
                    },
                };
            case DataAction.CHANGE_PREVIOUS_TONS:
                return {
                    ...state,
                    TAlly_HOLD_previous_TONS: {
                        ...state.TAlly_HOLD_previous_TONS,
                        [action.payload.destination]: action.payload.value
                        // ...action.payload,
                    },
                };
            case DataAction.CHANGE_MAXI_TONS:
                return {
                    ...state,
                    TAlly_HOLD_maxi_TONS: {
                        ...state.TAlly_HOLD_maxi_TONS,
                        [action.payload.destination]: action.payload.value
                        // ...action.payload,
                    },
                };
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
//**************************************************************************************************** */
            case DataAction.SAVE_CATALOG:
                if(state.saved_catalog_status) return state;
                // console.log("saving catalog...");
                // window.localStorage.setItem("local_catalog", JSON.stringify(state.catalog_data_state));
                window.localStorage.setItem("local_catalog", JSON.stringify(state.catalog_data_state));
                return {
                    ...state,
                    saved_catalog_status: false
                }
//**************************************************************************************************** */
            case DataAction.SAVE_TALLY:
                if(state.saved_tally_status) return state;
                // console.log("saving catalog...");
                window.localStorage.setItem("local_tally", JSON.stringify(state.tally_data_state));
                return {
                    ...state,
                    saved_tally_status: false
                }
//****************************************************************************************************
            case DataAction.SAVE_CHECKBOX_STATE:
                // if(state.saved_TAlly_HOLD_checkbox_status) return state;
                window.localStorage.setItem("local_checkbox", JSON.stringify(state.TAlly_HOLD_checkbox));
                state.saved_TAlly_HOLD_checkbox_status = true;
                return {
                    ...state,
                    saved_TAlly_HOLD_checkbox_status: false
                };
            case DataAction.SAVE_PREV_QTT:
                // if(state.saved_TAlly_HOLD_previous_QTT_status) return state;
                state.saved_TAlly_HOLD_previous_QTT_status = true;
                window.localStorage.setItem("local_punit", JSON.stringify(state.TAlly_HOLD_previous_QTT));
                return {
                    ...state,
                    saved_TAlly_HOLD_previous_QTT_status: false
                };
            case DataAction.SAVE_PREV_TONS:
                // if(state.saved_TAlly_HOLD_previous_TONS_status) return state;
                state.saved_TAlly_HOLD_previous_TONS_status = true;
                window.localStorage.setItem("local_pkilos", JSON.stringify(state.TAlly_HOLD_previous_TONS));
                return {
                    ...state,
                    saved_TAlly_HOLD_previous_TONS_status: false
                };
            case DataAction.SAVE_MAXI_TONS:
                // if(state.saved_TAlly_HOLD_maxi_TONS_status) return state;
                state.saved_TAlly_HOLD_maxi_TONS_status = true;
                window.localStorage.setItem("local_maxi", JSON.stringify(state.TAlly_HOLD_maxi_TONS));
                return {
                    ...state,
                    saved_TAlly_HOLD_maxi_TONS_status: false
                };
//**************************************************************************************************** */
            case DataAction.LOAD_CATALOG:
                return {
                    ...state,
                    catalog_data_state: action.payload,
                    loaded_catalog_status: true,
                    saved_catalog_status: true,
                }
//****************************************************************************************************
            case DataAction.LOAD_TALLY:
                return {
                    ...state,
                    catalog_data_state: action.payload,
                    loaded_tally_status: true,
                    saved_tally_status: true,
                }
//****************************************************************************************************
            case DataAction.LOAD_CHECKBOX_STATE:
                return {
                    ...state,
                    TAlly_HOLD_checkbox: action.payload,
                };
                case DataAction.LOAD_PREV_QTT:
                    return {
                        ...state,
                        TAlly_HOLD_previous_QTT: action.payload,
                    };
            case DataAction.LOAD_PREV_TONS:
                return {
                    ...state,
                    TAlly_HOLD_previous_TONS: action.payload,
                };
            case DataAction.LOAD_MAXI_TONS:
                return {
                    ...state,
                    TAlly_HOLD_maxi_TONS: action.payload,
                }
            case DataAction.CLEAR:
                return {
                    ...state,
                    loaded_catalog_status: false,
                }

            default:
                return state;
        }
    };
export default dataReducer;