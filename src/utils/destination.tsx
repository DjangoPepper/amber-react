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
    {name: "stock", color: "#ffffff", index:0,  checkbox_Hold_State: false},
    {name: "H1",    color: "#00c87a", index:1,  checkbox_Hold_State: false},
    {name: "H2",    color: "#f447d1", index:2,  checkbox_Hold_State: false},
    {name: "H3",    color: "#3cbefc", index:3,  checkbox_Hold_State: false},
    {name: "H4",    color: "#ff9b2c", index:4,  checkbox_Hold_State: false},
    {name: "H5",    color: "#800080", index:5,  checkbox_Hold_State: false},
    {name: "H6",    color: "#80ff00", index:6,  checkbox_Hold_State: false},
    {name: "H7",    color: "#f03c28", index:7,  checkbox_Hold_State: false},
    {name: "H8",    color: "#006ee6", index:8,  checkbox_Hold_State: false},
    {name: "H9",    color: "#fdff5b", index:9,  checkbox_Hold_State: false},
    {name: "H10",   color: "#008000", index:10, checkbox_Hold_State: false},
]


export const colors = affectation.reduce<{[key: string]: string}>((obj, d) => {
    obj[d.name] = d.color;
    return obj;
}, {})