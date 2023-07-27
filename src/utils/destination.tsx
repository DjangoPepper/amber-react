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
    {key: "position", name :"POS" },
    {key: "destination", name :"DEST", default: "Stock" },
]

export const destinations = [
    {name: "Sto", color: "#fff"},
    {name: "C1", color: "#00c87a"},
    {name: "C2", color: "#3cbefc"},
    {name: "C3", color: "#9d64e2"},
    {name: "C4", color: "#f447d1"},
    {name: "C5", color: "#fdff5b"},
]


export const colors = destinations.reduce<{[key: string]: string}>((obj, d) => {
    obj[d.name] = d.color;
    return obj;
}, {})