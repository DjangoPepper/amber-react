import { AnyAction } from "redux";
import DataAction from "./DataAction";
import {Reducer} from "@reduxjs/toolkit";
import { affectation, colors } from "../../utils/destination";

export type Data = {
    rank: number
    reference: string
    weight: number
    destination: string
    position: string
    prepa: string
}

// interface AppState {
//     visibleStates: boolean[];
//     // Autres propriétés de l'état
//   }

interface DataState {
    data: Data[];
    selectedCale: string;
    selectedPrepa: string;
    loaded: boolean;
    pickerColors: { [key: string]: string };
    saved: boolean;
    previous_QTT: number;
    previous_TONS: number;
    maxi_TONS: number;
    diff_TONS: number;
    let_QTT: number;
    let_TONS: number;
    // visibleStates: boolean;
    visibleStates: boolean[];
    
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
    saved: true,
    pickerColors: colors,
    previous_QTT: 0,
    previous_TONS: 0, 
    maxi_TONS: 0,
    diff_TONS: 0,
    let_QTT: 0,
    let_TONS: 0,
    // visibleStates: false,
    visibleStates: affectation.map(item => item.visibleState),
};

export const dataReducer: Reducer<DataState> = (state = initialState, action: AnyAction): DataState => {
        switch (action.type) {
            //fred
            
            case DataAction.TOGGLE_VISIBLE_STATE:
                const updatedVisibleStates = [...state.visibleStates];
                updatedVisibleStates[action.itemIndex] = action.isVisible;
                return {
                    ...state,
                    visibleStates: updatedVisibleStates,
                }
            
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
export default dataReducer;