import {AnyAction} from "redux";

export default class DataAction {
		
	public static CHANGE_CHECKBOX_STATE = "DataAction.CHANGE_CHECKBOX_STATE";
	public static CHANGE_STRING_CHECKBOX_STATE = "DataAction.CHANGE_STRING_CHECKBOX_STATE";
	public static CHANGE_PREVIOUS_QTT_STATE = "DataAction.CHANGE_PREVIOUS_QTT_STATE";
	public static CHANGE_PREVIOUS_TONS_STATE = "DataAction.CHANGE_PREVIOUS_TONS_STATE";
	public static CHANGE_MAXI_TONS_STATE = "DataAction.CHANGE_MAXI_TONS_STATE";

	public static CREATE_CHECKBOX_STATE = "CREATE_CHECKBOX_STATE";
	public static CREATE_PREVIOUS_QTT_STATE = "CREATE_PREVIOUS_QTT_STATE";
	public static CREATE_PREVIOUS_TONS_STATE = "CREATE_PREVIOUS_TONS_STATE";
	public static CREATE_MAXI_TONS_STATE = "CREATE_MAXI_TONS_STATE";
	
	public static SAVE_CATALOG_STORAGE = "DataAction.SAVE_CATALOG_STORAGE";
	public static SAVE_CHECKBOX_STORAGE = "DataAction.SAVE_CHECKBOX_STORAGE";
	public static SAVE_CHECKBOX_STATE = "DataAction.SAVE_CHECKBOX_STATE";

	public static SAVE_PREV_QTT_STORAGE = "DataAction.SAVE_PREV_QTT_STORAGE";
	public static SAVE_PREV_TONS_STORAGE = "DataAction.SAVE_PREV_TONS_STORAGE";
	public static SAVE_MAXI_TONS_STORAGE = "DataAction.SAVE_MAXI_TONS_STORAGE";
	// public static SAVE_MAXIS = "DataAction.SAVE_MAXIS";
	
	public static LOAD_CATALOG = "DataAction.LOAD_CATALOG";
	public static LOAD_CHECKBOX_STATE = "DataAction.LOAD_CHECKBOX_STATE";
	public static LOAD_PREV_QTT_STATE = "DataAction.LOAD_PREV_QTT_STATE";
	public static LOAD_PREV_TONS_STATE = "DataAction.LOAD_PREV_TONS_STATE";
	public static LOAD_MAXI_TONS_STATE = "DataAction.LOAD_MAXI_TONS_STATE";

	// public static LOAD_MAXIS = "DataAction.LOAD_MAXIS";
	public static IMPORT_DATA = "DataAction.IMPORT_DATA";
	public static CHANGE_CALE = "DataAction.CHANGE_CALE";
	public static CHANGE_PREPA = "DataAction.CHANGE_PREPA";
	public static MOVE_ROW = "DataAction.MOVE_ROW";
	public static UPDATE_ROW = "DataAction.UPDATE_ROW";
	
	public static CLEAR = "DataAction.CLEAR";
	public static REMOVE = "DataAction.REMOVE";

	public static CHANGE_COULEUR = "DataAction.CHANGE_COULEUR";
	public static CHANGE_PICKCOLORS = "DataAction.CHANGE_PICKCOLORS";
	public static CHANGE_ORIGINAL_POS = "DataAction.ORIGINAL_POS";
	public static DELETE_ROW = "DataAction.DELETE_ROW";

	public static UPDATE_DONNEES = "DataAction.UPDATE_DONNEES";
	public static ADD_DONNEES = "DataAction.ADD_DONNEES";

	public static load_catalog(data: string): AnyAction {
		return { type: DataAction.LOAD_CATALOG, payload: JSON.parse(data) };
	}
	public static load_checkbox_state(checkboxstate: { [destination: string]: boolean }): AnyAction {
		return { type: DataAction.LOAD_CHECKBOX_STATE, payload: checkboxstate };
	}
	// public static LOAD_CHECKBOX_STATE(stringcheckboxstate: { [destination: string]: string }): AnyAction {
	// 	return { type: DataAction.LOAD_CATALOG, payload: stringcheckboxstate };
	// }
	public static load_previous_qtt_state(newqtt: { [destination: string]: string }): AnyAction {
		return { type: DataAction.LOAD_PREV_QTT_STATE, payload: newqtt };
	}
	
	public static load_previous_tons_state(newtons: { [destination: string]: number }): AnyAction {
		return { type: DataAction.LOAD_PREV_TONS_STATE, payload: newtons };
	}
	
	public static load_maxi_tons_state(newmaxi: { [destination: string]: number }): AnyAction {
		return { type: DataAction.LOAD_MAXI_TONS_STATE, payload: newmaxi };
	}
	

	public static change_checkbox_state(changecheckboxstate: { [destination: string]: boolean }): AnyAction {
		return { type: DataAction.CHANGE_CHECKBOX_STATE, payload: changecheckboxstate };
	}

	public static change_previous_qtt_state(changeqtt: { [destination: string]: string }): AnyAction {
		return { type: DataAction.CHANGE_PREVIOUS_QTT_STATE, payload: changeqtt };
	}
	
	public static change_previous_tons_state(changetons: { [destination: string]: string }): AnyAction {
		return { type: DataAction.CHANGE_PREVIOUS_TONS_STATE, payload: changetons };
	}

	public static change_maxi_tons_state(changemaxi: { [destination: string]: string }): AnyAction {
		return { type: DataAction.CHANGE_MAXI_TONS_STATE, payload: changemaxi };
	}
/////
	// public static CREATE_CHECKBOX_STATE = "CREATE_CHECKBOX_STATE";
	// public static CREATE_PREVIOUS_QTT_STATE = "CREATE_PREVIOUS_QTT_STATE";
	// public static CREATE_PREVIOUS_TONS_STATE = "CREATE_PREVIOUS_TONS_STATE";
	// public static CREATE_MAXI_QTT_STATE = "CREATE_MAXI_QTT_STATE";
	
	public static create_checkbox_state(createcdvalue: { [destination: string]: string }): AnyAction {
		return { type:DataAction.CREATE_CHECKBOX_STATE, payload: createcdvalue };
	}

	public static create_previous_qtt_state(createcdvalue: {[destibation: string]: string }): AnyAction {
		return { type: DataAction.CREATE_PREVIOUS_QTT_STATE, payload: createcdvalue} ;
	}

	public static create_previous_tons_state(createcdvalue: {[destibation: string]: string }): AnyAction {
		return { type: DataAction.CREATE_PREVIOUS_TONS_STATE, payload: createcdvalue} ;
	}
	public static create_maxi_tons_state(createcdvalue: {[destibation: string]: string }): AnyAction {
		return { type: DataAction.CREATE_PREVIOUS_QTT_STATE, payload: createcdvalue} ;
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
		return { type: DataAction.SAVE_CATALOG_STORAGE };
	}
	public static save_checkbox_storage(): AnyAction {
		return { type: DataAction.SAVE_CHECKBOX_STORAGE };
	}
	public static save_checkbox_state(): AnyAction {
		return { type: DataAction.SAVE_CHECKBOX_STATE };
	}
	public static save_previous_qtt_storage(): AnyAction {
		return { type: DataAction.SAVE_PREV_QTT_STORAGE };
	}

	public static save_previous_tons_storage(): AnyAction {
		return { type: DataAction.SAVE_PREV_TONS_STORAGE };
	}
	public static save_maxi_tons_storage(): AnyAction {
		return { type: DataAction.SAVE_MAXI_TONS_STORAGE };
	}
	
	public static clear(): AnyAction {
		return { type: DataAction.CLEAR };
	}
}
