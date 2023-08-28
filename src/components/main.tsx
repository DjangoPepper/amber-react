import React, {useCallback} from 'react'
import Dropzone from 'react-dropzone'
import {Col, Container, Row} from "react-bootstrap";
import {read, utils} from "xlsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores/rootStore";
import {Data} from "../stores/data/DataReducer";
import DataAction from "../stores/data/DataAction";
import DataTable from "./data-table";
import Statistics from "./statistics";
// import XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Modal from "react-modal"; // Vérifiez si le chemin est correct
let ShowLine: number[] = [];

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
        
        if (firstCell !== undefined && typeof firstCell.v === 'number') {
            // Insérer la ligne dans la nouvelle feuille
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellAddress = utils.encode_cell({ r: row, c: col });
                const cell = sheet[cellAddress];
                if (cell !== undefined) {
                    copiedSheet[utils.encode_cell({ r: newRow, c: col })] = cell;
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
                sheet[cellAddress] = { t: "n", v: "", h: "", w: "" };
            }
        }
    }
}
  
function deleteLine(newsheet: any, row: number) {
	const range = utils.decode_range(newsheet['!ref']);
	for (let col = range.s.c; col <= range.e.c; col++) {
		const cellAddress = utils.encode_cell({ r: row, c: col });
		delete newsheet[cellAddress];
	}
}
  

function estLignevide(sheet: any, row: number): boolean {
	const range = utils.decode_range(sheet['!ref']);
	ShowLine = [];
	
	for (let col = range.s.c; col <= range.e.c; col++) {
		const cellAddress = utils.encode_cell({ r: row, c: col });
		const cell = sheet[cellAddress];
		if (cell === undefined || cell === null || cell.v === ''){
			ShowLine.push(0);
		} else {
			ShowLine.push(cell.v);
		}

	  if (cell !== null && cell !== undefined && cell.v !== '') {
		return false; // Au moins une cellule n'est pas vide
	  }
	}
	
	return true; // Toutes les cellules sont vides
}

function estD3Vide(sheet: any, row: number): boolean {
const range = utils.decode_range(sheet['!ref']);

for (let col = range.s.c; col <= Math.min(range.s.c + 2, range.e.c); col++) {
	const cellAddress = utils.encode_cell({ r: row, c: col });
	const cell = sheet[cellAddress];

	if (cell === undefined || cell === null || cell.v === ''){
		ShowLine.push(0);
		return true;
	} else {
		ShowLine.push(cell.v);
		return false;
	}

//   if (cell === null || cell === undefined || cell.v === '') {
// 	return true; // Au moins une des trois premières cellules est vide
//   }
}
return false; // Aucune des trois premières cellules n'est vide
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

function removeBalisesXml(newSheet: any) {
	// Supprimer le contenu entre '<t' et '>' dans chaque cellule de 'newSheet'
	for (const cellKey in newSheet) {
		if (newSheet.hasOwnProperty(cellKey) && cellKey !== ('!ref' || '!margins' || '!autofilter')) {
			const cell = newSheet[cellKey];
			if (cell && cell.r) {
				cell.r = cell.r.replace(/<t[^>]*>/g, '<t>');
			}
		}
		// if (newSheet.hasOwnProperty(cellKey) && cellKey === '!margins' ) {
		// 	// const cellM = newSheet[cellKey];

		// }
	}
}

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

function cleanData(values: any): Data {
	const toUpperCaseKeysValues: any = {};
	for (const key in values) {
		const upperCaseKey = key.toUpperCase();
		// if (upperCaseKey in values ) {console.log("fred", values,upperCaseKey);}
		const cleanedKey = removeAccents(upperCaseKey);
		toUpperCaseKeysValues[cleanedKey] = values[key];
	}

    return {
        rank: toUpperCaseKeysValues["POS"] || toUpperCaseKeysValues["NUMERO"] || toUpperCaseKeysValues["RANG"] || toUpperCaseKeysValues["N°"],
        prepa: toUpperCaseKeysValues["ZONE"] || toUpperCaseKeysValues["PREPA"] ,
        reference: toUpperCaseKeysValues["N° PRODUIT"] ||  toUpperCaseKeysValues["REFERENCE"] || toUpperCaseKeysValues["REF"] || toUpperCaseKeysValues["COILS"] || toUpperCaseKeysValues["BRAMES"],
        weight: toUpperCaseKeysValues["POIDS"] || toUpperCaseKeysValues["TONS"],
        position: toUpperCaseKeysValues["POSITION"],
        destination: toUpperCaseKeysValues["DESTINATION"] || toUpperCaseKeysValues["DEST"] || "stock"
    };
}



function Main() {
	const dispatch = useDispatch();
	const loaded = useSelector<RootState, boolean>(state => state.data.loaded);
	
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
			toast.info('winwin SIMPLIFIED sheet exist', { position: toast.POSITION.TOP_RIGHT })
				
		} 
		else if (workbook.Sheets['Bobines']){
			Sheet = workbook.Sheets['Bobines'];
			toast.info('Bobines EXTENDED sheet exist', { position: toast.POSITION.TOP_RIGHT })// la feuille Bobines existe
			
			reconstructRefWithoutEmptyRows(Sheet);
			
			// // effacement des cellules fusionnées
			deleteExcelMergesInfos(Sheet);

			// Traitement des margins
			deleteExcelMarginsInfos(Sheet);

			// Résoudre les formules
			risolveFormulas(Sheet);

			//enleve les infos XML  dans r 
			removeBalisesXml(Sheet);

			// //trouve la ligne de la feuille avec les headers
			const headersRow = findHeaderRow(Sheet, ['N°','NUMERO', 'RANG', 'POS']);
			
			//creer les cellules vides
			fillUndefinedNumberCells(Sheet);

			//cree une copie de la feuille simplifiée avec les headers en premier puis toutes les cellules  dont la premiere celulles est un nombre			
			Sheet = copySheetWithHeadersAndNumbers(Sheet, headersRow);



		}
		else {
			Sheet = workbook.Sheets[workbook.SheetNames[0]];
			toast.error('winwin or Bobines sheet does not exist', { position: toast.POSITION.TOP_RIGHT })
			toast.info('sheet0 successfully imported !', { position: toast.POSITION.TOP_RIGHT })				
		}
		
		// Utilisez le nouvel objet newSheet comme vous le feriez avec sheet
		// console.log("New sheet with removed content:", newSheet);
		
		dispatch(DataAction.importData(utils.sheet_to_json(Sheet).map(cleanData)));
		// dispatch(DataAction.importData(utils.sheet_to_json(sheet).map(cleanData)));
		// dispatch(DataAction.importData(utils.sheet_to_json(selectedSheet).map(cleanData)));
			// // dispatch(DataAction.moveRow(row.original.reference)); //je change la detination de ref cale1,cale2, etc..
		dispatch(DataAction.changeOriginalpos("stock"));
		toast.success('Data imported successfully!', { position: toast.POSITION.TOP_RIGHT })
	};
		reader.readAsBinaryString(file);
	}, []);

	return (
		<Container className="p-2">
			{loaded ? <Row>
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