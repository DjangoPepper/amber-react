import { AnyAction } from "redux";
import DataAction from "./DataAction";
import {Reducer} from "@reduxjs/toolkit";
import { colors } from "../../utils/destination";

export type Catalog_Data = {
    rank: number
    reference: string
    weight: number
    destination: string
    position: string
    prepa: string
}
export type Tally_Data = {
    Tally_Hold: number
    Tally_Pqtt: string
    Tally_Ptons: string
    Tally_Maxitons: string
}

// interface Isteppe {
interface Isteppe {
    ICata_catalog_state: Catalog_Data[];
    ICata_selectedCale: string;
    ICata_selectedPrepa: string;
    ICata_pickerColors: { [key: string]: string };
    ICata_loaded_status: boolean;
    ICata_saved_status: boolean;
    
    ITally_tally_state: Tally_Data[];
    ITally_selectedCale: string;
    ITally_pickerColors: { [key: string]: string };
    ITally_loaded_status: boolean;
    ITally_saved_status: boolean;
    }


// interface ITallyState {
//     ITally_tally_state: Tally_Data[];
//     ITally_selectedCale: string;
//     ITally_pickerColors: { [key: string]: string };
//     ITally_loaded_status: boolean;
//     ITally_saved_status: boolean;
// }

const initial_steppe_State: Isteppe = {
    ICata_catalog_state: [],
    ICata_selectedCale: "stock",
    ICata_selectedPrepa: "_",
    ICata_loaded_status: false,
    ICata_saved_status: true,
    ICata_pickerColors: colors,
    
    ITally_tally_state: [],
    ITally_selectedCale: "stock",
    // ITally_selectedPrepa: "_",
    ITally_loaded_status: false,
    ITally_saved_status: true,
    ITally_pickerColors: colors,
};

// const initial_tally_State: ITallyState = {
//     ITally_tally_state: [],
//     ITally_selectedCale: "stock",
//     // ITally_selectedPrepa: "_",
//     ITally_loaded_status: false,
//     ITally_saved_status: true,
//     ITally_pickerColors: colors,
// };

export const dataReducer: Reducer<Isteppe> = (state = initial_steppe_State, action: AnyAction): Isteppe => {
        switch (action.type) {
            case DataAction.IMPORT_DATA:
                return {
                    ...state,
                    ICata_catalog_state: action.payload,
                    ICata_loaded_status: true,
                    ICata_saved_status: false,
                };
            
            case DataAction.MOVE_ROW:
                const d = state.ICata_catalog_state.find(r => r.reference === action.payload);
                if(!d) return state;
                return {
                    ...state,
                    ICata_catalog_state: [...state.ICata_catalog_state.filter(r => r.reference !== action.payload), {...d, destination: state.ICata_selectedCale}],
                    ICata_saved_status: false,
                }
            case DataAction.UPDATE_ROW:
                const currentRow = state.ICata_catalog_state.find(r => r.reference === action.payload.reference);
                if(!currentRow) return state;
                return {
                    ...state,
                    ICata_catalog_state: [
                        ...state.ICata_catalog_state.filter(r => r.reference !== action.payload.reference),
                        {...currentRow, [action.payload.columnId]: action.payload.value}
                    ],
                    ICata_saved_status: false,
                }
            case DataAction.CHANGE_PREPA:
                return {
                    ...state,
                    ICata_selectedPrepa: action.payload
                }

            case DataAction.CHANGE_CALE:
                return {
                    ...state,
                    ICata_selectedCale: action.payload,
                };

            case DataAction.CHANGE_ORIGINAL_POS:
                return {
                    ...state,
                    ICata_selectedCale: action.payload,
                }
            case DataAction.CHANGE_COULEUR:
                return {
                    ...state,
                    ICata_selectedCale: action.payload,
                }
            case DataAction.CHANGE_PICKCOLORS:                
                return {
                    ...state,
                    ICata_pickerColors: action.payload,
                }
            case DataAction.SAVE_CATALOG:
                if(state.ICata_saved_status) return state;
                window.localStorage.setItem("data", JSON.stringify(state.ICata_catalog_state));
                return {
                    ...state,
                    ICata_saved_status: false
                }

            case DataAction.SAVE_TALLY:
                if(state.ITally_saved_status ) return state;
                // window.localStorage.setItem("tally", JSON.stringify(state.Itally_Data_state));
                window.localStorage.setItem("tally", JSON.stringify(state.ITally_tally_state));
                return {    
                    ...state,
                    ITally_saved_status: false
                }

            case DataAction.LOAD_CATALOG:
                return {
                    ...state,
                    ICata_catalog_state: action.payload,
                    ICata_loaded_status: true,
                    ICata_saved_status: true,
                }

                case DataAction.LOAD_TALLY:
                    return {
                        ...state,
                        ITally_tally_state: action.payload,
                        ITally_loaded_status: true,
                        ITally_saved_status: true,
                }

            case DataAction.CLEAR:
                return {
                    ...state,
                    ICata_loaded_status: false,
                }

            case DataAction.SET_TALLY_HOLD_CHECKBOX:
                return {
                    ...state,
                    // ICata_catalog_state: state.ICata_catalog_state.map((item) => {
                    ICata_catalog_state: state.ICata_catalog_state.map((item) => {
                        return {
                            ...item,
                            [action.payload.Tally_Hold]: action.payload.Tally_checkedBox
                        }
                    })
                }
            
            case DataAction.SET_TALLY_HOLD_PREVQTT:
                return {
                    ...state,
                    // ICata_catalog_state: state.ICata_catalog_state.map((item) => {
                    ICata_catalog_state: state.ICata_catalog_state.map((item) => {
                        return {
                            ...item,
                            [action.payload.Tally_Hold]: action.payload.value
                        }
                    })
                }    
            
            case DataAction.SET_TALLY_HOLD_MAXITONS:
                return {
                    ...state,
                    // ICata_catalog_state: state.ICata_catalog_state.map((item) => {
                    ICata_catalog_state: state.ICata_catalog_state.map((item) => {
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