import {read, utils} from "xlsx";
import {export_stepe_Data} from "../stores/dataS/DataReducer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./fonctionsAdd";
import { parse } from "path";


export function CleanExcelSheet(oSheet: any): export_stepe_Data {
	
	// Recuperation du range de la feuille
	let rangeInfo = PowerRanger(oSheet)
	
	toast.info('Nettoyage de la feuille excel', { position: toast.POSITION.TOP_RIGHT, autoClose: 1000 })// la feuille Bobines existe

	// effacement des fusions
	deleteExcelMergesInfos(oSheet);

	// Supression des marges d'impression
	deleteExcelMarginsInfos(oSheet);

	/*+ // Traitement des lignes vides
	reconstructRefWithoutEmptyRows(oSheet); */

	// Résolution des formules
	risolveFormulas(oSheet, rangeInfo);

	/*+ // Supprimer les proprietes inutiles
	removeProprietes(oSheet); */

	/* - */
	// reconstruction de la propriété !ref;
	reconstructRefWithoutEmptyRows(oSheet, rangeInfo);

	/* - */
	// Mise a jour rangeInfo
	rangeInfo = PowerRanger(oSheet)

	/* - */
	// Suppression des lignes Null
	SuppressionCellulesNull(oSheet, rangeInfo);

	// //trouve la ligne de la feuille avec les headers
	const headersRow = findHeaderRow(oSheet, ['N°','NUMERO', 'RANG', 'POS', 'POSITION'], rangeInfo);

	/* //creer les cellules vides
	fillUndefinedNumberCells(oSheet); */

	//place les headers en premier puis toutes les cellules dont la premiere celulles est un nombre			
	oSheet = copySheetWithHeadersAndNumbers(oSheet, headersRow, rangeInfo);

	// reconstruction de la propriété !ref;
	reconstructRefWithoutEmptyRows(oSheet, rangeInfo);

	// renvoi la nouvelle feuille
	return oSheet;
}

interface RangeInfo {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
}


function PowerRanger(newsheet: any) {
    let range = utils.decode_range(newsheet['!ref']);
    let startRow = range.s.r;
	let startCol = range.s.c;
    let endRow = range.e.r;
    let endCol = range.e.c;
    // Renvoie les valeurs dans un objet RangeInfo
    return { startRow, endRow, startCol, endCol };
}

function SuppressionCellulesNull(newsheet: any, rangeInfo: RangeInfo): any {
	let startRow = rangeInfo.startRow;
	let endRow = rangeInfo.endRow;
	let startCol = rangeInfo.startCol;
	let endCol = rangeInfo.endCol;

	while (endRow >= startRow) {

		// for (let col = startCol; col <= endCol; col++) {
		for (let col = endCol; col >= startCol; col--) {
			const cellAddress = utils.encode_cell({ r: endRow, c: col });
			const cell = newsheet[cellAddress];

			if (cell === undefined || cell.v === null || Number.isNaN(cell.v) || cell.v === '') {
                delete newsheet[cellAddress];
            } else {
				if (cell && cell.t === 's' && cell.v.startsWith("'")) { 
					// Supprimer les apostrophes dans la valeur de la cellule
					cell.v = cell.v.substring(1);
				}
				if (cell && cell.t === 's') {
					// Supprimer les espaces dans cell.v si le type est 's' (chaîne de caractères)
					cell.v = cell.v.replace(/\s+/g, '');
				}
				if (cell && cell.w ) { 
					delete cell.w;}
				if (cell && cell.h ) { 
					delete cell.h;}
				if (cell && cell.r ) { 
					delete cell.r;}
			}			
		}
    endRow--;
  	}
  	return newsheet;
}

function copySheetWithHeadersAndNumbers(sheet: any, headersRow: number, rangeInfo: RangeInfo): any {
    // const range = utils.decode_range(sheet['!ref']);
    const startRow = rangeInfo.startRow;
	const endRow = rangeInfo.endRow;
	const startCol = rangeInfo.startCol;
	const endCol = rangeInfo.endCol;
	const copiedSheet: any = {};

    // Copier les headers à la première ligne
    for (let col = startCol; col <= endCol; col++) {
        const headerCellAddress = utils.encode_cell({ r: headersRow, c: col });
        const cell = sheet[headerCellAddress];
        
		
		// if (cell === undefined || cell === null) { 
		// 	copiedSheet[utils.encode_cell({ r: 0, c: col })] = { v: 'vide', t: 's' };
		// }
		
		
		if (cell !== undefined ) {
            copiedSheet[utils.encode_cell({ r: 0, c: col })] = cell; 
		}
		
		
    }

    let newRow = 1; // Nouvelle ligne à insérer
    for (let row = headersRow + 1; row <= endRow; row++) {
        const firstCellAddress = utils.encode_cell({ r: row, c: startCol });
        const firstCell = sheet[firstCellAddress];
		// const thirdCellAddress = utils.encode_cell({ r: row, c: startCol +2});
        // const thirdCell = sheet[firstCellAddress];

        
        if (firstCell !== undefined && typeof firstCell.v === 'number') {
            // Insérer la ligne dans la nouvelle feuille
            for (let col = startCol; col <= endCol; col++) {
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

    // Mettre à jour !ref
    const newref = {
        s: { c: startCol, r: 0 },
        e: { c: endCol, r: newRow - 1 },
    };
    copiedSheet['!ref'] = utils.encode_range(newref);

    return copiedSheet;
}
  
function reconstructRefWithoutEmptyRows(newsheet: any, rangeInfo: RangeInfo): any {
    // const range = utils.decode_range(newsheet['!ref']);
    let newRef = '';

	const startRow = rangeInfo.startRow;
	let endRow = rangeInfo.endRow;
	const startCol = rangeInfo.startCol;
	let endCol = rangeInfo.endCol;

    // Trouver la dernière ligne non vide
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
        // Supprimer les lignes vides en partant de la dernière ligne
        for (let row = endRow; row > endRow; row--) {
            for (let col = startCol; col <= endCol; col++) {
                const cellAddress = utils.encode_cell({ r: row, c: col });
                delete newsheet[cellAddress];
            }
        }

        // Mettre à jour la propriété !ref avec la nouvelle valeur
        newRef = utils.encode_range({ s: { c: startCol, r: startRow }, e: { c: endCol, r: endRow } });
        newsheet['!ref'] = newRef;
    }

    return newsheet;
}

//trouve la ligne avec les headers
/* function findHeaderRow (newsheet: any, headers: string[], rangeInfo: RangeInfo): number | 0 {
	// const range = utils.decode_range(newsheet['!ref']);
    let newref = '';
	const startRow = rangeInfo.startRow;
	const endRow = rangeInfo.endRow;
	const startCol = rangeInfo.startCol;
	const endCol = rangeInfo.endCol;

	for (let frow = startRow; frow <= endRow; frow++) {
		for (let fcol = startCol; fcol <= endCol; fcol++) {
			const cellAddress = utils.encode_cell({ r: frow, c: fcol });
			if(cellAddress){
				const cell = newsheet[cellAddress];
				if (cell.v !== undefined && cell.v !== null && cell && headers.includes(cell.v.toUpperCase())) {
					return frow;
				}
			}
		}
	}
	
	return 0;
}; */
function findHeaderRow(newsheet: any, headers: string[], rangeInfo: RangeInfo): number | 0 {
    const startRow = rangeInfo.startRow;
    const endRow = rangeInfo.endRow;
    const startCol = rangeInfo.startCol;
    const endCol = rangeInfo.endCol;

    for (let frow = startRow; frow <= endRow; frow++) {
        for (let fcol = startCol; fcol <= endCol; fcol++) {
            const cellAddress = utils.encode_cell({ r: frow, c: fcol });
            const cell = newsheet[cellAddress];

            if (cell && cell.v !== undefined && cell.v !== null && headers.includes(cell.v.toUpperCase())) {
                return frow;
            }
        }
    }

    return 0;
}

//Traitement des margins
function deleteExcelMarginsInfos(newsheet: any) {
	const margins = newsheet['!margins'];
		if (margins) {
			delete newsheet['!margins'];
		}
};

//Traitement des merge
function deleteExcelMergesInfos(newsheet: any) {
	const merges = newsheet['!merges'];
		if (merges) {
			delete newsheet['!merges'];
		}
};

function risolveFormulas(newsheet: any, rangeInfo: RangeInfo){
	// const range = utils.decode_range(newsheet['!ref']);
	for (let row = rangeInfo.startRow; row <= rangeInfo.endRow; row++) {
		for (let col = rangeInfo.startCol; col <= rangeInfo.endCol; col++) {
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
}

function removeAccents(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function cleanData(values: any): export_stepe_Data {
	const toUpperCaseKeysValues: any = {};
	for (const key in values) {
		const upperCaseKey = key.toUpperCase();
		// if (upperCaseKey in values ) {console.log("fred", values,upperCaseKey);}
		const cleanedKey = removeAccents(upperCaseKey);
		// const cleanedKey = removeAccentsAndApostrophes(upperCaseKey);
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
}
