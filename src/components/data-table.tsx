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
import {Data} from "../stores/data/DataReducer";
import DebouncedInput from "./debounceInput";
import DataAction from "../stores/data/DataAction";
import {colors, affectation, HEADER} from "../utils/destination";
import Filter, {fuzzyFilter} from "./filter";
import './index-tanstack.css'


//FRED ****************************************************************
import SpaceatPos from "./SpaceatPos";
import * as fs from 'fs'
import * as path from 'path'

const monthNames = [
    'jan', 'fev', 'mar', 'avr', 'mai', 'juin',
    'juil', 'aou', 'sep', 'oct', 'nov', 'dec'
  ];

function backupCurrentDateTime(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = monthNames[now.getMonth()];  

  //const month = String(now.getMonth() + 1).padStart(2, '0');
  //const year = String(now.getFullYear());
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  return `Stepe ${month}${day}_${hour}${minute}.xlsx`;
}

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (reference: number, columnId: string, value: unknown) => void
    }
}

const columnHelper = createColumnHelper<Data>();

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
            // largeur prepa box
        />
    )
};

const globalFilterFn: FilterFn<Data> = (row, columnId, filterValue: string) => {
    const search = filterValue.toLowerCase();

    let value = row.getValue(columnId) as string;
    if (typeof value === 'number') value = String(value);

    return value?.toLowerCase().includes(search);
};

const useColumns = function useColumns(): any[] {
    const dispatch = useDispatch();

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
// #####################################################################################################################
        columnHelper.accessor('reference', {
            header: 'REF',
            cell: ({row}: any) =>
                <Button 
                    onClick={() => {
                    dispatch(DataAction.moveRow(row.original.reference)); //je change la detination de ref cale1,cale2, etc..
                    }}
                >
                    {SpaceatPos(row.original.reference)}
                </Button>,
            filterFn: fuzzyFilter,

        }),
// #####################################################################################################################

        columnHelper.accessor('weight', {
            header: "POIDS",
            cell: info => info.getValue(),
            filterFn: fuzzyFilter,
        }),
        columnHelper.accessor('destination', {
            header: 'DEST',
            filterFn: fuzzyFilter,
        })
    ];

    return columns;
}
//***********************************************************************/
//***********************************************************************/
//***********************************************************************/
//***********************************************************************/
export default function DataTable() {
    const dispatch = useDispatch();
    // const [showModal, setShowModal] = useState(false);
    const [PickerColorForSelectedCale, setPickerColorForSelectedCale] = useState<{ [key: string]: string }>({});
    const [newSelectedCale, setnewSelectedCale] = useState<string>('');
    const [newColor, setNewColor] = useState<string>('');
    // const [textColor, setTextColor] = useState('black'); // État pour gérer la couleur du texte
    // const [selectedColor, setSelectedColor] = useState('#fff'); // Couleur par défaut
    // const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>(colors); // Couleur par défaut
    
    // Accédez à la valeur sélectionnée depuis l'état Redux
    const selectedCale = useSelector<RootState, string>((state) => state.data.selectedCale);
    const selectedColors = useSelector<RootState, { [key: string]: string }>((state) => state.data.pickerColors);
    const setSelectedColors = (colors: { [key: string]: string }) => {
        dispatch(DataAction.changePickColors(colors));
    }
    
    const handleStabiloClick = () => { 
        // setShowModal(true); 
        setnewSelectedCale(selectedCale);
    };
    const handleCloseModal = () => { 
        // setShowModal(false); 
        setnewSelectedCale(""); 
    };
    const handleColorChange = (color: ColorResult) => {
        // setSelectedColor(color.hex);
        setSelectedColors({...selectedColors, [newSelectedCale]: color.hex});

        const updateStickerdColors = { ...PickerColorForSelectedCale, [selectedCale]: color.hex };
        setPickerColorForSelectedCale(updateStickerdColors);
    };
    
    const handleSaveChanges = () => {
        // Mettez à jour la couleur pour toutes les affectation identiques
        const updatedData = data.map((item) => {
          if (item.destination === newSelectedCale) {
            return { ...item, color: newColor };
          }
          return item;
        });
    
        // Mettez à jour l'état des données avec les modifications
        // dispatch(DataAction.updateData(updatedData));
       
        dispatch(DataAction.changeCouleur([newSelectedCale]));
    
        // Fermez la fenêtre contextuelle
        // setShowModal(false);
        setnewSelectedCale("");
      };

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('')
    const cale = useSelector<RootState, string>(state => state.data.selectedCale);
    const data = useSelector<RootState, Data[]>(state => state.data.data);
    const columns = useColumns();
    
    const table = useReactTable({
        data,
        columns,
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
    }
    );
    
    const tableContainerRef = React.useRef<HTMLDivElement>(null)
    const exportData = () => {
        const aoa: any[][] = [HEADER.map(h => h.name)];
        for (const row of data) {
            aoa.push(HEADER.map(h => row[h.key as keyof Data]));
        }
        const sheet = utils.aoa_to_sheet(aoa)
        const wb = utils.book_new();
        utils.book_append_sheet(wb, sheet);
        writeFile(wb, backupCurrentDateTime())
    };

    const clear = () => dispatch(DataAction.clear());
    const [hold, setHold] = useState('');
    
    const handleHoldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(DataAction.changeCale(e.target.value)) 
        const selectedWorkingHoldValue = (e.target.value);
        const selectedWorkingHoldOption = affectation.find((d) => d.name === selectedWorkingHoldValue);
        setHold(selectedWorkingHoldValue);
        
    }

    const isStabiloButtonVisible = cale !== "stock"; // Condition pour déterminer la visibilité du bouton STABILO
    // const TempColors = affectation.map((d) => d.color);
    
    // const [checkedRows, setCheckedRows] = useState<{ [key: number]: boolean }>({});
    const [checkedRows, setCheckedRows] = useState<{ [key: number]: boolean }>({});
    const handleCheckboxClick = (reference: number) => {
        const updatedCheckedRows = { ...checkedRows };
        updatedCheckedRows[reference] = !updatedCheckedRows[reference];
        setCheckedRows(updatedCheckedRows);
    };



    return ( 
        <>
            <div className="d-flex">
                <div style={{maxWidth: 90}}>
                    {/* 11 chiffres POUR LE CHAMP search de rang*/}
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onChange={value => setGlobalFilter(String(value))}
                        className="p-2 font-lg shadow border border-block"
                        placeholder="Filtre"
                    />
                </div>
                &nbsp;
                <div style={{maxWidth: 350 }}>
                    {/* largeur form select stock cale */}
                    <Form.Select placeholder="vers..." value={cale} 
                        onChange={(e) => handleHoldChange(e)}
                        style={{ backgroundColor: selectedColors[cale] }}
                        >
                        { affectation.map(
                            d => <option key={d.name} value={d.name} style={{backgroundColor:d.color}}>
                                {d.name}
                            </option>
                        )}
                    </Form.Select>
                </div>
                &nbsp;
                {isStabiloButtonVisible && (
                    <Button variant="warning" onClick={handleStabiloClick}>S</Button>
                )}
                &nbsp;
                <Button variant="success" onClick={exportData}>Export</Button>
                &nbsp;
                <Button variant="danger" onClick={clear}>Import</Button>
                &nbsp;
                {/* {isStabiloButtonVisible && (
                    <Button variant="warning" onClick={handleStabiloClick}>Stabilo</Button>
                )}
                {/* <Button variant="warning" onClick={handleStabiloClick}>Stabilo</Button> */}
                {/* &nbsp; */}
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
                {/* hauteur du tableau data 500 px*/}
                <TableRS>
                    <tbody className="overflow-auto" style={{maxHeight: "100px"}}>
                    {table.getRowModel().rows.map(row => {
                        // const reference = row.original.reference as number;
                        const reference = parseInt(row.original.reference, 10);
                        
                        const isChecked = checkedRows[reference] || false;

            return (
                                <tr 
                                    key={row.id} 
                                    style={{
                                        // backgroundColor: colors[row.getValue("destination") as string]}}>
                                        backgroundColor: selectedColors[row.getValue("destination") as string]
                                    }}
                                >
                                    {/* //fred jeudi */}
                                    {/* <td>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onClick={() => handleCheckboxClick(reference)}
                                        />
                                    </td> */}
                                    {/* //fred jeudi */}
                                    
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
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
                    // onclick={() => table.index
                >
                    {'>>'}
                </button>&nbsp;&nbsp;&nbsp;&nbsp;

                <span className="flex items-center gap-1">
                    {/* <div>Page</div> */}
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
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 40, 80, 120, 200].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
                
            </div>

            {/* Modale pour modifier la valeur et la couleur */}
            {/* <Modal show={showModal} onHide={handleCloseModal}> */}
            <Modal show={Boolean(newSelectedCale)} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Modifier la valeur et la couleur</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                <Form.Label>Nouvelle couleur</Form.Label>
                <SketchPicker
                    // color={selectedColor} // color fixé par tableau                    
                    // color={selectedColors[newSelectedCale]}
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
        </>
    );
}
