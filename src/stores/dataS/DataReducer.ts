import { AnyAction } from "redux";
import DataAction from "./DataAction";
import {Reducer} from "@reduxjs/toolkit";
import { affectation, colors } from "../../utils/destination";

export type stepe_Data = {
    rank: number
    reference: string
    weight: number
    destination: string
    position: string
    prepa: string
}

interface DataState {
    Interfaced_data_state: stepe_Data[];
    selectedCale: string;
    selectedPrepa: string;
    loaded_catalog: boolean;
    saved_catalog: boolean;
    pickerColors: { [key: string]: string };
    
    HOLD_previous_QTT: { [key: string]: string };
    HOLD_previous_TONS: { [key: string]: string };
    HOLD_maxi_TONS: { [key: string]: string };
    
    // HOLD_checkbox_state: {[key: string]: boolean}[];
    HOLD_checkbox_state: { [key: string]: boolean };

    // loaded_previous_QTT: boolean;
    // loaded_previous_TONS: boolean;
    loaded_maxi_TONS: boolean;
    // saved_HOLD_previous_QTT: boolean;
    // saved_HOLD_previous_TONS: boolean;
    saved_HOLD_maxi_TONS: boolean;
    tableauDeDonnees: { [destination: string]: string }[];
}

// interface Statistics {
//     [destination: string]: {
//         count: number;
//         weight: number;
//     //   SinglecheckboxSate: boolean;
//     };
//     }

const initialState: DataState = {
    Interfaced_data_state: [],
    selectedCale: "stock",
    selectedPrepa: "_",
    loaded_catalog: false,
    saved_catalog: true,
    pickerColors: colors,
    HOLD_previous_QTT: {},
    HOLD_previous_TONS: {}, 
    HOLD_maxi_TONS: {},
    // maxi_values: {},
    // diff_TONS: {},
    // let_QTT: {},
    // let_TONS: {},
    // HOLD_checkbox_state: [],
    HOLD_checkbox_state: {},
    // HOLD_checkbox_state: { [key: string]: boolean };
    
    loaded_maxi_TONS: false,
    // loaded_previous_QTT: false,
    // loaded_previous_TONS: false,
    saved_HOLD_maxi_TONS: true,
    // saved_HOLD_previous_QTT: true,
    // saved_HOLD_previous_TONS: true,
    tableauDeDonnees: [],
};

export const dataReducer: Reducer<DataState> = (state = initialState, action: AnyAction): DataState => {
        switch (action.type) {
            //fred
            case DataAction.IMPORT_DATA:
                return {
                    ...state,
                    Interfaced_data_state: action.payload,
                    loaded_catalog: true,
                    saved_catalog: false,
                };
            
            case DataAction.MOVE_ROW:
                const d = state.Interfaced_data_state.find(r => r.reference === action.payload);
                if(!d) return state;
                return {
                    ...state,
                    Interfaced_data_state: [...state.Interfaced_data_state.filter(r => r.reference !== action.payload), {...d, destination: state.selectedCale}],
                    saved_catalog: false,
                }
            case DataAction.UPDATE_ROW:
                const currentRow = state.Interfaced_data_state.find(r => r.reference === action.payload.reference);
                if(!currentRow) return state;
                return {
                    ...state,
                    Interfaced_data_state: [
                        ...state.Interfaced_data_state.filter(r => r.reference !== action.payload.reference),
                        {...currentRow, [action.payload.columnId]: action.payload.value}
                    ],
                    saved_catalog: false,
                }
            case DataAction.CHANGE_PREPA:
                return {
                    ...state,
                    selectedPrepa: action.payload
                }

    
            // case DataAction.CHANGE_CHECKBOX_STATE:
            //     return {
            //         ...state,
            //         HOLD_checkbox_state: action.payload,
            //     };
            case DataAction.CHANGE_CHECKBOX_STATE:
                return {
                    ...state,
                    HOLD_checkbox_state: action.payload,
                };

            case DataAction.CHANGE_MAXI_TONS:
                return {
                    ...state,
                    HOLD_maxi_TONS: action.payload,
                };
            case DataAction.CHANGE_PREVIOUS_QTT:
                return {
                ...state,
                HOLD_previous_QTT: action.payload,
                };
            case DataAction.CHANGE_PREVIOUS_TONS:
                return {
                    ...state,
                    HOLD_previous_TONS: action.payload,
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
                if(state.saved_catalog) return state;
                console.log("saving catalog...");
                window.localStorage.setItem("data", JSON.stringify(state.Interfaced_data_state));
                return {
                    ...state,
                    saved_catalog: false
                }
            
            case DataAction.SAVE_MAXIS:
                if(state.saved_HOLD_maxi_TONS) return state;
                window.localStorage.setItem("maxi_TONS", JSON.stringify(state.HOLD_maxi_TONS));
                return {
                    ...state,
                    saved_HOLD_maxi_TONS: false
                }


            case DataAction.LOAD_CATALOG:
                return {
                    ...state,
                    Interfaced_data_state: action.payload,
                    loaded_catalog: true,
                    saved_catalog: true,
                }
            case DataAction.LOAD_PREV_QTT:
                return {
                    ...state,
                    HOLD_previous_QTT: action.payload,
                    // loaded_previous_QTT: true,
                    // saved_HOLD_previous_QTT: true,
                }
            case DataAction.LOAD_PREV_TONS:
                return {
                    ...state,
                    HOLD_previous_TONS: action.payload,
                    // loaded_previous_TONS: true,
                    // saved_HOLD_previous_TONS: true,
                }
            case DataAction.LOAD_MAXIS:
                return {
                    ...state,
                    HOLD_maxi_TONS: action.payload,
                    // loaded_maxi_TONS: true,
                    // saved_HOLD_maxi_TONS: true,
                }
            case DataAction.CLEAR:
                return {
                    ...state,
                    loaded_catalog: false,
                }
            //
            //
            //
            case DataAction.ADD_DONNEES:
                return {
                    ...state,
                    Interfaced_data_state: {
                        ...state.Interfaced_data_state,
                        [action.payload.destination]: action.payload.value
                    }
                }
                case DataAction.UPDATE_DONNEES:
                    const { index, data } = action.payload;
                    const updatedTableau = [...state.tableauDeDonnees];
                    updatedTableau[index] = data;
                    return {
                        ...state,
                        tableauDeDonnees: updatedTableau,
                    };
            //
            //
            //
            default:
                return state;
        }
    };
export default dataReducer;