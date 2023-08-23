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
import XLSX from 'xlsx'

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
			const sheetName = workbook.SheetNames[0];
			const sheetWinwin = workbook.Sheets['winwin'];
			const sheet = workbook.Sheets[sheetName];

			//
			// const sheetRange = sheet['!ref']; // Valeur au format 'A1:X10' par exemple
			// const sheetAutofilter = sheet['!autofilter'] //valeur au format "B4:E4" par exemple
			// const sheetMargins = sheet['!margins']	//
			// if (sheet['!margins']) {
            //     delete sheet['!margins'];
            // }
			// /* {
			// 	left: 0.7086614173228347,
			// 	right: 0.7086614173228347,
			// 	top: 0.7480314960629921,
			// 	bottom: 0.7480314960629921,
			// 	header: 0.31496062992125984,
			// 	footer: 0.31496062992125984,
			//   } */
            // console.log("Sheet range: ", sheetRange);
			// console.log("Sheet autofilter: ", sheetAutofilter);
			// console.log("Sheet margins: ", sheetMargins);
			
			// // Créer un nouvel objet ressemblant à sheet avec la clé et la valeur de la plage
            // /* const newSheet = {
            //     ...sheet,
            //     '!ref': sheetRange
            // }; */
			const newSheet: { [key: string]: any } = {
				...sheet,
				// '!ref': sheetRange
			};

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
            
			// Utilisez le nouvel objet newSheet comme vous le feriez avec sheet
            console.log("New sheet with removed content:", newSheet);



			//
			dispatch(DataAction.importData(utils.sheet_to_json(newSheet).map(cleanData)));
			// dispatch(DataAction.importData(utils.sheet_to_json(sheet).map(cleanData)));
			// dispatch(DataAction.importData(utils.sheet_to_json(selectedSheet).map(cleanData)));
				// // dispatch(DataAction.moveRow(row.original.reference)); //je change la detination de ref cale1,cale2, etc..
			dispatch(DataAction.changeOriginalpos("stock"));
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
		</Container>
	);
}


export default Main;