import {AnyAction} from "redux";

export default class DataAction {
    public static IMPORT_DATA = "DataAction.IMPORT_DATA";
    public static CHANGE_CALE = "DataAction.CHANGE_CALE";
    public static CHANGE_PREPA = "DataAction.CHANGE_PREPA";
    public static MOVE_ROW = "DataAction.MOVE_ROW";

    public static importData(data: any[]): AnyAction {
        return { type: DataAction.IMPORT_DATA, payload: data };
    }

    public static changeCale(cale: string): AnyAction {
        return { type: DataAction.CHANGE_CALE, payload: cale };
    }

    public static changePrepa(prepa: string): AnyAction {
        return { type: DataAction.CHANGE_PREPA, payload: prepa };
    }

    public static moveRow(reference: string): AnyAction {
        return { type: DataAction.MOVE_ROW, payload: reference };
    }
}
