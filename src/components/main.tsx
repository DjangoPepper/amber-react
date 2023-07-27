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
		// const sentence = 'The quick brown fox jumps over the lazy dog.';
		// console.log(sentence.toUpperCase());
		// Expected output: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG."
		
		rank: values["Rang" || "RANG" || "rang"],
		prepa: values["Prépa" || "PREPA" || "prepa"],
		reference: values["Référence" || "REFERENCE" || "reference" || "REF"],
		weight: values["Poids" || "POIDS" || "poids"],
		position: values["Position" || "POSITION" || "position" || "POS"],
		destination: values["Destination" || "DESTINATION" || "destination" || "DEST" ]
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