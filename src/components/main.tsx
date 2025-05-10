import React, {useCallback, useState} from 'react'
import Dropzone from 'react-dropzone'
import {Col, Container, Row} from "react-bootstrap";
import {read, utils} from "xlsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores/rootStore";
import {export_stepe_catalog_Data, ICale} from "../stores/dataS/DataReducer";
import DataAction from "../stores/dataS/DataAction";
import DataTable from "./data-table";
import Statistics from "./statistics";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function CleanExcelSheet(oSheet: any): export_stepe_catalog_Data {
	toast.info('Allegement feuille', { position: toast.POSITION.TOP_RIGHT,autoClose: 1000 })// la feuille Bobines existe
			
			// effacement des cellules fusionnées
			deleteExcelMergesInfos(oSheet);

			// Traitement des margins
			deleteExcelMarginsInfos(oSheet);

			// Traitement des lignes vides
			reconstructRefWithoutEmptyRows(oSheet);
			
			// Résolution des formules
			risolveFormulas(oSheet);

			// Supprimer les proprietes inutiles
			removeProprietes(oSheet);

			//Suppression des infos XML dans r 
			// removeBalisesXml(oSheet);

			// //trouve la ligne de la feuille avec les headers
			const headersRow = findHeaderRow(oSheet, ['N°','NUMERO', 'RANG', 'POS', 'POSITION']);
			
			//creer les cellules vides
			fillUndefinedNumberCells(oSheet);

			//cree une copie de la feuille simplifiée avec les headers en premier puis toutes les cellules  dont la premiere celulles est un nombre			
			oSheet = copySheetWithHeadersAndNumbers(oSheet, headersRow);

			// Suppression des lignes Null
			SuppressionCellulesNull(oSheet);

			// reconstruction de la propriété !ref;
			reconstruitRef(oSheet, oSheet['!ref']);
			// deleteExcelMergesInfos(oSheet);

			// Supprimer les apostrophes
			// SupprimerLesApostrophes(oSheet);

			return oSheet;

}

function removeProprietes(newsheet: any) {
	// const range = utils.decode_range(!ref);
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
				// newRef = cellAddress;
				newRef = utils.encode_range({ s: { c: 0, r: 0 }, e: { c: Rcol, r: Rrow }});
			}
		}
	}
	// newRef = utils.encode_range({ s: { c: 0, r: 0 }, e: { c: utils.decode_col(newRef), r: utils.decode_row(newRef)}});	
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
				// newRef = cellAddress;
				newRef = utils.encode_range({ s: { c: 0, r: 0 }, e: { c: Rcol, r: Rrow }});
			}
		}
	}
	// newRef = utils.encode_range({ s: { c: 0, r: 0 }, e: { c: utils.decode_col(newRef), r: utils.decode_row(newRef)}});	
	return newRef;
}

function SuppressionCellulesNull(newsheet: any): any {
	const range = utils.decode_range(newsheet['!ref']);
	let startRow = range.s.r;
	let endRow = range.e.r;
	let startCol = range.s.c;
	let endCol = range.e.c;
	

	while (endRow >= startRow) {

		// for (let col = startCol; col <= endCol; col++) {
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

    // Copier les headers à la première ligne
    for (let col = range.s.c; col <= range.e.c; col++) {
        const headerCellAddress = utils.encode_cell({ r: headersRow, c: col });
        const cell = sheet[headerCellAddress];
        if (cell !== undefined) {
            copiedSheet[utils.encode_cell({ r: 0, c: col })] = cell;
        }
    }

    let newRow = 1; // Nouvelle ligne à insérer
    for (let row = headersRow + 1; row <= range.e.r; row++) {
        const firstCellAddress = utils.encode_cell({ r: row, c: range.s.c });
        const firstCell = sheet[firstCellAddress];
		// const thirdCellAddress = utils.encode_cell({ r: row, c: range.s.c +2});
        // const thirdCell = sheet[firstCellAddress];

        
        if (firstCell !== undefined && typeof firstCell.v === 'number') {
            // Insérer la ligne dans la nouvelle feuille
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

    // Mettre à jour !ref
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
        for (let row = range.e.r; row > endRow; row--) {
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
}

function removeAccents(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


function Main() {
	const dispatch = useDispatch();
	const loaded_catalog = useSelector<RootState, boolean>(state => state.dataSS.loaded_catalog_status);
	// const loaded_catalog = useSelector<RootState, boolean>(state => state.data.loaded_catalog_status);

	const calesPerName: {[key: string]: string} = useSelector<RootState, ICale[]>(state => state.dataSS.cales).reduce((acc: any, cale: ICale) => {
		acc[cale.name] = cale.uid;
		return acc;
	}, {});

	function cleanData(values: any): export_stepe_catalog_Data {
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
			destination: calesPerName[toUpperCaseKeysValues["DESTINATION"]] || calesPerName[toUpperCaseKeysValues["DEST"]] || calesPerName["stock"]
		};
	}
	
	const onDrop = useCallback((acceptedFiles: any) => {
		
	const file = acceptedFiles[0];
	const reader = new FileReader();
	
	reader.onload = function (evt) {

		const rawData = evt.target?.result;
		if(!rawData) return;
		
		const workbook = read(rawData, {type: 'binary'});
		// const sheetName = workbook.SheetNames[0];
		
		let Sheet: { [key: string]: any } = {
			// ...FirstSheet,
		};

		if (workbook.Sheets['winwin']){																// la feuille simplifiée existe
				Sheet = workbook.Sheets['winwin'];
				toast.info('Feuille  Simplifiée trouvée', { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 })
				// toast('🦄 Wow so easy!', {
				// 	position: "top-right",
				// 	autoClose: 5000,
				// 	hideProgressBar: false,
				// 	closeOnClick: true,
				// 	pauseOnHover: true,
				// 	draggable: true,
				// 	progress: undefined,
				// 	theme: "light",
				// 	});
				
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
			// Sheet = workbook.Sheets[workbook.SheetNames[0]];
			Sheet = CleanExcelSheet(workbook.Sheets[workbook.SheetNames[0]]);
			// toast.error("Defined sheet doesn't exist", { position: toast.POSITION.TOP_RIGHT })
			toast.info('Feuille par defaut !', { position: toast.POSITION.TOP_RIGHT, autoClose: 1000 })
							
		}
		
		// Utilisez le nouvel objet newSheet comme vous le feriez avec sheet
		// console.log("New sheet with removed content:", newSheet);
		
		dispatch(DataAction.importData(utils.sheet_to_json(Sheet).map(cleanData)));
		// dispatch(DataAction.importData(utils.sheet_to_json(sheet).map(cleanData)));
		// dispatch(DataAction.importData(utils.sheet_to_json(selectedSheet).map(cleanData)));
			// // dispatch(DataAction.moveRow(row.original.reference)); //je change la detination de ref cale1,cale2, etc..
		dispatch(DataAction.changeOriginalpos());
		// toast.success('catalog export_stepe_catalog_Data imported', { position: toast.POSITION.TOP_RIGHT })
	};
	reader.readAsBinaryString(file);
	}, []);
	// const [mavariablelocale, setMavariablelocale] = useState()

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