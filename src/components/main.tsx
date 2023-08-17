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
			const DsheetName = workbook.SheetNames[0];
			const Dsheet = workbook.Sheets[DsheetName];
			const Drows:string [][] = utils.sheet_to_json(Dsheet, { header: 1 }); // Utilisation de header: 
			const Erows:string [][] = utils.sheet_to_json(Dsheet); // Utilisation de header: 
			
			const Dheader: string[] = ["N°", "RANG", "POS"];
			let suppRow = 0;
			for (let i = 0; i < 10; i++) {
				// if (i < Drows.length) {
					
					let zeup: string = Drows[i][0].toUpperCase(); 
					if (Dheader.includes(zeup)) {
						console.log('Header inclus dans la ligne n°', i + 1);
						//supp les rows precedentes sans header
						// for(let j = 0; j < suppRow; j++){
						// 	Drows.splice(j, 1); // Supprime la ligne où il n'y a pas d'en-tête
						// }
						//relance l'interval de sauvegarde et les disptach.
						break
					} else {
						console.log("Pas d'header dans la ligne n°", i + 1);
						suppRow = suppRow +1;
						// Drows.splice(i, 1); // Supprime la ligne où il n'y a pas d'en-tête
        				// i--; 				// Décrémente i pour compenser la suppression d'élément
					}
				// } else {
				// 	console.log('Index de ligne en dehors des limites du tableau.');
				// }
			}

			// dispatch(DataAction.importData(utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]).map(cleanData)));
			// // dispatch(DataAction.moveRow(row.original.reference)); //je change la detination de ref cale1,cale2, etc..
			// dispatch(DataAction.changeOriginalpos("stock"));
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