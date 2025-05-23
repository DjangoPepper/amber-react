import {AnyAction} from "redux";

export default class DataAction {
	public static IMPORT_DATA = "DataAction.IMPORT_DATA";
	public static CHANGE_CALE = "DataAction.CHANGE_CALE";
	public static CHANGE_PREPA = "DataAction.CHANGE_PREPA";
	public static MOVE_ROW = "DataAction.MOVE_ROW";
	public static UPDATE_ROW = "DataAction.UPDATE_ROW";
	
	public static LOAD_CATALOG = "DataAction.LOAD_CATALOG";
	public static SAVE_CATALOG = "DataAction.SAVE_CATALOG";
	
	public static SAVE_CHECKBOX_STATE = "DataAction_SAVE_CHECKBOX_STATE";
	public static SAVE_PREV_QTT = "DataAction.SAVE_PREV_QTT";
	public static SAVE_PREV_TONS = "DataAction.SAVE_PREV_TONS";
	public static SAVE_MAXI_TONS = "DataAction.SAVE_MAXI_TONS";
	
	public static CLEAR = "DataAction.CLEAR";
	public static REMOVE = "DataAction.REMOVE";

	public static CHANGE_COULEUR = "DataAction.CHANGE_COULEUR";
	public static CHANGE_PICKCOLORS = "DataAction.CHANGE_PICKCOLORS";
	public static CHANGE_ORIGINAL_POS = "DataAction.ORIGINAL_POS";
	public static DELETE_ROW = "DataAction.DELETE_ROW";

	public static UPDATE_DONNEES = "DataAction.UPDATE_DONNEES";
	public static ADD_DONNEES = "DataAction.ADD_DONNEES";

	public static LOAD_TALLY = "DataAction.LOAD_TALLY";
	public static SAVE_TALLY = "DataAction.SAVE_TALLY";

	public static LOAD_CHECKBOX_STATE = "DataAction.LOAD_CHECKBOX_STATE";
	public static LOAD_PREV_QTT = "DataAction.LOAD_PREV_QTT";
	public static LOAD_PREV_TONS = "DataAction.LOAD_PREV_TONS";
	public static LOAD_MAXI_TONS = "DataAction.LOAD_MAXI_TONS";

	public static CHANGE_CHECKBOX_STATE = "DataAction.CHANGE_CHECKBOX_STATE";
	public static CHANGE_PREVIOUS_QTT = "DataAction.CHANGE_PREVIOUS_QTT";
	public static CHANGE_PREVIOUS_TONS = "DataAction.CHANGE_PREVIOUS_TONS";
	public static CHANGE_MAXI_TONS = "DataAction.CHANGE_MAXI_TONS";

	public static UPDATE_AFFECTATION = "DataAction.UPDATE_AFFECTATION";

	public static updateAffectation(affectation: any[]): AnyAction {
		return { type: DataAction.UPDATE_AFFECTATION, payload: affectation };
	}

	public static change_checkbox_state(changecheckboxstate: { [destination: string]: boolean }): AnyAction {
		return { type: DataAction.CHANGE_CHECKBOX_STATE, payload: changecheckboxstate };
	}

	public static change_previous_qtt(changedqtt: { [destination: string]: string }): AnyAction {
		return { type: DataAction.CHANGE_PREVIOUS_QTT, payload: changedqtt };
	}
	
	public static change_previous_tons(changetons: { [destination: string]: string }): AnyAction {
		return { type: DataAction.CHANGE_PREVIOUS_TONS, payload: changetons };

	}
//////
	public static change_maxi_tons(changemaxi: { [destination: string]: string }): AnyAction {
		return { type: DataAction.CHANGE_MAXI_TONS, payload: changemaxi };
	}
/////

	public static deleteRow(rank: string): AnyAction {
		return { type: DataAction.DELETE_ROW, payload: rank };
	}

	public static changeCouleur(cale: any[]): AnyAction {
		return { type: DataAction.CHANGE_COULEUR, payload: cale };
	}
	public static changePickColors(colors: { [key: string]: string }): AnyAction {
		return { type: DataAction.CHANGE_PICKCOLORS, payload: colors };
	}
	public static changeOriginalpos(destination: string): AnyAction {
		return { type: DataAction.CHANGE_ORIGINAL_POS, payload: "stock"};
	}
	
	public static importData(data: any[]): AnyAction {
		return { type: DataAction.IMPORT_DATA, payload: data };
	}

	public static changeCale(cale: string): AnyAction {
		return { type: DataAction.CHANGE_CALE, payload: cale };
	}

	public static changePrepa(prepa: string): AnyAction {
		return { type: DataAction.CHANGE_PREPA, payload: prepa };
	}

	public static updateRow(reference: number, columnId: string, value: any) {
		return {type: DataAction.UPDATE_ROW, payload: {reference, columnId, value}};
	}

	public static moveRow(reference: string): AnyAction {
		return { type: DataAction.MOVE_ROW, payload: reference };
	}

	public static save_catalog(): AnyAction {
		return { type: DataAction.SAVE_CATALOG };
	}
	public static save_tally(): AnyAction {
		return { type: DataAction.SAVE_TALLY };
	}

	public static save_checkbox_state(): AnyAction {
		return { type: DataAction.SAVE_CHECKBOX_STATE };
	}

	public static save_previous_qtt(): AnyAction {
		return { type: DataAction.SAVE_PREV_QTT };
	}

	public static save_previous_tons(): AnyAction {
		return { type: DataAction.SAVE_PREV_TONS };
	}

	public static save_maxi_tons(): AnyAction {
		return { type: DataAction.SAVE_MAXI_TONS };
	}

	//*********************************************************************** */
	public static loaded_catalog(data: string): AnyAction {
		return { type: DataAction.LOAD_CATALOG, payload: JSON.parse(data) };
	}
	
	public static loaded_tally(data: string): AnyAction {
		return { type: DataAction.LOAD_TALLY, payload: JSON.parse(data) };
	}
//*********************************************************************** */

	public static load_checkbox_state(data: string): AnyAction {
		return { type: DataAction.LOAD_PREV_QTT, payload: JSON.parse(data) };
	}
	
	public static load_previous_qtt(data: string): AnyAction {
		return { type: DataAction.LOAD_PREV_QTT, payload: JSON.parse(data) };
	}
	public static load_previous_tons(data: string): AnyAction {
		return { type: DataAction.LOAD_PREV_TONS, payload: JSON.parse(data) };
	}

	public static load_maxi_tons(data: string): AnyAction {
		return { type: DataAction.LOAD_MAXI_TONS , payload: JSON.parse(data) };
	}
	
	public static clear(): AnyAction {
		return { type: DataAction.CLEAR };
	}
}
