import React from "react";

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
    {name: "Stock", color: "#fff"},
    {name: "Cale1", color: "#79b3f1"},
    {name: "Cale2", color: "#f85252"},
    {name: "Cale3", color: "#ee5bfa"},
    {name: "Cale4", color: "#aafa4c"},
    {name: "Cale5", color: "#fa6504"},
]


export const colors = destinations.reduce<{[key: string]: string}>((obj, d) => {
    obj[d.name] = d.color;
    return obj;
}, {})