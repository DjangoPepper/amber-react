// import React from "react";

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
    {name: "stock", color: "#ffffff", index:0},
    {name: "H1",    color: "#00c87a", index:1},
    {name: "H2",    color: "#f447d1", index:2},
    {name: "H3",    color: "#3cbefc", index:3},
    {name: "H4",    color: "#ff9b2c", index:4},
    {name: "H5",    color: "#800080", index:5},
    {name: "H6",    color: "#80ff00", index:6},
    {name: "H7",    color: "#f03c28", index:7},
    {name: "H8",    color: "#006ee6", index:8},
    {name: "H9",    color: "#fdff5b", index:9},
    {name: "H10",   color: "#008000", index:10},
]


export const colors = affectation.reduce<{[key: string]: string}>((obj, d) => {
    obj[d.name] = d.color;
    return obj;
}, {})