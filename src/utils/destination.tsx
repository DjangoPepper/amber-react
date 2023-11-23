// import React from "react";
import { connect } from 'react-redux';
// import { updateAffectationVisibility } from '../stores/dataS/destinationActions'
import Statistics from '../components/statistics';

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
    {key: "width", name :"LARGEUR" },
    {key: "position", name :"POS" },
    {key: "destination", name :"DEST", default: "NE" },
]

export const affectation = [
    {name: "stock", color: "#ffffff", index:0,  visibleState:true,  previous_quantite: 0, previous_tonnes: 0, maxis_tonnes: 0},
    {name: "H1",    color: "#00c87a", index:1,  visibleState:false, previous_quantite: 0, previous_tonnes: 0, maxis_tonnes: 0},
    {name: "H2",    color: "#f447d1", index:2,  visibleState:false, previous_quantite: 0, previous_tonnes: 0, maxis_tonnes: 0},
    {name: "H3",    color: "#3cbefc", index:3,  visibleState:false, previous_quantite: 0, previous_tonnes: 0, maxis_tonnes: 0},
    {name: "H4",    color: "#ff9b2c", index:4,  visibleState:false, previous_quantite: 0, previous_tonnes: 0, maxis_tonnes: 0},
    {name: "H5",    color: "#800080", index:5,  visibleState:false, previous_quantite: 0, previous_tonnes: 0, maxis_tonnes: 0},
    {name: "H6",    color: "#80ff00", index:6,  visibleState:false, previous_quantite: 0, previous_tonnes: 0, maxis_tonnes: 0},
    {name: "H7",    color: "#f03c28", index:7,  visibleState:false, previous_quantite: 0, previous_tonnes: 0, maxis_tonnes: 0},
    {name: "H8",    color: "#006ee6", index:8,  visibleState:false, previous_quantite: 0, previous_tonnes: 0, maxis_tonnes: 0},
    {name: "H9",    color: "#fdff5b", index:9,  visibleState:false, previous_quantite: 0, previous_tonnes: 0, maxis_tonnes: 0},
    {name: "H10",   color: "#008000", index:10, visibleState:false, previous_quantite: 0, previous_tonnes: 0, maxis_tonnes: 0},
]

export const colors = affectation.reduce<{[key: string]: string}>((obj, d) => {
    obj[d.name] = d.color;
    return obj;
}, {})

const mapStateToProps = (state: { destination: { affectations: any; }; }) => {
  return {
    affectations: state.destination.affectations,
  };
};
