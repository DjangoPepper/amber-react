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

function cleanData(values: any): Data {
    return {
        weight: values["Poids"],
        position: values["Position"],
        prepa: values["Prépa"],
        rank: values["Rang"],
        reference: values["Référence"],
        destination: values["Destination"] || "Stock",
    }
}

function Main() {
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
                                            <p>Tu me poses ca ici gamin</p> :
                                            <p>Balance ton excel ou ton JSON ...</p>
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