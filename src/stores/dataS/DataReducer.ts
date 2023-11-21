import { AnyAction } from "redux";
import DataAction from "./DataAction";
import {Reducer} from "@reduxjs/toolkit";
import { affectation, colors } from "../../utils/destination";
// import { createReducer } from "@reduxjs/toolkit";
// import { UPDATE_CHECKBOX_STATE } from "./checkboxActions";

export type tally_Data = {
    tally_prevqtt : { [key: string]: number };
    tally_prevtons : { [key: string]: number };
    tally_maxis : { [key: string]: number };

}

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
    
    HOLD_previous_QTT: { [key: string]: number };
    HOLD_previous_TONS: { [key: string]: number };
    HOLD_maxi_TONS: { [key: string]: number };
    diff_TONS: { [key: string]: number };
    let_QTT: { [key: string]: number };
    let_TONS: { [key: string]: number };
    
    checkboxHoldState: { [key: string]: boolean };
    loaded_previous_QTT: boolean;
    loaded_previous_TONS: boolean;
    loaded_maxi_TONS: boolean;
    saved_HOLD_previous_QTT: boolean;
    saved_HOLD_previous_TONS: boolean;
    saved_HOLD_maxi_TONS: boolean;
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
    HOLD_previous_QTT: {},
    HOLD_previous_TONS: {}, 
    HOLD_maxi_TONS: {},
    // maxi_values: {},
    diff_TONS: {},
    let_QTT: {},
    let_TONS: {},
    checkboxHoldState: {},
    loaded_maxi_TONS: false,
    loaded_previous_QTT: false,
    loaded_previous_TONS: false,
    saved_HOLD_maxi_TONS: true,
    saved_HOLD_previous_QTT: true,
    saved_HOLD_previous_TONS: true,
};

export const dataReducer: Reducer<DataState> = (state = initialState, action: AnyAction): DataState => {
        switch (action.type) {
            //fred
            case DataAction.IMPORT_DATA:
                return {
                    ...state,
                    data: action.payload,
                    loaded_catalog: true,
                    saved_catalog: false,
                };
            
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
                window.localStorage.setItem("data", JSON.stringify(state.data));
                return {
                    ...state,
                    saved_catalog: false
                }
            
            case DataAction.SAVE_PREVIOUS_QTT:
                if(state.saved_HOLD_previous_QTT) return state;
                window.localStorage.setItem("previous_QTT", JSON.stringify(state.HOLD_previous_QTT));
                return {
                    ...state,
                    saved_HOLD_previous_QTT: true
                }
            case DataAction.SAVE_PREVIOUS_TONS:
                if(state.saved_HOLD_previous_TONS) return state;
                // window.localStorage.setItem("previous_TONS", JSON.stringify(state.previous_TONS));
                window.localStorage.setItem("previous_TONS", JSON.stringify(state.HOLD_previous_TONS));
                return {
                    ...state,
                    saved_HOLD_previous_TONS: true
                }
            case DataAction.SAVE_MAXIS:
                if(state.saved_HOLD_maxi_TONS) return state;
                window.localStorage.setItem("maxi_TONS", JSON.stringify(state.HOLD_maxi_TONS));
                return {
                    ...state,
                    saved_HOLD_maxi_TONS: true
                }


            case DataAction.LOAD_CATALOG:
                return {
                    ...state,
                    data: action.payload,
                    loaded_catalog: true,
                    saved_catalog: true,
                }
            case DataAction.LOAD_PREV_QTT:
                return {
                    ...state,
                    HOLD_previous_QTT: action.payload,
                    loaded_previous_QTT: true,
                    saved_HOLD_previous_QTT: true,
                }
            case DataAction.LOAD_PREV_TONS:
                return {
                    ...state,
                    HOLD_previous_TONS: action.payload,
                    loaded_previous_TONS: true,
                    saved_HOLD_previous_TONS: true,
                }
            case DataAction.LOAD_MAXIS:
                return {
                    ...state,
                    HOLD_maxi_TONS: action.payload,
                    loaded_maxi_TONS: true,
                    saved_HOLD_maxi_TONS: true,
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