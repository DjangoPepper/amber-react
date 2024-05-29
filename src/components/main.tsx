import React, {useCallback, useState} from 'react'
import Dropzone from 'react-dropzone'
import {Col, Container, Row} from "react-bootstrap";
import {read, utils} from "xlsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores/rootStore";
import {stepe_Data} from "../stores/dataS/DataReducer";
import DataAction from "../stores/dataS/DataAction";
import DataTable from "./data-table";
import Statistics from "./statistics";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function CleanExcelSheet(oSheet: any): stepe_Data {
	toast.info('Allegement feuille', { position: toast.POSITION.TOP_RIGHT,autoClose: 1000 }) 

			deleteExcelMergesInfos(oSheet);
			deleteExcelMarginsInfos(oSheet);
			reconstructRefWithoutEmptyRows(oSheet);
			risolveFormulas(oSheet);
			removeProprietes(oSheet);
			const headersRow = findHeaderRow(oSheet, ['N°','NUMERO', 'RANG', 'POS', 'POSITION']);
			fillUndefinedNumberCells(oSheet);
			oSheet = copySheetWithHeadersAndNumbers(oSheet, headersRow);
			SuppressionCellulesNull(oSheet);
			reconstruitRef(oSheet, oSheet['!ref']);
			return oSheet;

}

function removeProprietes(newsheet: any) {
	const range = utils.decode_range(newsheet['!ref']);
	let newRef = '';
	let startRow = range.s.r;
	let endRow = range.e.r;
	let startCol = range.s.c;
	let endCol = range.e.c;
	
	for (let Rrow = startRow; Rrow <= endRow; Rrow++) {
		for (let Rcol = startCol; Rcol <= endCol; Rcol++) {
			const cellAddress = utils.encode_cell({ r: Rrow, c: Rcol });
			const cell = newsheet[cellAddress];
			
			if (cell !== undefined && cell.v !== null && cell.v !== '') {
				newRef = utils.encode_range({ s: { c: 0, r: 0 }, e: { c: Rcol, r: Rrow }});
			}
		}
	}
	return newRef;
}


function reconstruitRef(newesheet: any, newref: any): string {

	const range = utils.decode_range(newref);
	let newRef = '';
	let startRow = range.s.r;
	let endRow = range.e.r;
	let startCol = range.s.c;
	let endCol = range.e.c;
	
	for (let Rrow = startRow; Rrow <= endRow; Rrow++) {
		for (let Rcol = startCol; Rcol <= endCol; Rcol++) {
			const cellAddress = utils.encode_cell({ r: Rrow, c: Rcol });
			const cell = newesheet[cellAddress];
			
			if (cell !== undefined && cell.v !== null && cell.v !== '') {
				newRef = utils.encode_range({ s: { c: 0, r: 0 }, e: { c: Rcol, r: Rrow }});
			}
		}
	}
	return newRef;
}

function SuppressionCellulesNull(newsheet: any): any {
	const range = utils.decode_range(newsheet['!ref']);
	let startRow = range.s.r;
	let endRow = range.e.r;
	let startCol = range.s.c;
	let endCol = range.e.c;
	

	while (endRow >= startRow) {
		for (let col = endCol; col >= startCol; col--) {
			const cellAddress = utils.encode_cell({ r: endRow, c: col });
			const cell = newsheet[cellAddress];

			if (Number.isNaN(cell.v) || cell.v === null) {
				delete newsheet[cellAddress];
			}
		}
    endRow--;
	}
	return newsheet;
}

function copySheetWithHeadersAndNumbers(sheet: any, headersRow: number): any {
    const range = utils.decode_range(sheet['!ref']);
    const copiedSheet: any = {};
    for (let col = range.s.c; col <= range.e.c; col++) {
        const headerCellAddress = utils.encode_cell({ r: headersRow, c: col });
        const cell = sheet[headerCellAddress];
        if (cell !== undefined) {
            copiedSheet[utils.encode_cell({ r: 0, c: col })] = cell;
        }
    }

    let newRow = 1;  
    for (let row = headersRow + 1; row <= range.e.r; row++) {
        const firstCellAddress = utils.encode_cell({ r: row, c: range.s.c });
        const firstCell = sheet[firstCellAddress];
        if (firstCell !== undefined && typeof firstCell.v === 'number') {
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellAddress = utils.encode_cell({ r: row, c: col });
                const cell = sheet[cellAddress];		
				if (cell !== undefined) {					
					if (cell.t === 'n') {
						copiedSheet[utils.encode_cell({ r: newRow, c: col })] = { ...cell, v: parseFloat(cell.v) };
					}else{
						copiedSheet[utils.encode_cell({ r: newRow, c: col })] = cell;
					}
				}
            }
            newRow++;
        }
    }

    const newRef = {
        s: { c: range.s.c, r: 0 },
        e: { c: range.e.c, r: newRow - 1 },
    };
    copiedSheet['!ref'] = utils.encode_range(newRef);

    return copiedSheet;
}

function fillUndefinedNumberCells(sheet: any) {
    const range = utils.decode_range(sheet['!ref']);

    for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = utils.encode_cell({ r: row, c: col });
            const cell = sheet[cellAddress];

            if (cell === undefined) {
                sheet[cellAddress] = { t: 'n', v:null  , h:null , w:null  };
            }
        }
    }
}

function reconstructRefWithoutEmptyRows(newsheet: any) {
    const range = utils.decode_range(newsheet['!ref']);
    let newRef = '';
    let startRow = range.s.r;
    let endRow = range.e.r;
    let startCol = range.s.c;
    let endCol = range.e.c;

    while (endRow >= startRow) {
        let isEmpty = true;
        for (let col = startCol; col <= endCol; col++) {
            const cellAddress = utils.encode_cell({ r: endRow, c: col });
            const cell = newsheet[cellAddress];
            if (cell !== undefined && cell.v !== null && cell.v !== '') {
                isEmpty = false;
                break;
            }
        }
        if (!isEmpty) {
            break;
        }
        endRow--;
    }

    if (startRow <= endRow) {        
        for (let row = range.e.r; row > endRow; row--) {
            for (let col = startCol; col <= endCol; col++) {
                const cellAddress = utils.encode_cell({ r: row, c: col });
                delete newsheet[cellAddress];
            }
        }
        newRef = utils.encode_range({ s: { c: startCol, r: startRow }, e: { c: endCol, r: endRow } });
        newsheet['!ref'] = newRef;
    }
    return newsheet;
}

function findHeaderRow (newsheet: any, headers: string[]): number | 0 {
	const range = utils.decode_range(newsheet['!ref']);
	
	for (let row = range.s.r; row <= range.e.r; row++) {
		for (let col = range.s.c; col <= range.e.c; col++) {
			const cellAddress = utils.encode_cell({ r: row, c: col });
			const cell = newsheet[cellAddress];
			if (cell && headers.includes(cell.v.toUpperCase())) {
				return row;
			}
		}
	}
	
	return 0;
};

function deleteExcelMarginsInfos(newsheet: any) {
	const margins = newsheet['!margins'];
		if (margins) {
			delete newsheet['!margins'];
		}
	};

function deleteExcelMergesInfos(newsheet: any) {
	const merges = newsheet['!merges'];
		if (merges) {
			delete newsheet['!merges'];
		}
	};

function risolveFormulas(newsheet: any){
	const formulaRange = utils.decode_range(newsheet['!ref']);
	for (let row = formulaRange.s.r; row <= formulaRange.e.r; row++) {
		for (let col = formulaRange.s.c; col <= formulaRange.e.c; col++) {
			const cellAddress = utils.encode_cell({ r: row, c: col });
			const cell = newsheet[cellAddress];
			if (cell && cell.f) {
				const calculatedValue = utils.format_cell(cell);
				cell.v = calculatedValue;
				delete cell.f;
				delete cell.F;
				}
			}
		}
	};

function removeAccents(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	};

function cleanData(values: any): stepe_Data {
	const toUpperCaseKeysValues: any = {};
	for (const key in values) {
		const upperCaseKey = key.toUpperCase();
		const cleanedKey = removeAccents(upperCaseKey);
		toUpperCaseKeysValues[cleanedKey] = values[key];
	}

    return {
        rank: toUpperCaseKeysValues["POS"] || toUpperCaseKeysValues["NUMERO"] || toUpperCaseKeysValues["RANG"] || toUpperCaseKeysValues["N°"],
        prepa: toUpperCaseKeysValues["ZONE"] || toUpperCaseKeysValues["PREPA"] ,
        reference: toUpperCaseKeysValues["N° DE COILS"] || toUpperCaseKeysValues["N° DE BRAME"] || toUpperCaseKeysValues["N° PRODUIT"] ||  toUpperCaseKeysValues["REFERENCE"] || toUpperCaseKeysValues["REF"] || toUpperCaseKeysValues["COILS"] || toUpperCaseKeysValues["BRAMES"],
        weight: toUpperCaseKeysValues["POIDS"] || toUpperCaseKeysValues["TONS"],
        position: toUpperCaseKeysValues["POSITION"],
        destination: toUpperCaseKeysValues["DESTINATION"] || toUpperCaseKeysValues["DEST"] || "stock"
		};
	};



function Main() {
	const dispatch = useDispatch();
	const loaded_catalog = useSelector<RootState, boolean>(state => state.data.loaded_catalog_status);
	const onDrop = useCallback((acceptedFiles: any) => {
	const file = acceptedFiles[0];
	const reader = new FileReader();
	reader.onload = function (evt) {
		const rawData = evt.target?.result;
		if(!rawData) return;
		const workbook = read(rawData, {type: 'binary'});
		let Sheet: { [key: string]: any } = {
		};
		if (workbook.Sheets['winwin']){																 
				Sheet = workbook.Sheets['winwin'];
				toast.info('LECTURE FEUILLE WiNWiN', { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 })		
		} 
		else if (workbook.Sheets['Bobines']){
			Sheet = CleanExcelSheet(workbook.Sheets['Bobines']);
			toast.info('Feuille Bobines trouvée', { position: toast.POSITION.TOP_RIGHT })
		}
		else if (workbook.Sheets['Brames']){
			Sheet = CleanExcelSheet(workbook.Sheets['Brames']);
			toast.info('Feuille Brames trouvée', { position: toast.POSITION.TOP_RIGHT })
		}
		else {
			Sheet = CleanExcelSheet(workbook.Sheets[workbook.SheetNames[0]]);
			toast.info('Feuille par defaut !', { position: toast.POSITION.TOP_RIGHT, autoClose: 1000 })
		}
		dispatch(DataAction.importData(utils.sheet_to_json(Sheet).map(cleanData)));
		dispatch(DataAction.changeOriginalpos("stock"));
	};
	reader.readAsBinaryString(file);
	}, []);

	return (
		<Container className="p-2">
			{loaded_catalog ? <Row>
				<Col>
					<DataTable />
				</Col>
				<Col>
					<Statistics />
				</Col>
			</Row> :
			<Row>
				<Col>
					<Dropzone onDrop={onDrop}>
						{({getRootProps, getInputProps, isDragActive}) => (
							<section className="dropzone">
								<div {...getRootProps()}>
									<input {...getInputProps()} />
									{
										isDragActive ?
											<p>                 </p> :
											<p>      Excel      </p>
									}
								</div>
							</section>
						)}
					</Dropzone>
				</Col>
			</Row>}
		<ToastContainer />
		
		</Container>
	);
}


export default Main;