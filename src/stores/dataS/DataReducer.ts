import { AnyAction } from "redux";
import DataAction from "./DataAction";
import {Reducer} from "@reduxjs/toolkit";
import { affectation, colors } from "../../utils/destination";
// import { createReducer } from "@reduxjs/toolkit";
// import { UPDATE_CHECKBOX_STATE } from "./checkboxActions";

export type stepe_Data = {
    rank: number
    reference: string
    weight: number
    destination: string
    position: string
    prepa: string
}

// interface AppState {
//     visible_state: boolean[];
//     // Autres propriétés de l'état
//   }

interface DataState {
    data: stepe_Data[];
    selectedCale: string;
    selectedPrepa: string;
    loaded_catalog: boolean;
    saved_catalog: boolean;

    pickerColors: { [key: string]: string };
    
    previous_QTT: { [key: string]: number };
    previous_TONS: { [key: string]: number };
    maxi_TONS: { [key: string]: number };
    diff_TONS: { [key: string]: number };
    let_QTT: { [key: string]: number };
    let_TONS: { [key: string]: number };
    
    checkboxHoldState: { [key: string]: boolean };
    
}

// interface Statistics {
//     [destination: string]: {
//         count: number;
//         weight: number;
//     //   SinglecheckboxSate: boolean;
//     };
//     }

const initialState: DataState = {
    data: [],
    selectedCale: "stock",
    selectedPrepa: "_",
    loaded_catalog: false,
    saved_catalog: true,
    pickerColors: colors,
    previous_QTT: {},
    previous_TONS: {}, 
    maxi_TONS: {},
    // maxi_values: {},
    diff_TONS: {},
    let_QTT: {},
    let_TONS: {},
    checkboxHoldState: {},
};

export const dataReducer: Reducer<DataState> = (state = initialState, action: AnyAction): DataState => {
        switch (action.type) {
            //fred
            case DataAction.UPDATE_CHECKBOX_STATE:
                return {
                    ...state,
                    checkboxHoldState: action.payload,
                };
            case DataAction.CHANGE_DIFF_TONS:
                return {
                    ...state,
                    diff_TONS: action.payload,
                };
            case DataAction.CHANGE_LET_QTT:
                return {
                    ...state,
                    let_QTT: action.payload,
                };
            case DataAction.CHANGE_LET_TONS:
                return {
                    ...state,
                    let_TONS: action.payload,
                };
            case DataAction.CHANGE_MAXI_TONS:
                return {
                    ...state,
                    maxi_TONS: action.payload,
                };
            case DataAction.CHANGE_PREVIOUS_QTT:
                return {
                ...state,
                previous_QTT: action.payload,
                };
            case DataAction.CHANGE_PREVIOUS_TONS:
                return {
                    ...state,
                    previous_TONS: action.payload,
                };
            //fred
            case DataAction.IMPORT_DATA:
                return {
                    ...state,
                    data: action.payload,
                    loaded_catalog: true,
                    saved_catalog: false,
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
            case DataAction.CHANGE_PICKCOLORS:                
                return {
                    ...state,
                    pickerColors: action.payload,
                }
            case DataAction.MOVE_ROW:
                const d = state.data.find(r => r.reference === action.payload);
                if(!d) return state;
                return {
                    ...state,
                    data: [...state.data.filter(r => r.reference !== action.payload), {...d, destination: state.selectedCale}],
                    saved_catalog: false,
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
                    saved_catalog: false,
                }
            case DataAction.CHANGE_PREPA:
                return {
                    ...state,
                    selectedPrepa: action.payload
                }
            case DataAction.SAVE_CATALOG:
                if(state.saved_catalog) return state;
                console.log("saving catalog...");
                window.localStorage.setItem("data", JSON.stringify(state.data));
                return {
                    ...state,
                    saved_catalog: false
                }
            case DataAction.LOAD_CATALOG:
                return {
                    ...state,
                    data: action.payload,
                    loaded_catalog: true,
                    saved_catalog: true,
                }
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