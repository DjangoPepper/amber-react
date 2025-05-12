import React from "react";
import { SketchPicker, ColorResult } from "react-color";
import { useState } from 'react';
import {
    createColumnHelper,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    RowData,
    SortingState,
    useReactTable,
    getPaginationRowModel
    } from "@tanstack/react-table";

import {utils, writeFile } from "xlsx";
import {Button, Modal, Form, Table as TableRS} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores/rootStore";
import {export_stepe_catalog_Data, ICale} from "../stores/dataS/DataReducer";
import DebouncedInput from "./debounceInput";
import DataAction from "../stores/dataS/DataAction";
import {HEADER} from "../utils/destination";
import Filter, {fuzzyFilter} from "./filter";
import './index-tanstack.css'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Msg2 from "./Msg2";
import {v4 as uuidv4} from 'uuid';
import SpaceatPos from "./SpaceatPos";
import Msg from "./Msg";

const monthNames = [
    'jan', 'fev', 'mar', 'avr', 'mai', 'juin',
    'juil', 'aou', 'sep', 'oct', 'nov', 'dec'
    ];

const pageOptions = [10, 40, 80, 120, 200];

interface ICalesModalProps {
    show: boolean
    onHide: () => void;
}

function CalesModal({show, onHide}: ICalesModalProps) {
    const dispatch = useDispatch();
    const cales = useSelector<RootState, ICale[]>(state => state.dataSS.cales);
    const [newCales, setNewCales] = useState(cales);
    const [newName, setNewName] = useState('');

    const generateRandomBlueGreenColor = (): string => {
        const r = Math.floor(Math.random() * 50);
        const g = Math.floor(150 + Math.random() * 105);
        const b = Math.floor(150 + Math.random() * 105);
        const toHex = (value: number) => value.toString(16).padStart(2, "0");
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const [newColor, setNewColor] = useState(generateRandomBlueGreenColor());

    const handleSaveParams = () => {
        dispatch(DataAction.resetCales(newCales));
        onHide();
    };

    const addCale = () => {
        setNewCales([
            ...newCales,
            {
                uid: uuidv4(),
                name: newName,
                color: newColor,
                index: newCales.length,
                previous_quantite: 0,
                previous_tonnes: 0,
                maxis_tonnes: 0,
                boxed_state: false,
            }
        ]);
        setNewName("");
        setNewColor(generateRandomBlueGreenColor());
    }

    const renameCale = (uid: string, name: string) => {
        if(name === 'stock') {
            alert('Je crois pas non')
            return;
        }
        const updatedCales = [];
        for(const c of newCales) {
            if(c.uid === uid) {
                updatedCales.push({...c, name});
            } else {
                updatedCales.push(c);
            }
        }
        setNewCales(updatedCales);
    }

    const deleteCale = (uid: string) => {
        setNewCales(newCales.filter((d) => d.uid !== uid));
    }

    return <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Gestion des Affectations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
                {/* <h3>Gestion des Affectations</h3> */}
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "40%", border: "1px solid #ddd", padding: "8px" }}>Nom</th>
                            <th style={{ width: "40%", border: "1px solid #ddd", padding: "8px" }}>Couleur</th>
                            <th style={{ width: "20%", border: "1px solid #ddd", padding: "8px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newCales.map((a) => (
                            <tr key={a.uid}>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{a.name}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    <div
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            backgroundColor: a.color,
                                            border: "1px solid #000",
                                        }}
                                    ></div>
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    <button onClick={() => deleteCale(a.uid)}>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                        type="text"
                        placeholder="Nom"
                        maxLength={10}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        style={{ width: "150px" }}
                    />
                    <input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        style={{ width: "40px", height: "28px", padding: "0", border: "none" }}
                    />
                    <button onClick={addCale} disabled={!newName.trim()}>
                        Ajouter
                    </button>
                    <button
                        onClick={() => {
                            addCale();
                            // Utiliser directement la nouvelle cale dans data-table
                            if (newCales.length > 0) {
                                const lastCale = {
                                    uid: uuidv4(),
                                    name: newName,
                                    color: newColor,
                                    index: newCales.length,
                                    previous_quantite: 0,
                                    previous_tonnes: 0,
                                    maxis_tonnes: 0,
                                    boxed_state: false,
                                };
                                setNewCales([...newCales, lastCale]);
                                dispatch(DataAction.resetCales([...newCales, lastCale]));
                                dispatch(DataAction.changeCale(lastCale.uid));
                                setNewName("");
                                setNewColor(generateRandomBlueGreenColor());
                            }
                        }}
                        disabled={!newName.trim()}
                    >
                        Utiliser
                    </button>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
                Annuler
            </Button>
            <Button variant="primary" onClick={handleSaveParams}>
                Enregistrer
            </Button>
        </Modal.Footer>
    </Modal>
}

function backupCurrentDateTime(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = monthNames[now.getMonth()];  
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    return `Stepe ${month}${day}_${hour}${minute}.xlsx`;
}

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (reference: number, columnId: string, value: unknown) => void
    }
}

const columnHelper = createColumnHelper<export_stepe_catalog_Data>();

const EditableCell = ({ getValue, row, column, table }: any) => {
    const initialValue = getValue()
    const [value, setValue] = React.useState(initialValue)
    const onBlur = () => {
        table.options.meta?.updateData(row.original.reference, column.id, value);
    }

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return (
        <input
            value={value as string}
            onChange={e => setValue(e.target.value)}
            onBlur={onBlur}
            style={{width: "59px"}}
        />
    )
};

const globalFilterFn: FilterFn<export_stepe_catalog_Data> = (row, columnId, filterValue: string) => {
    const search = filterValue.toLowerCase();
    let value = row.getValue(columnId) as string;
    if (typeof value === 'number') value = String(value);
    return value?.toLowerCase().includes(search);
};

const useColumns = function useColumns(): any[] {
    const closeToast = () => {
        toast.dismiss();
    };
    const cales = useSelector<RootState, ICale[]>(state => state.dataSS.cales).reduce<{[key: string]: string}>((acc, cale) => {
        acc[cale.uid] = cale.name;
        return acc;
    }, {});
    const columns = [
        columnHelper.accessor('rank', {
            header: () => 'RANG',
            filterFn: fuzzyFilter,
        }),
        columnHelper.accessor('prepa', {
            header: () => 'PREPA',
            cell: EditableCell,
            filterFn: fuzzyFilter,
        }),
        columnHelper.accessor('reference', {
            header: 'REF',
            cell: ({ row }: any) => (
                <div>
                    <Button onClick={() => {
                        toast(<Msg2 closeToast={closeToast} row2={row.original.reference} />,
                        { position: toast.POSITION.TOP_RIGHT, autoClose: 3500 });
                        }}>{SpaceatPos(row.original.reference)}
                    </Button>
            </div>
            ),
            filterFn: fuzzyFilter,
        }),
        columnHelper.accessor('weight', {
            header: "POIDS",
            cell: info => info.getValue(),
            filterFn: fuzzyFilter,
        }),
        columnHelper.accessor('destination', {
            header: 'DEST',
            cell: info => cales[info.getValue()],
            filterFn: fuzzyFilter,
        })
    ];
    return columns;
}

export default function DataTable() {
    const dispatch = useDispatch();
    const [PickerColorForSelectedCale, setPickerColorForSelectedCale] = useState<{ [key: string]: string }>({});
    const [newSelectedCale, setnewSelectedCale] = useState<string>('');
    const [showParams, setShowParams] = useState(false);
    const toggleParams = () => {setShowParams(!showParams)}
    const [newColor, setNewColor] = useState<string>('');
    const selectedCale = useSelector<RootState, string>((state) => state.dataSS.selectedCale);
    const cales = useSelector<RootState, ICale[]>(state => state.dataSS.cales);
    const selectedColors = cales.reduce<{ [key: string]: string }>((colors, cale) => {
        colors[cale.uid] = cale.color;
        return colors;
    }, {});
    const setSelectedColors = (cale: string, color: string) => {
        dispatch(DataAction.changePickColors(cale, color));
    }
    const handleStabiloClick = () => { setnewSelectedCale(selectedCale); };
    const handleCloseModal = () => { setnewSelectedCale(""); };
    const handleColorChange = (color: ColorResult) => {
        setSelectedColors(newSelectedCale, color.hex);
        const updateStickerdColors = { ...PickerColorForSelectedCale, [selectedCale]: color.hex };
        setPickerColorForSelectedCale(updateStickerdColors);
    };
    const handleSaveChanges = () => {
        setnewSelectedCale("");
        dispatch(DataAction.changeCale(newSelectedCale));
    };
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('')
    const data = useSelector<RootState, export_stepe_catalog_Data[]>(state =>
        state.dataSS.catalog_data_state.map(row => ({
            ...row,
            destination: row.destination || 'stock',
        }))
    );
    const [showMoreCols, setShowMoreCols] = useState(false);
    const columns = useColumns();
    let extendedColumns = columns;
    if (showMoreCols) {
        extendedColumns = [
            ...columns,
            columnHelper.accessor('length', {
                header: 'LONGR',
                cell: info => info.getValue(),
                filterFn: fuzzyFilter,
            }),
            columnHelper.accessor('width', {
                header: 'LARGR',
                cell: info => info.getValue(),
                filterFn: fuzzyFilter,
            })
        ];
    }
    const table = useReactTable({
        data,
        columns: extendedColumns,
        initialState: {
            pagination: {
                pageSize: parseInt(window.localStorage.getItem("pageSize") || `${pageOptions[0]}`),
            }
        },
        state: {
            sorting,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
        meta: {
            updateData: (reference, columnId, value) => {
                if(columnId === "prepa") {
                    dispatch(DataAction.updateRow(reference, columnId, value));
                }
            },
        },
        getRowId: (row) => {return row.reference; } ,
        debugTable: true,
    });
    const setPageSize = (size: number) => {
        table.setPageSize(size);
        window.localStorage.setItem("pageSize", `${size}`);
    }
    const tableContainerRef = React.useRef<HTMLDivElement>(null)
    const exportData = () => {
        const aoa: any[][] = [HEADER.map(h => h.name)];
        for (const row of data) {
            aoa.push(HEADER.map(h => row[h.key as keyof export_stepe_catalog_Data]));
        }
        const sheet = utils.aoa_to_sheet(aoa)
        const wb = utils.book_new();
        utils.book_append_sheet(wb, sheet);
        writeFile(wb, backupCurrentDateTime())
    };
    const clear = () => dispatch(DataAction.clear());
    const [hold, setHold] = useState('');
    const handleHoldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === "manage_affectations") {
            toggleParams();
            return;
        }
        dispatch(DataAction.changeCale(e.target.value)) 
        setHold(e.target.value);
    }
    const isStabiloButtonVisible = selectedCale !== "stock";
    const [checkedRows, setCheckedRows] = useState<{ [key: number]: boolean }>({});
    return ( 
        <>
            <div className="d-flex">
                <div style={{maxWidth: 90}}>
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onChange={value => setGlobalFilter(String(value))}
                        className="p-2 font-lg shadow border border-block"
                        placeholder="Filtre"
                    />
                </div>
                &nbsp;
                <div style={{maxWidth: 350 }}>
                    <Form.Select placeholder="vers..." value={selectedCale}
                        onChange={(e) => handleHoldChange(e)}
                        style={{ backgroundColor: cales.find(c => c.uid === selectedCale)?.color || '#fff', color: '#000' }}
                        >
                        { cales.map(
                            d => <option key={d.name} value={d.uid} style={{backgroundColor:d.color, color: '#12345'}}>
                                {d.name}
                            </option>
                        )}
                    <option value="manage_affectations" style={{ color: 'white', backgroundColor: 'black' }} onClick={toggleParams}>--- Gestion ---</option>
                    </Form.Select>
                </div>
                &nbsp;
                &nbsp;
                {isStabiloButtonVisible && (
                    <Button variant="warning" onClick={handleStabiloClick}>S</Button>
                )}
                &nbsp;
                <Button variant="success" onClick={exportData}>Export</Button>
                &nbsp;
                <Button variant="danger" onClick={clear}>Import</Button>
                &nbsp;
                <Button style={{ backgroundColor: '#17bebb', color: 'white' }} onClick={() => {
                    setShowMoreCols(prev => !prev);
                }}>MoRe</Button>
                &nbsp;
                
            </div>
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : <div
                                        {...{
                                            className: header.column.getCanSort()
                                                ? 'cursor-pointer select-none'
                                                : '',
                                        }}
                                    >
                                        <div {...{
                                            onClick: header.column.getToggleSortingHandler(),
                                        }}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                        {header.column.getCanFilter() ? (
                                            <div>
                                                <Filter column={header.column} table={table} />
                                            </div>
                                        ) : null}
                                    </div>}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <div ref={tableContainerRef} className="overflow-auto" style={{maxHeight: "490px"}}>
                <TableRS>
                    <tbody className="overflow-auto" style={{maxHeight: "100px"}}>
                    {table.getRowModel().rows.map(row => {
                        const destinationUid = String(row.getValue("destination"));
                        const rowColor = selectedColors[destinationUid] || '#fff';
                        return (
                            <tr 
                                key={row.id} 
                                style={{ backgroundColor: rowColor }}
                            >
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>

                    <tfoot>
                    </tfoot>
                </TableRS>
            </div>
            <div className="h-2" />
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>&nbsp;&nbsp;&nbsp;&nbsp;
                


                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>&nbsp;&nbsp;&nbsp;&nbsp;

                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>&nbsp;&nbsp;&nbsp;&nbsp;

                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>&nbsp;&nbsp;&nbsp;&nbsp;

                <span className="flex items-center gap-1">
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>
                </span>
                &nbsp;&nbsp;
                <span className="flex items-center gap-1">
                    | Vers : &nbsp;&nbsp;&nbsp;&nbsp;
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16"
                        style={{maxWidth: 40 }}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {pageOptions.map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
                
            </div>

            <Modal show={Boolean(newSelectedCale)} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Modifier la valeur et la couleur</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                <Form.Label>Nouvelle couleur</Form.Label>
                <SketchPicker
                    color={PickerColorForSelectedCale[newSelectedCale] || '' }
                    onChange={handleColorChange}
                />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                Annuler
                </Button>
                <Button variant="primary" onClick={handleSaveChanges}>
                Enregistrer
                </Button>
            </Modal.Footer>
            </Modal>
            <CalesModal show={showParams} onHide={toggleParams} />
        </>
    );
}
