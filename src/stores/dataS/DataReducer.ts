import { AnyAction } from "redux";
import DataAction from "./DataAction";
import {Reducer} from "@reduxjs/toolkit";
import { colors } from "../../utils/destination";

export type export_stepe_Data = {
    rank: number
    reference: string
    weight: number
    destination: string
    position: string
    prepa: string
}

interface Interface_stepe_state {
    catalog_data_state: export_stepe_Data[];
    selectedCale: string;
    selectedPrepa: string;
    loaded_catalog_status: boolean;
    saved_catalog_status: boolean;
    pickerColors: { [key: string]: string };
    
    HOLD_checkbox_state: { [destination: string]: boolean };
    HOLD_previous_QTT:   { [destination: string]: string };
    HOLD_previous_TONS:  { [destination: string]: string };
    HOLD_maxi_TONS:      { [destination: string]: string };
    
    loaded_HOLD_checkbox_state_status: boolean;
    loaded_HOLD_previous_QTT_status: boolean;
    loaded_HOLD_previous_TONS_status: boolean;
    loaded_HOLD_maxi_TONS_status: boolean;
    
    saved_HOLD_checkbox_state_status: boolean;
    saved_HOLD_previous_QTT_status: boolean;
    saved_HOLD_previous_TONS_status: boolean;
    saved_HOLD_maxi_TONS_status: boolean;

    loaded_tally_status: boolean;
    saved_tally_status: boolean;
}

const initial_stepe_Data_State: Interface_stepe_state = {
    catalog_data_state: [],
    selectedCale: "stock",
    selectedPrepa: "_",
    loaded_catalog_status: false,
    saved_catalog_status: true,
    pickerColors: colors,
    
    HOLD_checkbox_state: {"H1": false, "H2": false, "H3": false, "H4": false, "H5": false, "H6": false, "H7": false, "H8": false, "H9": false, "H10": false},
    HOLD_previous_QTT: {"H1": "0", "H2": "0", "H3": "0", "H4": "0", "H5": "0", "H6": "0", "H7": "0", "H8": "0", "H9": "0", "H10": "0"},
    HOLD_previous_TONS: {"H1": "0", "H2": "0", "H3": "0", "H4": "0", "H5": "0", "H6": "0", "H7": "0", "H8": "0", "H9": "0", "H10": "0"}, 
    HOLD_maxi_TONS: {"H1": "0", "H2": "0", "H3": "0", "H4": "0", "H5": "0", "H6": "0", "H7": "0", "H8": "0", "H9": "0", "H10": "0"},

    loaded_HOLD_checkbox_state_status: false,
    loaded_HOLD_previous_QTT_status: false,
    loaded_HOLD_previous_TONS_status: false,
    loaded_HOLD_maxi_TONS_status: false,

    saved_HOLD_checkbox_state_status: false,
    saved_HOLD_previous_QTT_status: false,
    saved_HOLD_previous_TONS_status: false,
    saved_HOLD_maxi_TONS_status: false,

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
                    HOLD_checkbox_state: {
                        ...state.HOLD_checkbox_state,
                        ...action.payload,
                        // [action.payload.destination]: action.payload.value
                    },
                };
                

            case DataAction.CHANGE_PREVIOUS_QTT:
                return {
                    ...state,
                    HOLD_previous_QTT: {
                        ...state.HOLD_previous_QTT,
                        [action.payload.destination]: action.payload.value
                        // ...action.payload,
                    },
                };
            case DataAction.CHANGE_PREVIOUS_TONS:
                return {
                    ...state,
                    HOLD_previous_TONS: {
                        ...state.HOLD_previous_TONS,
                        [action.payload.destination]: action.payload.value
                        // ...action.payload,
                    },
                };
            case DataAction.CHANGE_MAXI_TONS:
                return {
                    ...state,
                    HOLD_maxi_TONS: {
                        ...state.HOLD_maxi_TONS,
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
            case DataAction.SAVE_CATALOG:
                if(state.saved_catalog_status) return state;
                // console.log("saving catalog...");
                window.localStorage.setItem("data", JSON.stringify(state.catalog_data_state));
                return {
                    ...state,
                    saved_catalog_status: false
                }
            case DataAction.SAVE_CHECKBOX_STATE:
                // if(state.saved_HOLD_checkbox_state_status) return state;
                window.localStorage.setItem("local_checkbox", JSON.stringify(state.HOLD_checkbox_state));
                state.saved_HOLD_checkbox_state_status = true;
                return {
                    ...state,
                    saved_HOLD_checkbox_state_status: false
                };
            case DataAction.SAVE_PREV_QTT:
                // if(state.saved_HOLD_previous_QTT_status) return state;
                state.saved_HOLD_previous_QTT_status = true;
                window.localStorage.setItem("local_punit", JSON.stringify(state.HOLD_previous_QTT));
                return {
                    ...state,
                    saved_HOLD_previous_QTT_status: false
                };
            case DataAction.SAVE_PREV_TONS:
                // if(state.saved_HOLD_previous_TONS_status) return state;
                state.saved_HOLD_previous_TONS_status = true;
                window.localStorage.setItem("local_pkilos", JSON.stringify(state.HOLD_previous_TONS));
                return {
                    ...state,
                    saved_HOLD_previous_TONS_status: false
                };
            case DataAction.SAVE_MAXI_TONS:
                // if(state.saved_HOLD_maxi_TONS_status) return state;
                state.saved_HOLD_maxi_TONS_status = true;
                window.localStorage.setItem("local_maxi", JSON.stringify(state.HOLD_maxi_TONS));
                return {
                    ...state,
                    saved_HOLD_maxi_TONS_status: false
                };

            case DataAction.LOAD_CATALOG:
                return {
                    ...state,
                    catalog_data_state: action.payload,
                    loaded_catalog_status: true,
                    saved_catalog_status: true,
                }
            case DataAction.LOAD_CHECKBOX_STATE:
                return {
                    ...state,
                    HOLD_checkbox_state: action.payload,
                };
                case DataAction.LOAD_PREV_QTT:
                    return {
                        ...state,
                        HOLD_previous_QTT: action.payload,
                    };
            case DataAction.LOAD_PREV_TONS:
                return {
                    ...state,
                    HOLD_previous_TONS: action.payload,
                };
            case DataAction.LOAD_MAXI_TONS:
                return {
                    ...state,
                    HOLD_maxi_TONS: action.payload,
                }
            case DataAction.CLEAR:
                return {
                    ...state,
                    loaded_catalog_status: false,
                }
        //
        //
        //
        //     case DataAction.ADD_DONNEES:
        //         return {
        //             ...state,
        //             catalog_data_state: {
        //                 ...state.catalog_data_state,
        //                 [action.payload.destination]: action.payload.value
        //             }
        //         }
        //     case DataAction.UPDATE_DONNEES:
        //         const { index, data } = action.payload;
        //         const updatedTableau = [...state.tableauDeDonnees];
        //         updatedTableau[index] = data;
        //         return {
        //             ...state,
        //             tableauDeDonnees: updatedTableau,
        //         };
        //     //
        //     //
        //     //
            default:
                return state;
        }
    };
export default dataReducer;