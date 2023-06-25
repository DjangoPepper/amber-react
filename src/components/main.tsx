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
// import {useBeforeUnload} from "react-use";



// const Demo = () => {
// 	const [dirty, toggleDirty] = useToggle(false);
// 	useBeforeUnload(dirty, 'You have unsaved changes, are you sure?');

// 	return (
// 	<div>
// 		{dirty && <p>Try to reload or close tab</p>}
// 		<button onClick={() => toggleDirty()}>{dirty ? 'Disable' : 'Enable'}</button>
// 	</div>
// 	);
// };

function cleanData(values: any): Data {
	return {
		weight: values["Poids" || "POIDS"],
		position: values["Position" || "POSITION"],
		prepa: values["Prépa" || "PREPA"],
		rank: values["Rang" || "RANG" || "Num" || "NUM"],
		reference: values["Référence" || "N° bobine" || "N° PRODUIT"],
		destination: values["Destination" || "DESTINATION" || "Stock" ]
	}
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
											<p>Excel ou ton JSON ...</p>
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