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
import {export_stepe_catalog_Data} from "../stores/dataS/DataReducer";
import DebouncedInput from "./debounceInput";
import DataAction from "../stores/dataS/DataAction";
import {colors, affectation as initialAffectation, HEADER} from "../utils/destination";
import Filter, {fuzzyFilter} from "./filter";
import './index-tanstack.css'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Msg2 from "./Msg2";

//FRED ****************************************************************
import SpaceatPos from "./SpaceatPos";
import Msg from "./Msg"
import AffectationManager from "../components/AffectationManager";

const row = {
    original: {
        reference: 133
    }
};

const monthNames = [
    'jan', 'fev', 'mar', 'avr', 'mai', 'juin',
    'juil', 'aou', 'sep', 'oct', 'nov', 'dec'
    ];

const pageOptions = [10, 40, 80, 120, 200];


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
            // largeur prepa box
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

const dispatch = useDispatch();
//FRED
/* const closeToast = () => {
    // Code pour fermer le toast
}; */

const closeToast = () => {
    toast.dismiss();
};
const row = {
    original: {
        reference: 123 // Assurez-vous que cela correspond à la structure de vos données
    }
};

/* const Msg2 = ({closedToast,row2}:any) => (
    <div>
        {SpaceatPos(row2)}
        <Button onClick={dispatch(DataAction.moveRow(row2))}>{SpaceatPos(row2)}</Button>
        <Button onClick={closeToast}>Close</Button>
    </div>
    ) */

/* const handleButtonClick = (reference: string) => {
    toast(({ closeToast }) => (
        <Msg
            closeToast={closeToast}
            onValidate={() => {
                dispatch(DataAction.moveRow(reference));
                // closeToast();
                if (closeToast) {
                    closeToast();
                }
                
            }}
        />
    ));
}; */


//FRED


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
// /* // #####################################################################################################################
//         columnHelper.accessor('reference', {
//             header: 'REF',
//             cell: ({row}: any) =>
                
//                 <Button 
//                     onClick={() => {
//                     dispatch(DataAction.moveRow(row.original.reference)); //je change la detination de ref cale1,cale2, etc..
//                     }}
//                 >
//                     {SpaceatPos(row.original.reference)}
//                 </Button>,
                
//             filterFn: fuzzyFilter,

//         }),
// ##################################################################################################################### */
        columnHelper.accessor('reference', {
            header: 'REF',
            cell: ({ row }: any) => (
                <div>
                    <Button onClick={() => {
                        toast(<Msg2 closeToast={closeToast} row2={row.original.reference} />,
                        { position: toast.POSITION.TOP_RIGHT, autoClose: 3000 });
                }}>{SpaceatPos(row.original.reference)}
            </Button>
            </div>
            ),
            filterFn: fuzzyFilter,
        }),
// ##################################################################################################################### */
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
    const [affectation, setAffectation] = useState(initialAffectation); // Utiliser les données initiales
    const [PickerColorForSelectedCale, setPickerColorForSelectedCale] = useState<{ [key: string]: string }>({});
    const [newSelectedCale, setnewSelectedCale] = useState<string>('');
    const [newColor, setNewColor] = useState<string>('');
    const [showAffectationManager, setShowAffectationManager] = useState(false); // État pour afficher ou masquer AffectationManager
    
    // Accédez à la valeur sélectionnée depuis l'état Redux
    const selectedCale = useSelector<RootState, string>((state) => state.dataSS.selectedCale);
    const selectedColors = useSelector<RootState, { [key: string]: string }>((state) => state.dataSS.pickerColors);
    const setSelectedColors = (colors: { [key: string]: string }) => {
        dispatch(DataAction.changePickColors(colors));
    }
    
    const handleStabiloClick = () => {
        setnewSelectedCale(selectedCale); // Ouvre la modale pour la cale sélectionnée
    };

    const handleCloseModal = () => { 
        setnewSelectedCale(""); 
    };

    const handleColorChange = (color: ColorResult) => {
        // Mettre à jour les couleurs dans l'état local
        setSelectedColors({ ...selectedColors, [newSelectedCale]: color.hex });

        // Mettre à jour les couleurs dans l'état local pour les PickerColors
        const updatedPickerColors = { ...PickerColorForSelectedCale, [selectedCale]: color.hex };
        setPickerColorForSelectedCale(updatedPickerColors);

        // Si vous utilisez Redux, mettez à jour les couleurs dans le store
        dispatch(DataAction.changePickColors({ ...selectedColors, [newSelectedCale]: color.hex }));
    };
    
    const handleSaveChanges = () => {
        // Mettre à jour les données locales
        const updatedData = data.map((item) => {
            if (item.destination === newSelectedCale) {
                return { ...item, color: newColor };
            }
            return item;
        });

        // Mettre à jour les couleurs dans Redux
        dispatch(DataAction.changeCouleur([newSelectedCale]));

        // Réinitialiser la sélection
        setnewSelectedCale("");
    };

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('')
    const cale = useSelector<RootState, string>(state => state.dataSS.selectedCale);
    const data = useSelector<RootState, export_stepe_catalog_Data[]>(state => state.dataSS.catalog_data_state);
    const columns = useColumns();
    
    const table = useReactTable({
        data,
        columns,
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
    }
    );

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
        const selectedValue = e.target.value;

        if (selectedValue === "manage_affectations") {
            setShowAffectationManager(true); // Ouvrir AffectationManager
        } else {
            dispatch(DataAction.changeCale(selectedValue));
        }
    };

    const handleCloseAffectationManager = () => {
        setShowAffectationManager(false); // Fermer AffectationManager
    };

    const isStabiloButtonVisible = cale !== "stock"; // Condition pour déterminer la visibilité du bouton STABILO
    
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
                    <Form.Select placeholder="vers..." value={cale} 
                        onChange={(e) => handleHoldChange(e)}
                        style={{ backgroundColor: selectedColors[cale] }}
                        >
                        { affectation.map(
                            d => <option key={d.name} value={d.name} style={{backgroundColor:d.color}}>
                                {d.name}
                            </option>
                        )}
                        <option value="manage_affectations">--- Gestion des Affectations ---</option>
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
                    <tbody className="overflow-auto" style={{ maxHeight: "100px" }}>
                        {table.getRowModel().rows.map((row) => {
                            const destination = row.getValue("destination") as string;
                            const affectationColor = selectedColors[destination] || affectation.find((a) => a.name === destination)?.color || "#ffffff"; // Couleur par défaut

                            return (
                                <tr
                                    key={row.id}
                                    style={{
                                        backgroundColor: affectationColor, // Appliquer la couleur de l'affectation
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => {
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

            <Modal show={showAffectationManager} onHide={handleCloseAffectationManager}>
                <Modal.Header closeButton>
                    <Modal.Title>Gestion des Affectations</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AffectationManager
                        affectation={affectation}
                        setAffectation={setAffectation}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAffectationManager}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
