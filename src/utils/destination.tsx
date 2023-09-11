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

export const destinations = [
    {name: "stock", color: "#fff", index:0},
    {name: "C1", color: "#00c87a", index:1},
    {name: "C2", color: "#3cbefc", index:2},
    {name: "C3", color: "#9d64e2", index:3},
    {name: "C4", color: "#f447d1", index:4},
    {name: "C5", color: "#fdff5b", index:5},
]


export const colors = destinations.reduce<{[key: string]: string}>((obj, d) => {
    obj[d.name] = d.color;
    return obj;
}, {})