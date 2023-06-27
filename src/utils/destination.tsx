// import React from "react";

interface IHeader {
    key: string;
    name: string;
    default?: string;
}

export const HEADER: IHeader[] = [
    {key: "weight", name :"Poids" },
    {key: "position", name :"Position" },
    {key: "prepa", name :"Prépa" },
    {key: "rank", name :"Rang" },
    {key: "reference", name :"Référence" },
    {key: "destination", name :"Destination", default: "Stock" },
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