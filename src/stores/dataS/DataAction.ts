import {AnyAction} from "redux";
import { affectation } from "../../utils/destination";

export default class DataAction {
	public static IMPORT_DATA = "DataAction.IMPORT_DATA";
	public static CHANGE_CALE = "DataAction.CHANGE_CALE";
	public static CHANGE_PREPA = "DataAction.CHANGE_PREPA";
	public static MOVE_ROW = "DataAction.MOVE_ROW";
	public static UPDATE_ROW = "DataAction.UPDATE_ROW";
	public static SAVE_CATALOG = "DataAction.SAVE_CATALOG";
	public static LOAD_CATALOG = "DataAction.LOAD_CATALOG";
	public static CLEAR = "DataAction.CLEAR";
	public static REMOVE = "DataAction.REMOVE";

	public static CHANGE_COULEUR = "DataAction.CHANGE_COULEUR";
	public static CHANGE_PICKCOLORS = "DataAction.CHANGE_PICKCOLORS";
	public static CHANGE_ORIGINAL_POS = "DataAction.ORIGINAL_POS";
	public static DELETE_ROW = "DataAction.DELETE_ROW";
	//fred
	public static CHANGE_PREVIOUS_QTT = "DataAction.CHANGE_PREVIOUS_QTT";
	public static CHANGE_PREVIOUS_TONS = "DataAction.CHANGE_PREVIOUS_TONS";
	public static CHANGE_MAXI_TONS = "DataAction.CHANGE_MAXI_TONS";

	public static CHANGE_DIFF_TONS = "DataAction.CHANGE_DIFF_TONS";
	public static CHANGE_LET_QTT = "DataAction.CHANGE_LET_QTT";
	public static CHANGE_LET_TONS = "DataAction.CHANGE_LET_TONS";
	


	public static LOAD_PREVQTT = "DataAction.LOAD_PREVQTT";
	public static load_PreviousQTT(qtt: { destination: string; value: number }): AnyAction {
		return { type: DataAction.LOAD_PREVQTT, payload: qtt };
	}
	


	public static LOAD_PREVTONS = "DataAction.LOAD_PREVTONS";
	public static load_PreviousTONS(tons: { destination: string; value: number }): AnyAction {
		return { type: DataAction.LOAD_PREVTONS, payload: tons };
	}

	
	public static LOAD_MAXIS = "DataAction.LOAD_MAXIS";
	public static load_maxis(tons: { destination: string; value: number }): AnyAction {
		return { type: DataAction.LOAD_MAXIS, payload: tons };
	}


	
	public static UPDATE_CHECKBOX_STATE = "DataAction.UPDATE_CHECKBOX_STATE";
	public static update_CHECKBOX_STATE(newcheckboxstate: { key: string; value: boolean }): AnyAction {
		return { type: DataAction.UPDATE_CHECKBOX_STATE, payload: newcheckboxstate };
	}
	public static changeLetTONS(lettons: { destination: string; value: number }): AnyAction {
		return { type: DataAction.CHANGE_LET_TONS, payload: lettons };
	}
	public static changeLetQTT(letqtt: { destination: string; value: number }): AnyAction {
		return { type: DataAction.CHANGE_LET_QTT, payload: letqtt };
	}

	public static changeDiffTONS(diff: { destination: string; value: number }): AnyAction {
		return { type: DataAction.CHANGE_DIFF_TONS, payload: diff };
	}

	public static changeMaxiTONS(maxi: { destination: string; value: number }): AnyAction {
		return { type: DataAction.CHANGE_MAXI_TONS, payload: maxi };
	}

	public static changePreviousQTT(qtt: { destination: string; value: number }): AnyAction {
		return { type: DataAction.CHANGE_PREVIOUS_QTT, payload: qtt };
	}
	
	public static changePreviousTONS(tons: { destination: string; value: number }): AnyAction {
		return { type: DataAction.CHANGE_PREVIOUS_TONS, payload: tons };
	}
		//fred

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

	public static load_catalog(data: string): AnyAction {
		return { type: DataAction.LOAD_CATALOG, payload: JSON.parse(data) };
	}

	public static clear(): AnyAction {
		return { type: DataAction.CLEAR };
	}
}
