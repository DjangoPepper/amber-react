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
        const cleanedKey = removeAccents(upperCaseKey);
        toUpperCaseKeysValues[cleanedKey] = values[key];
    }


    return {
        rank: toUpperCaseKeysValues["NUMERO"] || toUpperCaseKeysValues["RANG"] || toUpperCaseKeysValues["N°"],
        prepa: toUpperCaseKeysValues["PREPA"],
        reference: toUpperCaseKeysValues["REFERENCE"] || toUpperCaseKeysValues["REF"] || toUpperCaseKeysValues["COILS"] || toUpperCaseKeysValues["BRAMES"],
        weight: toUpperCaseKeysValues["POIDS"] || toUpperCaseKeysValues["TONS"],
        position: toUpperCaseKeysValues["POSITION"] || toUpperCaseKeysValues["POS"] || toUpperCaseKeysValues["ZONE"] || toUpperCaseKeysValues["STOCK"],
        destination: toUpperCaseKeysValues["DESTINATION"] || toUpperCaseKeysValues["DEST"]
    };
}


function Main() {
	const fredcolor="#fdff5b"
	const dispatch = useDispatch();
	const loaded = useSelector<RootState, boolean>(state => state.data.loaded);
	const onDrop = useCallback((acceptedFiles: any) => {
		// Do something with the files
		const file = acceptedFiles[0];
		const reader = new FileReader();
		// const name = file.name;
		reader.onload = function (evt) {
			const rawData = evt.target?.result;
			if(!rawData) return;
			const workbook = read(rawData, {type: 'binary'});
			dispatch(DataAction.importData(utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]).map(cleanData)));
			// dispatch(DataAction.moveRow(row.original.reference)); //je change la detination de ref cale1,cale2, etc..
			dispatch(DataAction.changeOriginalpos("stack"));
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
											<p>Poses ca ici</p> :
											<p>Excel</p>
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