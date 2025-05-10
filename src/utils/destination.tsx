interface IHeader {
    key: string;
    name: string;
    default?: string;
}

// interface AffectationItem {
//     name: string;
//     color: string;
// }

export const HEADER: IHeader[] = [
    {key: "rank", name :"RANG" },
    {key: "prepa", name :"PREPA" },
    {key: "reference", name :"REF" },
    {key: "weight", name :"POIDS" },
    {key: "width", name :"LARGEUR" },
    {key: "length", name :"LONGEUR" },
    {key: "position", name :"POS" },
    {key: "destination", name :"DEST", default: "NE" },
]

export const affectation = [
    {name: "stock", color: "#ffffff", index:0,   },
    {name: "H1",    color: "#00c87a", index:1,   },
    {name: "H2",    color: "#f447d1", index:2,   },
    {name: "H3",    color: "#3cbefc", index:3,   },
    {name: "H4",    color: "#ff9b2c", index:4,   },
    {name: "H5",    color: "#800080", index:5,   },
    {name: "H6",    color: "#3cff00", index:6,   },
    {name: "H7",    color: "#3cfc28", index:7,   },
    {name: "H8",    color: "#3cfee6", index:8,   },
    {name: "H9",    color: "#3cff5b", index:9,   },
    {name: "H10",   color: "#3cbbbc", index:10,  },
    {name: "H11",   color: "#3eeefc", index:11,  },
    {name: "H12",   color: "#3ccbbc", index:12,  },
    {name: "H13",   color: "#3ccefc", index:13,  },
    {name: "H14",   color: "#3cbecc", index:14,  },
    {name: "H15",   color: "#3cbffc", index:15,  },
    {name: "H16",   color: "#3cbeec", index:16,  },
    {name: "H17",   color: "#3ceefc", index:17,  },
    {name: "H19",   color: "#3ccefc", index:18,  },
    {name: "H20",   color: "#3cbbfc", index:18,  },
    
]

export const colors = affectation.reduce<{[key: string]: string}>((obj, d) => {
    obj[d.name] = d.color;
    return obj;
}, {})

