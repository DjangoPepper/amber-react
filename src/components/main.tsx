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


//Traitement des margins
function cleanMargins(newsheet: any) {
	const margins = newsheet['!margins'];
		if (margins) {
			delete newsheet['!margins'];
		}
};

//Traitement des merge
function cleanMerges(newsheet: any) {
	const merges = newsheet['!merges'];
		if (merges) {
			delete newsheet['!merges'];
		}
};


function handleMergedCells(newsheet: any, rangeList: any) {
	//on traduit les merges en avec une valeur par defaut
	const defaultCellValue = '°'; // Remplacez par la valeur que vous souhaitez

	for (
		const rangeObj of rangeList) {
		const startRow = rangeObj.s.r;
		const endRow = rangeObj.e.r;
		const startCol = rangeObj.s.c;
		const endCol = rangeObj.e.c;

		for (let row = startRow; row <= endRow; row++) {
			for (let col = startCol; col <= endCol; col++) {
				const cellAddress = utils.encode_cell({ r: row, c: col });
				if (!newsheet[cellAddress]) {
					newsheet[cellAddress] = { t: 's', v: defaultCellValue };
				}
			}
		}
	}
}

function scanFeuilles(newsheet: any) {
	if (newsheet['!ref']) {
		const range = utils.decode_range(newsheet['!ref']);
		
		/* function createEmptyCell(cellAddress: string) {
			// Créer une nouvelle cellule avec la valeur souhaitée
			if(!cellAddress){
				newsheet[cellAddress] = { h: '0', r:'0', t: '0', v: '0', w: '0'}; 
			}	
		} */


        for (let row = range.s.r; row <= range.e.r; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
				const cellAddress = utils.encode_cell({ r: row, c: col });
                const cell = newsheet[cellAddress];
				
				// Vérifier si la cellule est defined, exist
				if (cell === undefined) {
					// Créer une nouvelle cellule avec la valeur souhaitée
					//newsheet[cellAddress] = { h: '0', r:'0', t: '0', v: '0', w: '0'}; 
					if(!cellAddress){
						newsheet[cellAddress] = { h: '0', r:'0', t: '0', v: '0', w: '0'}; 
					}
				} else {
					// la cellule existe
					
					// Vérifier si la cellule contient un des headers
					// if (cell && headers.includes(cell.v)) {
					//     return row;
					// }
					
					// Vérifier si la cellule contient une formule


				}
            }
        }
    }
}
function removeXML(newSheet: any) {
	// Supprimer le contenu entre '<t' et '>' dans chaque cellule de 'newSheet'
	for (const cellKey in newSheet) {
		if (newSheet.hasOwnProperty(cellKey) && cellKey !== ('!ref' || '!margins' || '!autofilter')) {
			const cell = newSheet[cellKey];
			if (cell && cell.r) {
				cell.r = cell.r.replace(/<t[^>]*>/g, '<t>');
			}
		}
		if (newSheet.hasOwnProperty(cellKey) && cellKey == '!margins' ) {
			// const cellM = newSheet[cellKey];

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
	
	const resolveFormulas = (newsheet: any) => {
        const range = utils.decode_range(newsheet['!ref']);
        for (let row = range.s.r; row <= range.e.r; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
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
				
				// Traitement des merges				
				handleMergedCells(Sheet, Sheet['!merges']);
				
				// Traitement des merges
				cleanMerges(Sheet);


				// Traitement des margins
				cleanMargins(Sheet);


				// Résoudre les formules et copier les valeurs
                resolveFormulas(Sheet);

				//boucle qui parcours toutes les lignes puis toutes le feuilles.
				scanFeuilles(Sheet);


				// suppression/effacement des lignes/cellules fusionnés ou des fusions a voir.
				// suppression des lignes dont la colonne A n'est pas un numéro.
				// traitement des formules.
				// simplification des proprietes html de r.
				// localisation et positionement des headers utiles en lignes 1. 
				//
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