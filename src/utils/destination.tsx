// import React from "react";
// import { connect } from 'react-redux';
// import { updateAffectationVisibility } from '../stores/dataS/destinationActions'
// import Statistics from '../components/statistics';

interface IHeader {
    key: string;
    name: string;
    default?: string;
}

export const HEADER: IHeader[] = [
    {key: "rank", name :"RANG" },
    {key: "prepa", name :"PREPA" },
    {key: "reference", name :"REF" },
    {key: "weight", name :"POIDS" },
    {key: "width", name :"LARGR" },
    {key: "length", name :"LONGUR" },
    {key: "position", name :"POS" },
    {key: "destination", name :"DEST", default: "NE" },
]



// export const colors = affectation.reduce<{[key: string]: string}>((obj, d) => {
//     obj[d.name] = d.color;
//     return obj;
// }, {})

