import {AnyAction} from "redux";

export default class DataAction {
	public static IMPORT_DATA = "DataAction.IMPORT_DATA";
	public static CHANGE_CALE = "DataAction.CHANGE_CALE";
	public static CHANGE_PREPA = "DataAction.CHANGE_PREPA";
	public static MOVE_ROW = "DataAction.MOVE_ROW";
	public static UPDATE_ROW = "DataAction.UPDATE_ROW";
	
	public static SAVE_CATALOG = "DataAction.SAVE_CATALOG";
	public static SAVE_MAXIS = "DataAction.SAVE_MAXIS";
	
	public static LOAD_CATALOG = "DataAction.LOAD_CATALOG";
	public static LOAD_MAXIS = "DataAction.LOAD_MAXIS";
	
	public static CLEAR = "DataAction.CLEAR";
	public static REMOVE = "DataAction.REMOVE";

	public static CHANGE_COULEUR = "DataAction.CHANGE_COULEUR";
	public static CHANGE_PICKCOLORS = "DataAction.CHANGE_PICKCOLORS";
	public static CHANGE_ORIGINAL_POS = "DataAction.ORIGINAL_POS";
	public static DELETE_ROW = "DataAction.DELETE_ROW";
	
	public static LOAD_CHECKBOX_STATE = "DataAction.LOAD_CHECKBOX_STATE";
	public static LOAD_PREV_QTT = "DataAction.LOAD_PREV_QTT";
	public static LOAD_PREV_TONS = "DataAction.LOAD_PREV_TONS";
	public static LOAD_MAXI_TONS = "DataAction.LOAD_MAXI_TONS";

	public static CHANGE_CHECKBOX_STATE = "DataAction.CHANGE_CHECKBOX_STATE";
	public static CHANGE_PREVIOUS_QTT = "DataAction.CHANGE_PREVIOUS_QTT";
	public static CHANGE_PREVIOUS_TONS = "DataAction.CHANGE_PREVIOUS_TONS";
	public static CHANGE_MAXI_TONS = "DataAction.CHANGE_MAXI_TONS";

	public static UPDATE_DONNEES = "DataAction.UPDATE_DONNEES";
	public static ADD_DONNEES = "DataAction.ADD_DONNEES";

	////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

	public static add_donnees(nouvelles_donnees: { [destination: string]: string}): AnyAction {
		return { type: DataAction.ADD_DONNEES, payload: nouvelles_donnees };
	};
	
	public static update_donnees(index: number, maj_donnees: { [destination: string]: string}): AnyAction {
		return { type: DataAction.UPDATE_DONNEES, payload: {index, maj_donnees }};
	}

	public static load_checkbox_state(checkboxstate: { [destination: string]: boolean }): AnyAction {
		return { type: DataAction.LOAD_PREV_QTT, payload: checkboxstate };
	}
	public static load_previous_qtt(newqtt: { [destination: string]: string }): AnyAction {
		return { type: DataAction.LOAD_PREV_QTT, payload: newqtt };
	}
	
	public static load_previous_tons(newtons: { [destination: string]: number }): AnyAction {
		return { type: DataAction.LOAD_PREV_TONS, payload: newtons };
	}
	
	public static load_maxis(newmaxi: { [destination: string]: number }): AnyAction {
		return { type: DataAction.LOAD_MAXIS, payload: newmaxi };
	}
	
	public static change_checkbox_state(changecheckboxstate: { [destination: string]: boolean }): AnyAction {
		return { type: DataAction.CHANGE_CHECKBOX_STATE, payload: changecheckboxstate };
	}

	public static changePreviousQTT(changedqtt: { [destination: string]: string }): AnyAction {
		return { type: DataAction.CHANGE_PREVIOUS_QTT, payload: changedqtt };
	}
	
	public static changePreviousTONS(tons: { destination: string; value: number }): AnyAction {
		return { type: DataAction.CHANGE_PREVIOUS_TONS, payload: tons };
	}
//////
	public static changeMaxiTONS(maxi: { destination: string; value: number }): AnyAction {
		return { type: DataAction.CHANGE_MAXI_TONS, payload: maxi };
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

	public static save_maxis(): AnyAction {
		return { type: DataAction.SAVE_MAXIS };
	}

	public static load_catalog(data: string): AnyAction {
		return { type: DataAction.LOAD_CATALOG, payload: JSON.parse(data) };
	}

	public static clear(): AnyAction {
		return { type: DataAction.CLEAR };
	}
}
