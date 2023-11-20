import { AnyAction } from "redux";
import DataAction from "./DataAction";
import {Reducer} from "@reduxjs/toolkit";
import { affectation, colors } from "../../utils/destination";
import { createReducer } from "@reduxjs/toolkit";
// import { UPDATE_CHECKBOX_STATE } from "./checkboxActions";

export type Data = {
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
    data: Data[];
    selectedCale: string;
    selectedPrepa: string;
    loaded: boolean;
    pickerColors: { [key: string]: string };
    saved_catalog: boolean;
    previous_QTT: number;
    previous_TONS: number;
    maxi_TONS: number;
    maxi_values: { [key: string]: number };
    diff_TONS: number;
    let_QTT: number;
    let_TONS: number;
    checkboxHoldState: { [key: string]: boolean };
    
}

interface Statistics {
    [destination: string]: {
        count: number;
        weight: number;
    //   SinglecheckboxSate: boolean;
    };
    }

const initialState: DataState = {
    data: [],
    selectedCale: "stock",
    selectedPrepa: "_",
    loaded: false,
    saved_catalog: true,
    pickerColors: colors,
    previous_QTT: 0,
    previous_TONS: 0, 
    maxi_TONS: 0,
    maxi_values: {},
    diff_TONS: 0,
    let_QTT: 0,
    let_TONS: 0,
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
                    maxi_TONS: action.payload,
            }
            case DataAction.CHANGE_LET_QTT:
                return {
                    ...state,
                    maxi_TONS: action.payload,
            }
            case DataAction.CHANGE_LET_TONS:
                return {
                    ...state,
                    maxi_TONS: action.payload,
            }

            case DataAction.CHANGE_MAXI_TONS:
                return {
                    ...state,
                    maxi_TONS: action.payload,
            }
            case DataAction.CHANGE_PREVIOUS_QTT:
                return {
                ...state,
                previous_QTT: action.payload,
            }

            case DataAction.CHANGE_PREVIOUS_TONS:
                return {
                    ...state,
                    previous_TONS: action.payload,
            }

            //fred
            case DataAction.IMPORT_DATA:
                return {
                    ...state,
                    data: action.payload,
                    loaded: true,
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
                
                // state.selectedCale = action.payload;
                // return state;
                // const oldstate = {...state};
                // state.data.push('')
                // console.log(oldstate === state );
                // console.log(oldstate.data === state.data);

                // return state
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
                console.log("saving...");
                window.localStorage.setItem("data", JSON.stringify(state.data));
                return {
                    ...state,
                    saved_catalog: false
                }
            case DataAction.LOAD_CATALOG:
                return {
                    ...state,
                    data: action.payload,
                    loaded: true,
                    saved_catalog: true,
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
export default dataReducer;